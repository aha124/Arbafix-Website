import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { sendQuoteEmail } from "@/lib/email";

// Lazy initialization to avoid build-time errors when env vars aren't available
function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

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

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://arbafix.com";
  const paymentType = depositPercent === 100 ? "full" : "deposit";

  const stripeSession = await getStripeClient().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Repair ${paymentType === "deposit" ? "Deposit" : "Payment"} - ${repairRequest.ticketNumber}`,
            description: `${repairRequest.deviceType} repair - ${paymentType === "deposit" ? `${depositPercent}% Deposit` : "Full payment"}`,
          },
          unit_amount: depositAmount,
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
    paymentUrl: stripeSession.url!,
    personalNote,
    subject,
  });

  if (!emailResult.success) {
    console.error("[createAndSendQuote] Failed to send quote email:", emailResult.error);
  }

  return { paymentUrl: stripeSession.url, emailSent: emailResult.success };
}
