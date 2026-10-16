"use client";

import { useCallback, useEffect, useState } from "react";

interface TicketMessage {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  body: string;
  createdAt: string;
}

interface AgentDraft {
  id: string;
  kind: "QUESTIONS" | "QUOTE" | "ANSWER" | "ESCALATE";
  subject: string | null;
  emailBody: string | null;
  quoteAmount: number | null;
  depositPercent: number | null;
  internalNote: string;
}

const KIND_LABEL: Record<AgentDraft["kind"], { label: string; style: string }> = {
  QUESTIONS: { label: "Asking questions", style: "bg-blue-100 text-blue-800" },
  QUOTE: { label: "Quote", style: "bg-green-100 text-green-800" },
  ANSWER: { label: "Answer", style: "bg-purple-100 text-purple-800" },
  ESCALATE: { label: "Needs you", style: "bg-red-100 text-red-800" },
};

export default function AgentPanel({
  requestId,
  onSent,
}: {
  requestId: string;
  onSent: () => void;
}) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState<AgentDraft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Editable copy of the draft
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sendAs, setSendAs] = useState<"message" | "quote">("message");
  const [quoteDollars, setQuoteDollars] = useState("");
  const [depositPercent, setDepositPercent] = useState(50);

  const [customerReply, setCustomerReply] = useState("");

  const applyDraft = (d: AgentDraft | null) => {
    setDraft(d);
    if (!d) return;
    setSubject(d.subject ?? "");
    setBody(d.emailBody ?? "");
    setSendAs(d.kind === "QUOTE" ? "quote" : "message");
    setQuoteDollars(d.quoteAmount ? (d.quoteAmount / 100).toFixed(2) : "");
    setDepositPercent(d.depositPercent ?? 50);
  };

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/requests/${requestId}/agent`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
      applyDraft(data.draft);
    }
    setLoaded(true);
  }, [requestId]);

  useEffect(() => {
    load();
  }, [load]);

  const generate = async (withReply: boolean) => {
    setBusy(withReply ? "reply" : "generate");
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/agent/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withReply ? { customerReply } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate draft");
      if (withReply) setCustomerReply("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate draft");
    } finally {
      setBusy(null);
    }
  };

  const send = async () => {
    if (!draft) return;
    const quoteAmount = Math.round(parseFloat(quoteDollars) * 100);
    if (sendAs === "quote" && (isNaN(quoteAmount) || quoteAmount <= 0)) {
      setError("Enter a valid quote amount");
      return;
    }
    const confirmText =
      sendAs === "quote"
        ? `Send quote of $${(quoteAmount / 100).toFixed(2)} (${depositPercent}% deposit) with this note?`
        : "Send this email to the customer?";
    if (!window.confirm(confirmText)) return;

    setBusy("send");
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/agent/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: draft.id,
          subject,
          emailBody: body,
          sendAs,
          quoteAmount: sendAs === "quote" ? quoteAmount : undefined,
          depositPercent: sendAs === "quote" ? depositPercent : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setNotice("Sent.");
      await load();
      onSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setBusy(null);
    }
  };

  const discard = async () => {
    if (!draft) return;
    setBusy("discard");
    await fetch(`/api/admin/requests/${requestId}/agent/discard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftId: draft.id }),
    });
    setDraft(null);
    setBusy(null);
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-dark">Repair Assistant</h2>
        <button
          onClick={() => generate(false)}
          disabled={!!busy}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          {busy === "generate" ? "Drafting..." : draft ? "Redraft" : "Draft reply"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {notice && <p className="mb-4 text-sm text-green-700">{notice}</p>}

      {!loaded ? (
        <p className="text-sm text-text-body">Loading...</p>
      ) : draft ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${KIND_LABEL[draft.kind].style}`}>
              {KIND_LABEL[draft.kind].label}
            </span>
            <p className="text-sm text-text-body">{draft.internalNote}</p>
          </div>

          {draft.kind !== "ESCALATE" && (
            <>
              <div>
                <label className="text-sm font-medium text-text-body">Subject</label>
                <input className={`${inputClass} mt-1`} value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-text-body">
                  {sendAs === "quote" ? "Note shown above the quote" : "Email"}
                </label>
                <textarea
                  className={`${inputClass} mt-1 font-mono text-sm`}
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="text-sm font-medium text-text-body">Send as</label>
                  <select
                    className={`${inputClass} mt-1`}
                    value={sendAs}
                    onChange={(e) => setSendAs(e.target.value as "message" | "quote")}
                  >
                    <option value="message">Email only</option>
                    <option value="quote">Quote with payment link</option>
                  </select>
                </div>
                {sendAs === "quote" && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-text-body">Total ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className={`${inputClass} mt-1 w-32`}
                        value={quoteDollars}
                        onChange={(e) => setQuoteDollars(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-body">Deposit</label>
                      <select
                        className={`${inputClass} mt-1`}
                        value={depositPercent}
                        onChange={(e) => setDepositPercent(parseInt(e.target.value))}
                      >
                        {[25, 50, 75, 100].map((p) => (
                          <option key={p} value={p}>
                            {p}%
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={send}
                  disabled={!!busy || !body.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
                >
                  {busy === "send" ? "Sending..." : sendAs === "quote" ? "Send quote" : "Send email"}
                </button>
                <button
                  onClick={discard}
                  disabled={!!busy}
                  className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-dark disabled:opacity-50"
                >
                  Discard
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-body">No draft waiting. Paste a customer reply below or click Draft reply.</p>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100">
        <label className="text-sm font-medium text-text-body">Customer replied? Paste it here</label>
        <textarea
          className={`${inputClass} mt-1 text-sm`}
          rows={4}
          value={customerReply}
          onChange={(e) => setCustomerReply(e.target.value)}
          placeholder="Paste the customer's email reply..."
        />
        <button
          onClick={() => generate(true)}
          disabled={!!busy || !customerReply.trim()}
          className="mt-2 w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-50"
        >
          {busy === "reply" ? "Drafting..." : "Log reply and draft response"}
        </button>
      </div>

      {messages.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
          <h3 className="text-sm font-semibold text-text-dark">Conversation</h3>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${
                m.direction === "INBOUND" ? "bg-gray-50 text-text-dark" : "bg-blue-50 text-text-dark"
              }`}
            >
              <p className="text-xs text-text-body mb-1">
                {m.direction === "INBOUND" ? "Customer" : "You"} · {new Date(m.createdAt).toLocaleString()}
              </p>
              {m.body}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
