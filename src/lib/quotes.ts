import { prisma } from "@/lib/db";
import { sendQuoteEmail } from "@/lib/email";
import { createCheckoutSession, getPayUrl } from "@/lib/checkout";

export class QuoteError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// Creates the Stripe checkout session, marks the ticket QUOTED, and emails the quote.
export async function createAndSendQuote(opts: {
  requestId: string;
  quoteAmount: number; // cents
  depositPercent?: number;
  personalNote?: string;
  subject?: string;
}) {
  const { requestId, quoteAmount, depositPercent = 50, personalNote, subject } = opts;

  if (!quoteAmount || quoteAmount <= 0) {
    throw new QuoteError("Quote amount is required and must be greater than 0");
  }
  if (![25, 50, 75, 100].includes(depositPercent)) {
    throw new QuoteError("Deposit percent must be 25, 50, 75, or 100");
  }

  const depositAmount = Math.round((quoteAmount * depositPercent) / 100);

  const repairRequest = await prisma.repairRequest.findUnique({ where: { id: requestId } });
  if (!repairRequest) {
    throw new QuoteError("Repair request not found", 404);
  }
  if (repairRequest.paymentStatus === "PAID_IN_FULL") {
    throw new QuoteError("This request has already been paid in full");
  }

  const paymentType = depositPercent === 100 ? "full" : "deposit";
  const paymentUrl = getPayUrl(repairRequest.ticketNumber);

  const stripeSession = await createCheckoutSession({
    ticketNumber: repairRequest.ticketNumber,
    repairRequestId: repairRequest.id,
    customerEmail: repairRequest.customerEmail,
    deviceType: repairRequest.deviceType,
    amount: depositAmount,
    type: paymentType,
    depositPercent,
  });

  await prisma.repairRequest.update({
    where: { id: requestId },
    data: {
      quoteAmount,
      depositPercent,
      depositAmount,
      paymentStatus: "QUOTE_SENT",
      status: "QUOTED",
      stripeSessionId: stripeSession.id,
    },
  });

  const emailResult = await sendQuoteEmail({
    ticketNumber: repairRequest.ticketNumber,
    customerName: repairRequest.customerName,
    customerEmail: repairRequest.customerEmail,
    deviceType: repairRequest.deviceType,
    issueDescription: repairRequest.issueDescription,
    quoteAmount,
    depositPercent,
    depositAmount,
    paymentUrl,
    personalNote,
    subject,
  });

  if (!emailResult.success) {
    console.error("[createAndSendQuote] Failed to send quote email:", emailResult.error);
  }

  return { paymentUrl, emailSent: emailResult.success };
}
