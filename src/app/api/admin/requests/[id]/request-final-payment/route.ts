import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendFinalPaymentEmail } from "@/lib/email";
import Stripe from "stripe";

// Lazy initialization to avoid build-time errors when env vars aren't available
function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the repair request
    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id },
    });

    if (!repairRequest) {
      return NextResponse.json(
        { error: "Repair request not found" },
        { status: 404 }
      );
    }

    // Validate the request is in the right state
    if (repairRequest.paymentStatus === "PAID_IN_FULL") {
      return NextResponse.json(
        { error: "This request has already been paid in full" },
        { status: 400 }
      );
    }

    if (repairRequest.paymentStatus !== "DEPOSIT_PAID") {
      return NextResponse.json(
        { error: "Deposit must be paid before requesting final payment" },
        { status: 400 }
      );
    }

    if (!repairRequest.quoteAmount) {
      return NextResponse.json(
        { error: "No quote amount set for this request" },
        { status: 400 }
      );
    }

    // Calculate remaining balance
    const amountPaid = repairRequest.amountPaid || 0;
    const remainingBalance = repairRequest.quoteAmount - amountPaid;

    if (remainingBalance <= 0) {
      // Already paid in full, update status
      await prisma.repairRequest.update({
        where: { id },
        data: {
          paymentStatus: "PAID_IN_FULL",
        },
      });
      return NextResponse.json(
        { error: "No remaining balance - already paid in full" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://arbafix.com';

    // Create Stripe Checkout Session for the remaining balance
    const stripeSession = await getStripeClient().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Final Payment - ${repairRequest.ticketNumber}`,
              description: `${repairRequest.deviceType} repair - Remaining balance`,
            },
            unit_amount: remainingBalance,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment/success?ticket=${repairRequest.ticketNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancelled?ticket=${repairRequest.ticketNumber}`,
      customer_email: repairRequest.customerEmail,
      metadata: {
        ticketNumber: repairRequest.ticketNumber,
        type: "final",
        repairRequestId: repairRequest.id,
      },
    });

    // Update the repair request to indicate payment has been requested
    await prisma.repairRequest.update({
      where: { id },
      data: {
        paymentStatus: "PAYMENT_REQUESTED",
        stripeSessionId: stripeSession.id,
      },
    });

    // Send final payment email to customer
    const emailResult = await sendFinalPaymentEmail({
      ticketNumber: repairRequest.ticketNumber,
      customerName: repairRequest.customerName,
      customerEmail: repairRequest.customerEmail,
      deviceType: repairRequest.deviceType,
      quoteAmount: repairRequest.quoteAmount,
      depositPaid: amountPaid,
      remainingBalance,
      paymentUrl: stripeSession.url!,
    });

    if (!emailResult.success) {
      console.error("[request-final-payment] Failed to send email:", emailResult.error);
      // Don't fail the request, the payment link was created
    }

    return NextResponse.json({
      success: true,
      paymentUrl: stripeSession.url,
      remainingBalance,
      message: "Final payment request sent successfully",
    });
  } catch (error) {
    console.error("[request-final-payment] Error:", error);
    return NextResponse.json(
      { error: "Failed to request final payment" },
      { status: 500 }
    );
  }
}
