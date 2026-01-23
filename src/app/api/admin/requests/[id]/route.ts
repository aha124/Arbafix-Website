import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function GET(
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

    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id },
    });

    if (!repairRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ request: repairRequest });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Failed to fetch request" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('[PATCH] Function started');
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate status
    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get current request to check for status change
    const currentRequest = await prisma.repairRequest.findUnique({
      where: { id },
    });

    if (!currentRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const oldStatus = currentRequest.status;
    const newStatus = body.status;

    console.log('[PATCH] Comparing status:', { oldStatus, newStatus, willSendEmail: oldStatus !== newStatus });

    const updatedRequest = await prisma.repairRequest.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    // Send status update email if status changed
    if (oldStatus !== newStatus) {
      // Log the data being passed to the email function
      console.log("[PATCH /api/admin/requests] Status changed, sending email notification");
      console.log("[PATCH /api/admin/requests] Customer email from DB:", updatedRequest.customerEmail);
      console.log("[PATCH /api/admin/requests] Full updatedRequest:", {
        id: updatedRequest.id,
        ticketNumber: updatedRequest.ticketNumber,
        customerName: updatedRequest.customerName,
        customerEmail: updatedRequest.customerEmail,
        deviceType: updatedRequest.deviceType,
        oldStatus,
        newStatus,
      });

      console.log('[PATCH] About to enter email try block');
      try {
        console.log('[PATCH] Awaiting email send...');
        await sendStatusUpdateEmail({
          ticketNumber: updatedRequest.ticketNumber,
          customerName: updatedRequest.customerName,
          customerEmail: updatedRequest.customerEmail,
          deviceType: updatedRequest.deviceType,
          oldStatus,
          newStatus,
        });
        console.log('[PATCH] Email send completed');
      } catch (emailError) {
        console.error('[PATCH] Email failed:', emailError);
      }
      console.log('[PATCH] Finished email try/catch block');
    }

    console.log('[PATCH] About to return response');
    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
