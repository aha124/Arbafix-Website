import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month's start date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all stats in parallel
    const [total, pending, inProgress, completedThisMonth] = await Promise.all([
      prisma.repairRequest.count(),
      prisma.repairRequest.count({
        where: { status: "PENDING" },
      }),
      prisma.repairRequest.count({
        where: { status: "IN_PROGRESS" },
      }),
      prisma.repairRequest.count({
        where: {
          status: "COMPLETED",
          updatedAt: { gte: startOfMonth },
        },
      }),
    ]);

    return NextResponse.json({
      total,
      pending,
      inProgress,
      completedThisMonth,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
