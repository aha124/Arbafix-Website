import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { ticketNumber: string } }
) {
  try {
    const { ticketNumber } = params;

    if (!ticketNumber) {
      return NextResponse.json(
        { error: "Ticket number is required" },
        { status: 400 }
      );
    }

    // Find the repair request by ticket number
    const repairRequest = await prisma.repairRequest.findUnique({
      where: { ticketNumber: ticketNumber.toUpperCase() },
      select: {
        ticketNumber: true,
        status: true,
        deviceType: true,
        createdAt: true,
        updatedAt: true,
        // Explicitly exclude sensitive info: customerEmail, customerPhone, address fields
      },
    });

    if (!repairRequest) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(repairRequest);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket information" },
      { status: 500 }
    );
  }
}
