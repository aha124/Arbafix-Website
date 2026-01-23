import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const limit = parseInt(searchParams.get("limit") || "0");

    // Build where clause
    const where: {
      status?: string;
      OR?: Array<{
        ticketNumber?: { contains: string; mode: "insensitive" };
        customerName?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build order by
    const orderBy: Record<string, string> = {};
    if (sortBy === "date" || sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === "status") {
      orderBy.status = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const requests = await prisma.repairRequest.findMany({
      where,
      orderBy,
      take: limit > 0 ? limit : undefined,
      select: {
        id: true,
        ticketNumber: true,
        status: true,
        deviceType: true,
        customerName: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
