import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendShippingNotificationEmail } from "@/lib/email";

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

    if (!repairRequest.trackingNumber || !repairRequest.trackingUrl) {
      return NextResponse.json(
        { error: "No tracking information available for this request" },
        { status: 400 }
      );
    }

    // Send shipping notification email
    const emailResult = await sendShippingNotificationEmail({
      ticketNumber: repairRequest.ticketNumber,
      customerName: repairRequest.customerName,
      customerEmail: repairRequest.customerEmail,
      deviceType: repairRequest.deviceType,
      trackingNumber: repairRequest.trackingNumber,
      trackingUrl: repairRequest.trackingUrl,
    });

    if (!emailResult.success) {
      console.error("[resend-tracking] Failed to send email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send tracking email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tracking email sent successfully",
    });
  } catch (error) {
    console.error("[resend-tracking] Error:", error);
    return NextResponse.json(
      { error: "Failed to resend tracking email" },
      { status: 500 }
    );
  }
}
