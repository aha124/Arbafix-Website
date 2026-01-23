import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

// Lazy initialization to avoid build-time errors when env vars aren't available
function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketNumber, amount, type } = body;

    if (!ticketNumber || !amount || !type) {
      return NextResponse.json(
        { error: "Missing required fields: ticketNumber, amount, type" },
        { status: 400 }
      );
    }

    if (!["deposit", "full", "final"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'deposit', 'full', or 'final'" },
        { status: 400 }
      );
    }

    // Verify the repair request exists
    const repairRequest = await prisma.repairRequest.findUnique({
      where: { ticketNumber },
    });

    if (!repairRequest) {
      return NextResponse.json(
        { error: "Repair request not found" },
        { status: 404 }
      );
    }

    // Verify payment hasn't already been completed
    if (repairRequest.paymentStatus === "PAID_IN_FULL") {
      return NextResponse.json(
        { error: "Payment has already been completed for this request" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://arbafix.com';

    // Create Stripe Checkout Session
    const session = await getStripeClient().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Repair ${type === "deposit" ? "Deposit" : "Payment"} - ${ticketNumber}`,
              description: `${repairRequest.deviceType} repair - ${type === "deposit" ? "Deposit" : "Full payment"}`,
            },
            unit_amount: amount, // amount is already in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment/success?ticket=${ticketNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancelled?ticket=${ticketNumber}`,
      customer_email: repairRequest.customerEmail,
      metadata: {
        ticketNumber,
        type,
        repairRequestId: repairRequest.id,
      },
    });

    // Save the session ID to the repair request
    await prisma.repairRequest.update({
      where: { ticketNumber },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
