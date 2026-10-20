import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createCheckoutSession, getBaseUrl, getStripeClient } from "@/lib/checkout";

export const dynamic = "force-dynamic";

// Stable payment link used in quote and final-payment emails. Redirects to the
// ticket's open Stripe Checkout session, or creates a fresh one if it expired.
// The amount comes from the ticket, so anyone with the link can only pay what is owed.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ticket: string }> }
) {
  const { ticket } = await params;
  const ticketNumber = decodeURIComponent(ticket).trim().toUpperCase();
  const trackUrl = `${getBaseUrl()}/track?ticket=${encodeURIComponent(ticketNumber)}`;

  try {
    const repairRequest = await prisma.repairRequest.findUnique({ where: { ticketNumber } });
    if (!repairRequest) {
      return NextResponse.redirect(`${getBaseUrl()}/track`, 303);
    }

    let amount: number;
    let type: "deposit" | "full" | "final";

    if (repairRequest.paymentStatus === "QUOTE_SENT" && repairRequest.depositAmount) {
      amount = repairRequest.depositAmount;
      type = repairRequest.depositPercent === 100 ? "full" : "deposit";
    } else if (repairRequest.paymentStatus === "PAYMENT_REQUESTED" && repairRequest.quoteAmount) {
      amount = repairRequest.quoteAmount - (repairRequest.amountPaid || 0);
      type = "final";
    } else {
      // Nothing owed right now (not quoted yet, already paid, etc.)
      return NextResponse.redirect(trackUrl, 303);
    }

    if (amount <= 0) {
      return NextResponse.redirect(trackUrl, 303);
    }

    // Reuse the current session while it is still open so repeat clicks don't pile up sessions.
    if (repairRequest.stripeSessionId) {
      try {
        const existing = await getStripeClient().checkout.sessions.retrieve(repairRequest.stripeSessionId);
        if (
          existing.status === "open" &&
          existing.url &&
          existing.amount_total === amount &&
          existing.metadata?.type === type
        ) {
          return NextResponse.redirect(existing.url, 303);
        }
      } catch (err) {
        console.error("[pay] Could not retrieve existing session:", err);
      }
    }

    const session = await createCheckoutSession({
      ticketNumber,
      repairRequestId: repairRequest.id,
      customerEmail: repairRequest.customerEmail,
      deviceType: repairRequest.deviceType,
      amount,
      type,
      depositPercent: repairRequest.depositPercent ?? undefined,
    });

    await prisma.repairRequest.update({
      where: { id: repairRequest.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error) {
    console.error("[pay] Error creating checkout session:", error);
    return NextResponse.redirect(trackUrl, 303);
  }
}
