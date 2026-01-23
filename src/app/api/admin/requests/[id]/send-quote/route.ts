import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendQuoteEmail } from "@/lib/email";
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
    const body = await request.json();
    const { quoteAmount, depositAmount } = body;

    if (!quoteAmount || quoteAmount <= 0) {
      return NextResponse.json(
        { error: "Quote amount is required and must be greater than 0" },
        { status: 400 }
      );
    }

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

    // Check if already paid
    if (repairRequest.paymentStatus === "PAID_IN_FULL") {
      return NextResponse.json(
        { error: "This request has already been paid in full" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://arbafix.com';

    // Create Stripe Checkout Session for the quote
    const paymentAmount = depositAmount || quoteAmount;
    const paymentType = depositAmount ? "deposit" : "full";

    const stripeSession = await getStripeClient().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Repair ${paymentType === "deposit" ? "Deposit" : "Payment"} - ${repairRequest.ticketNumber}`,
              description: `${repairRequest.deviceType} repair - ${paymentType === "deposit" ? "Deposit" : "Full payment"}`,
            },
            unit_amount: paymentAmount,
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
        type: paymentType,
        repairRequestId: repairRequest.id,
      },
    });

    // Update the repair request with quote info
    await prisma.repairRequest.update({
      where: { id },
      data: {
        quoteAmount,
        depositAmount: depositAmount || null,
        paymentStatus: "QUOTE_SENT",
        stripeSessionId: stripeSession.id,
      },
    });

    // Send quote email to customer
    const emailResult = await sendQuoteEmail({
      ticketNumber: repairRequest.ticketNumber,
      customerName: repairRequest.customerName,
      customerEmail: repairRequest.customerEmail,
      deviceType: repairRequest.deviceType,
      issueDescription: repairRequest.issueDescription,
      quoteAmount,
      depositAmount: depositAmount || null,
      paymentUrl: stripeSession.url!,
    });

    if (!emailResult.success) {
      console.error("[send-quote] Failed to send quote email:", emailResult.error);
      // Don't fail the request, the quote was saved
    }

    return NextResponse.json({
      success: true,
      paymentUrl: stripeSession.url,
      message: "Quote sent successfully",
    });
  } catch (error) {
    console.error("[send-quote] Error:", error);
    return NextResponse.json(
      { error: "Failed to send quote" },
      { status: 500 }
    );
  }
}
