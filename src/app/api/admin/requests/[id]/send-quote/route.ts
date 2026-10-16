import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAndSendQuote, QuoteError } from "@/lib/quotes";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { quoteAmount, depositPercent = 50 } = await request.json();

    const result = await createAndSendQuote({ requestId: id, quoteAmount, depositPercent });

    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      message: "Quote sent successfully",
    });
  } catch (error) {
    if (error instanceof QuoteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[send-quote] Error:", error);
    return NextResponse.json({ error: "Failed to send quote" }, { status: 500 });
  }
}
