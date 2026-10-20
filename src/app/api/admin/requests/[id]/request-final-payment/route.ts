import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendFinalPaymentEmail } from "@/lib/email";
import { createCheckoutSession, getPayUrl } from "@/lib/checkout";

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
    if (repairRequest.status !== "REPAIR_COMPLETE") {
      return NextResponse.json(
        { error: "Repair must be marked as complete before requesting final payment" },
        { status: 400 }
      );
    }

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

    // Create Stripe Checkout Session for the remaining balance
    const stripeSession = await createCheckoutSession({
      ticketNumber: repairRequest.ticketNumber,
      repairRequestId: repairRequest.id,
      customerEmail: repairRequest.customerEmail,
      deviceType: repairRequest.deviceType,
      amount: remainingBalance,
      type: "final",
    });
    const paymentUrl = getPayUrl(repairRequest.ticketNumber);

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
      paymentUrl,
    });

    if (!emailResult.success) {
      console.error("[request-final-payment] Failed to send email:", emailResult.error);
      // Don't fail the request, the payment link was created
    }

    return NextResponse.json({
      success: true,
      paymentUrl,
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
