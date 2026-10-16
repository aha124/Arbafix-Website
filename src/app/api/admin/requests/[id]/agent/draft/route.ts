import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateDraft, recordCustomerReply } from "@/lib/agent/repairAgent";

export const maxDuration = 60;

// Generate a new draft. Pass { customerReply } to log a reply the customer sent first.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body.customerReply === "string" && body.customerReply.trim()) {
      await recordCustomerReply(id, body.customerReply);
    }
    const draft = await generateDraft(id);
    return NextResponse.json({ draft });
  } catch (error) {
    console.error("[agent/draft] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate draft";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
