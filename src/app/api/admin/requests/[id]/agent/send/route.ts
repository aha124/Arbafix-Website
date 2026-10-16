import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendTicketMessageEmail } from "@/lib/email";
import { createAndSendQuote, QuoteError } from "@/lib/quotes";
import { recordOutbound } from "@/lib/agent/repairAgent";

// Send a reviewed draft. sendAs "quote" creates the Stripe link and sends the
// quote email with the body as a personal note; "message" sends a plain email.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const { draftId, subject, emailBody, sendAs, quoteAmount, depositPercent } = await request.json();

    if (!emailBody || typeof emailBody !== "string" || !emailBody.trim()) {
      return NextResponse.json({ error: "Email body is empty" }, { status: 400 });
    }
    if (sendAs !== "quote" && sendAs !== "message") {
      return NextResponse.json({ error: "sendAs must be quote or message" }, { status: 400 });
    }

    const ticket = await prisma.repairRequest.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Repair request not found" }, { status: 404 });
    }

    if (draftId) {
      const draft = await prisma.agentDraft.findFirst({ where: { id: draftId, requestId: id } });
      if (!draft || draft.status !== "DRAFT") {
        return NextResponse.json({ error: "Draft was already sent or replaced. Refresh the page." }, { status: 409 });
      }
    }

    let finalSubject = (subject && String(subject).trim()) || `Your repair request ${ticket.ticketNumber}`;
    // Keep the ticket number in the subject so customer replies match back to this ticket.
    if (!finalSubject.toUpperCase().includes(ticket.ticketNumber)) {
      finalSubject = `${finalSubject} (${ticket.ticketNumber})`;
    }

    if (sendAs === "quote") {
      await createAndSendQuote({
        requestId: id,
        quoteAmount,
        depositPercent,
        personalNote: emailBody,
        subject: finalSubject,
      });
      await recordOutbound(
        id,
        `${emailBody.trim()}\n\n[Quote sent: $${(quoteAmount / 100).toFixed(2)}, ${depositPercent}% deposit, Stripe payment link included]`
      );
    } else {
      const result = await sendTicketMessageEmail({
        customerEmail: ticket.customerEmail,
        subject: finalSubject,
        body: emailBody,
      });
      if (!result.success) {
        return NextResponse.json({ error: "Email failed to send" }, { status: 502 });
      }
      await recordOutbound(id, emailBody.trim());
    }

    if (draftId) {
      await prisma.agentDraft.update({ where: { id: draftId }, data: { status: "SENT" } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof QuoteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[agent/send] Error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
