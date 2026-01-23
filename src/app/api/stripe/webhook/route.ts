import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { sendPaymentConfirmationEmail, sendAdminPaymentNotificationEmail } from "@/lib/email";

// Lazy initialization to avoid build-time errors when env vars aren't available
function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getWebhookSecret(): string {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("[Stripe Webhook] No signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = getStripeClient().webhooks.constructEvent(body, signature, getWebhookSecret());
    } catch (err) {
      console.error("[Stripe Webhook] Signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    console.log("[Stripe Webhook] Event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const ticketNumber = session.metadata?.ticketNumber;
      const paymentType = session.metadata?.type;

      if (!ticketNumber) {
        console.error("[Stripe Webhook] No ticketNumber in metadata");
        return NextResponse.json({ error: "Missing ticketNumber" }, { status: 400 });
      }

      console.log(`[Stripe Webhook] Processing payment for ticket: ${ticketNumber}`);

      // Get the repair request
      const repairRequest = await prisma.repairRequest.findUnique({
        where: { ticketNumber },
      });

      if (!repairRequest) {
        console.error(`[Stripe Webhook] Repair request not found: ${ticketNumber}`);
        return NextResponse.json({ error: "Repair request not found" }, { status: 404 });
      }

      // Determine payment status and new repair status
      const amountPaid = session.amount_total || 0;
      const quoteAmount = repairRequest.quoteAmount || 0;
      const previouslyPaid = repairRequest.amountPaid || 0;
      const totalPaid = previouslyPaid + amountPaid;

      let newPaymentStatus: string;
      let newRepairStatus: string;

      // Determine status based on payment type and amount
      if (paymentType === "final" || totalPaid >= quoteAmount) {
        newPaymentStatus = "PAID_IN_FULL";
        // If this is the final payment after repair complete, keep current status or set to REPAIR_COMPLETE
        // The admin will manually mark as SHIPPED after adding tracking
        newRepairStatus = repairRequest.status === "REPAIR_COMPLETE" ? "REPAIR_COMPLETE" : repairRequest.status;
      } else if (paymentType === "deposit") {
        newPaymentStatus = "DEPOSIT_PAID";
        // After deposit paid, status moves to DEPOSIT_PAID (customer should ship device)
        newRepairStatus = "DEPOSIT_PAID";
      } else {
        // Full payment upfront
        newPaymentStatus = totalPaid >= quoteAmount ? "PAID_IN_FULL" : "DEPOSIT_PAID";
        newRepairStatus = totalPaid >= quoteAmount ? "DEPOSIT_PAID" : "DEPOSIT_PAID";
      }

      // Update the repair request
      await prisma.repairRequest.update({
        where: { ticketNumber },
        data: {
          amountPaid: totalPaid,
          paymentStatus: newPaymentStatus,
          stripePaymentId: session.payment_intent as string,
          status: newRepairStatus,
        },
      });

      console.log(`[Stripe Webhook] Updated repair request:`, {
        ticketNumber,
        amountPaid: totalPaid,
        paymentStatus: newPaymentStatus,
        status: newRepairStatus,
      });

      // Send confirmation emails (non-blocking)
      Promise.all([
        sendPaymentConfirmationEmail({
          ticketNumber,
          customerName: repairRequest.customerName,
          customerEmail: repairRequest.customerEmail,
          deviceType: repairRequest.deviceType,
          amountPaid,
          paymentType: paymentType || "payment",
          totalQuote: quoteAmount,
          totalPaid,
        }),
        sendAdminPaymentNotificationEmail({
          ticketNumber,
          customerName: repairRequest.customerName,
          customerEmail: repairRequest.customerEmail,
          deviceType: repairRequest.deviceType,
          amountPaid,
          paymentType: paymentType || "payment",
          requestId: repairRequest.id,
        }),
      ]).catch((err) => {
        console.error("[Stripe Webhook] Error sending confirmation emails:", err);
      });

      return NextResponse.json({ received: true, ticketNumber, status: newPaymentStatus });
    }

    // Handle other event types if needed
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Next.js App Router uses request.text() to get raw body, no config needed
