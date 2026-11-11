import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendShippingNotificationEmail } from "@/lib/email";
import { Shippo } from "shippo";

// Lazy initialization to avoid build-time errors when env vars aren't available
function getShippoClient(): Shippo {
  if (!process.env.SHIPPO_API_KEY) {
    throw new Error("SHIPPO_API_KEY is not configured");
  }
  return new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });
}

const DEFAULT_PARCEL = { length: "10", width: "8", height: "4", weight: "2" };

type Parcel = { length: string; width: string; height: string; weight: string };

// Reads optional { length, width, height, weight } (inches / lb) from the request body.
function parseParcel(body: unknown): Parcel | { error: string } {
  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const fields = ["length", "width", "height", "weight"] as const;
  const parcel = { ...DEFAULT_PARCEL };

  for (const field of fields) {
    const raw = input[field];
    if (raw === undefined || raw === null || raw === "") continue;
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0 || value > 150) {
      return { error: `Package ${field} must be a number greater than 0` };
    }
    parcel[field] = String(value);
  }

  return parcel;
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

    // Package size comes from the dashboard; fall back to the old small-box
    // defaults only when nothing is sent.
    const body = await request.json().catch(() => ({}));
    const parcel = parseParcel(body);
    if ("error" in parcel) {
      return NextResponse.json({ error: parcel.error }, { status: 400 });
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

    // Validate the request is in the right state
    if (repairRequest.paymentStatus !== "PAID_IN_FULL") {
      return NextResponse.json(
        { error: "Payment must be completed before generating a return shipping label" },
        { status: 400 }
      );
    }

    if (repairRequest.labelUrl) {
      return NextResponse.json(
        { error: "A shipping label has already been generated for this request" },
        { status: 400 }
      );
    }

    // Validate business address environment variables
    if (!process.env.BUSINESS_ADDRESS_STREET) {
      return NextResponse.json(
        { error: "Business address is not configured. Please set BUSINESS_ADDRESS_STREET in environment variables." },
        { status: 500 }
      );
    }

    const shippo = getShippoClient();

    // Create Shippo shipment
    const shipment = await shippo.shipments.create({
      addressFrom: {
        name: process.env.BUSINESS_ADDRESS_NAME || "Arbafix",
        street1: process.env.BUSINESS_ADDRESS_STREET,
        city: process.env.BUSINESS_ADDRESS_CITY || "Hershey",
        state: process.env.BUSINESS_ADDRESS_STATE || "PA",
        zip: process.env.BUSINESS_ADDRESS_ZIP || "17033",
        country: "US",
        // USPS rejects the label purchase without a sender email.
        email: process.env.BUSINESS_EMAIL || "repairs@arbafix.com",
        ...(process.env.BUSINESS_PHONE ? { phone: process.env.BUSINESS_PHONE } : {}),
      },
      addressTo: {
        name: repairRequest.customerName,
        street1: repairRequest.shippingAddress,
        city: repairRequest.shippingCity,
        state: repairRequest.shippingState,
        zip: repairRequest.shippingZip,
        country: "US",
        email: repairRequest.customerEmail,
      },
      parcels: [
        {
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          distanceUnit: "in",
          weight: parcel.weight,
          massUnit: "lb",
        },
      ],
      async: false,
    });

    // Get USPS rates and find the cheapest one
    const uspsRates = shipment.rates?.filter(
      (rate) => rate.provider?.toUpperCase() === "USPS"
    );

    if (!uspsRates || uspsRates.length === 0) {
      console.error("[generate-label] No USPS rates available. All rates:", shipment.rates);
      return NextResponse.json(
        { error: "No USPS shipping rates available for this address" },
        { status: 400 }
      );
    }

    // Sort by price and get the cheapest rate
    const cheapestRate = uspsRates.sort(
      (a, b) => parseFloat(a.amount || "0") - parseFloat(b.amount || "0")
    )[0];

    if (!cheapestRate.objectId) {
      return NextResponse.json(
        { error: "Unable to get rate ID for label purchase" },
        { status: 500 }
      );
    }

    // Purchase the label
    const transaction = await shippo.transactions.create({
      rate: cheapestRate.objectId,
      labelFileType: "PDF",
      async: false,
    });

    if (transaction.status !== "SUCCESS") {
      console.error("[generate-label] Label purchase failed:", transaction.messages);
      const reason = transaction.messages
        ?.map((m) => m.text)
        .filter(Boolean)
        .join(" ");
      return NextResponse.json(
        {
          error: reason
            ? `Failed to purchase shipping label: ${reason}`
            : "Failed to purchase shipping label",
          details: transaction.messages,
        },
        { status: 500 }
      );
    }

    const labelUrl = transaction.labelUrl;
    const trackingNumber = transaction.trackingNumber;
    const trackingUrl = transaction.trackingUrlProvider;

    if (!labelUrl || !trackingNumber) {
      return NextResponse.json(
        { error: "Label was created but missing URL or tracking number" },
        { status: 500 }
      );
    }

    // Update the repair request with label info and mark as shipped
    await prisma.repairRequest.update({
      where: { id },
      data: {
        labelUrl,
        trackingNumber,
        trackingUrl: trackingUrl || `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
        trackingCarrier: "USPS",
        status: "SHIPPED",
      },
    });

    // Send shipping notification email
    const emailResult = await sendShippingNotificationEmail({
      ticketNumber: repairRequest.ticketNumber,
      customerName: repairRequest.customerName,
      customerEmail: repairRequest.customerEmail,
      deviceType: repairRequest.deviceType,
      trackingNumber,
      trackingUrl: trackingUrl || `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    });

    if (!emailResult.success) {
      console.error("[generate-label] Failed to send shipping notification email:", emailResult.error);
      // Don't fail the request, the label was created
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      labelUrl,
      trackingUrl: trackingUrl || `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      message: "Shipping label generated successfully",
    });
  } catch (error) {
    console.error("[generate-label] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate shipping label" },
      { status: 500 }
    );
  }
}
