import { NextRequest, NextResponse } from "next/server";
import PostalMime from "postal-mime";
import { waitUntil } from "@vercel/functions";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";
import { generateDraft, recordCustomerReply } from "@/lib/agent/repairAgent";

export const maxDuration = 60;

// Called by the Cloudflare Email Worker for every message to repairs@arbafix.com.
// The worker forwards the email to Gmail first, so nothing here can lose mail.

function secretMatches(given: string | null): boolean {
  const expected = process.env.INBOUND_EMAIL_SECRET;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Keep only the new part of a reply: drop quoted lines and everything from
// the "On <date>, <name> wrote:" marker down.
function stripQuotedReply(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const joined = `${line} ${lines[i + 1] ?? ""}`;
    if (/^On .+wrote:\s*$/.test(line.trim()) || /^On .+wrote:\s*$/.test(joined.trim())) break;
    if (/^-{2,}\s*Original Message\s*-{2,}/i.test(line.trim())) break;
    if (/^From: .+/.test(line.trim()) && out.length > 0 && out[out.length - 1].trim() === "") break;
    if (line.trimStart().startsWith(">")) continue;
    out.push(line);
  }
  return out.join("\n").trim();
}

function extractAddress(from: string): string {
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get("x-inbound-secret"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { from, raw } = await request.json();
    if (typeof raw !== "string" || typeof from !== "string") {
      return NextResponse.json({ error: "Bad payload" }, { status: 400 });
    }

    const email = await PostalMime.parse(raw);
    const sender = extractAddress(email.from?.address || from);
    const subject = email.subject || "";

    // Ignore our own outgoing mail and bounces.
    if (sender.endsWith("@arbafix.com") || /mailer-daemon|postmaster/i.test(sender)) {
      return NextResponse.json({ ignored: "own or system mail" });
    }

    // Match by ticket number in the subject, else the sender's most recent open ticket.
    const ticketMatch = subject.match(/ARB-[A-Z0-9]{5}/i);
    let ticket = ticketMatch
      ? await prisma.repairRequest.findUnique({ where: { ticketNumber: ticketMatch[0].toUpperCase() } })
      : null;
    if (ticket && ticket.customerEmail.toLowerCase() !== sender) {
      // A ticket number from someone else's address: don't attach it blindly.
      ticket = null;
    }
    if (!ticket) {
      ticket = await prisma.repairRequest.findFirst({
        where: {
          customerEmail: { equals: sender, mode: "insensitive" },
          status: { notIn: ["SHIPPED", "CANCELLED", "COMPLETED"] },
        },
        orderBy: { createdAt: "desc" },
      });
    }
    if (!ticket) {
      return NextResponse.json({ ignored: "no matching ticket" });
    }

    const text = email.text || (email.html ? email.html.replace(/<[^>]+>/g, " ") : "");
    const body = stripQuotedReply(text) || text.trim();
    if (!body) {
      return NextResponse.json({ ignored: "empty body" });
    }

    await recordCustomerReply(ticket.id, body.slice(0, 10000));

    if (process.env.ANTHROPIC_API_KEY) {
      const ticketId = ticket.id;
      waitUntil(
        generateDraft(ticketId).catch((error) => {
          console.error("[inbound-email] Draft failed:", error);
        })
      );
    }

    return NextResponse.json({ attached: ticket.ticketNumber });
  } catch (error) {
    console.error("[inbound-email] Error:", error);
    return NextResponse.json({ error: "Failed to process email" }, { status: 500 });
  }
}
