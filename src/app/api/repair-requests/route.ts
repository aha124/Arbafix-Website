import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  sendCustomerConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/lib/email";

function generateTicketNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ARB-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function getUniqueTicketNumber(): Promise<string> {
  let ticketNumber = generateTicketNumber();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existing = await prisma.repairRequest.findUnique({
      where: { ticketNumber },
    });

    if (!existing) {
      return ticketNumber;
    }

    ticketNumber = generateTicketNumber();
    attempts++;
  }

  // Fallback: add timestamp suffix for guaranteed uniqueness
  return `ARB-${Date.now().toString(36).toUpperCase().slice(-5)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "deviceType",
      "issueDescription",
      "customerName",
      "customerEmail",
      "shippingAddress",
      "shippingCity",
      "shippingState",
      "shippingZip",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate unique ticket number
    const ticketNumber = await getUniqueTicketNumber();

    // Create the repair request
    const repairRequest = await prisma.repairRequest.create({
      data: {
        ticketNumber,
        deviceType: body.deviceType,
        issueDescription: body.issueDescription,
        commonIssues: body.commonIssues || [],
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || null,
        shippingAddress: body.shippingAddress,
        shippingCity: body.shippingCity,
        shippingState: body.shippingState,
        shippingZip: body.shippingZip,
      },
    });

    // Send confirmation emails (non-blocking)
    const emailData = {
      ticketNumber: repairRequest.ticketNumber,
      customerName: repairRequest.customerName,
      customerEmail: repairRequest.customerEmail,
      deviceType: repairRequest.deviceType,
      issueDescription: repairRequest.issueDescription,
      commonIssues: repairRequest.commonIssues,
      requestId: repairRequest.id,
    };

    // Send emails in parallel, don't block response
    Promise.all([
      sendCustomerConfirmationEmail(emailData),
      sendAdminNotificationEmail(emailData),
    ]).catch((error) => {
      console.error("Error sending confirmation emails:", error);
    });

    return NextResponse.json(
      {
        success: true,
        ticketNumber: repairRequest.ticketNumber,
        id: repairRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating repair request:", error);
    return NextResponse.json(
      { error: "Failed to create repair request" },
      { status: 500 }
    );
  }
}
