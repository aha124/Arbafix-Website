import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { draftId } = await request.json();

  await prisma.agentDraft.updateMany({
    where: { id: draftId, requestId: id, status: "DRAFT" },
    data: { status: "DISCARDED" },
  });
  return NextResponse.json({ success: true });
}
