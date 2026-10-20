import Stripe from "stripe";

// Lazy initialization to avoid build-time errors when env vars aren't available
export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://arbafix.com";
}

// Stable link for emails. Stripe Checkout sessions expire after 24 hours, so emails
// point here and /pay/[ticket] creates a fresh session on each visit.
export function getPayUrl(ticketNumber: string): string {
  return `${getBaseUrl()}/pay/${encodeURIComponent(ticketNumber)}`;
}

export type CheckoutType = "deposit" | "full" | "final";

// Amounts and types always come from the server (ticket state), never from the client.
export async function createCheckoutSession(opts: {
  ticketNumber: string;
  repairRequestId: string;
  customerEmail: string;
  deviceType: string;
  amount: number; // cents
  type: CheckoutType;
  depositPercent?: number;
}) {
  const { ticketNumber, repairRequestId, customerEmail, deviceType, amount, type, depositPercent } = opts;
  const baseUrl = getBaseUrl();

  const name =
    type === "final"
      ? `Final Payment - ${ticketNumber}`
      : `Repair ${type === "deposit" ? "Deposit" : "Payment"} - ${ticketNumber}`;
  const description =
    type === "final"
      ? `${deviceType} repair - Remaining balance`
      : `${deviceType} repair - ${type === "deposit" ? `${depositPercent}% Deposit` : "Full payment"}`;

  return getStripeClient().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name, description },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/payment/success?ticket=${ticketNumber}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment/cancelled?ticket=${ticketNumber}`,
    customer_email: customerEmail,
    metadata: { ticketNumber, type, repairRequestId },
  });
}
