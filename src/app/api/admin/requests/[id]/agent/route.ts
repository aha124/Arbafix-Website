import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Conversation history and the current unsent draft for a ticket.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const [messages, draft] = await Promise.all([
    prisma.ticketMessage.findMany({ where: { requestId: id }, orderBy: { createdAt: "asc" } }),
    prisma.agentDraft.findFirst({ where: { requestId: id, status: "DRAFT" }, orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({ messages, draft });
}
