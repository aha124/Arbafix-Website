"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RepairRequest {
  id: string;
  ticketNumber: string;
  status: string;
  deviceType: string;
  issueDescription: string;
  commonIssues: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  createdAt: string;
  updatedAt: string;
  // Payment fields
  quoteAmount: number | null;
  depositAmount: number | null;
  amountPaid: number | null;
  paymentStatus: string | null;
  stripePaymentId: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  const labels: Record<string, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    APPROVED: "Approved",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string | null }) {
  const styles: Record<string, string> = {
    NONE: "bg-gray-100 text-gray-600",
    QUOTE_SENT: "bg-yellow-100 text-yellow-800",
    DEPOSIT_PAID: "bg-blue-100 text-blue-800",
    PAID_IN_FULL: "bg-green-100 text-green-800",
  };

  const labels: Record<string, string> = {
    NONE: "No Quote",
    QUOTE_SENT: "Quote Sent",
    DEPOSIT_PAID: "Deposit Paid",
    PAID_IN_FULL: "Paid in Full",
  };

  const actualStatus = status || "NONE";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        styles[actualStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[actualStatus] || actualStatus}
    </span>
  );
}

export default function RequestDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Quote state
  const [quoteAmountDollars, setQuoteAmountDollars] = useState("");
  const [depositAmountDollars, setDepositAmountDollars] = useState("");
  const [sendingQuote, setSendingQuote] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetchRequest();
    }
  }, [status, params.id]);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/admin/requests/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setRequest(data.request);
        setSelectedStatus(data.request.status);
        // Initialize quote fields if they exist
        if (data.request.quoteAmount) {
          setQuoteAmountDollars((data.request.quoteAmount / 100).toFixed(2));
        }
        if (data.request.depositAmount) {
          setDepositAmountDollars((data.request.depositAmount / 100).toFixed(2));
        }
      } else if (res.status === 404) {
        router.push("/admin/requests");
      }
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!request || selectedStatus === request.status) return;

    setUpdating(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/admin/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setRequest(data.request);
        setSaveMessage({ type: "success", text: "Status updated successfully" });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: "error", text: "Failed to update status" });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSaveMessage({ type: "error", text: "Failed to update status" });
    } finally {
      setUpdating(false);
    }
  };

  const handleSendQuote = async () => {
    if (!request) return;

    const quoteAmountCents = Math.round(parseFloat(quoteAmountDollars) * 100);
    const depositAmountCents = depositAmountDollars
      ? Math.round(parseFloat(depositAmountDollars) * 100)
      : null;

    if (isNaN(quoteAmountCents) || quoteAmountCents <= 0) {
      setQuoteMessage({ type: "error", text: "Please enter a valid quote amount" });
      return;
    }

    if (depositAmountCents && depositAmountCents >= quoteAmountCents) {
      setQuoteMessage({ type: "error", text: "Deposit must be less than the total quote" });
      return;
    }

    setSendingQuote(true);
    setQuoteMessage(null);

    try {
      const res = await fetch(`/api/admin/requests/${request.id}/send-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteAmount: quoteAmountCents,
          depositAmount: depositAmountCents,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setQuoteMessage({ type: "success", text: "Quote sent successfully!" });
        // Refresh request data
        fetchRequest();
        setTimeout(() => setQuoteMessage(null), 5000);
      } else {
        setQuoteMessage({ type: "error", text: data.error || "Failed to send quote" });
      }
    } catch (error) {
      console.error("Error sending quote:", error);
      setQuoteMessage({ type: "error", text: "Failed to send quote" });
    } finally {
      setSendingQuote(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !request) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-xl font-bold text-text-dark hover:text-primary transition-colors"
              >
                Arbafix Admin
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href="/admin/requests"
                className="text-text-body hover:text-primary transition-colors"
              >
                Requests
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-text-body">{request.ticketNumber}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/requests"
            className="inline-flex items-center text-sm text-text-body hover:text-primary transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to All Requests
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-dark">{request.ticketNumber}</h1>
              <p className="text-text-body mt-1">
                Created on {formatDate(request.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={request.status} />
              <PaymentStatusBadge status={request.paymentStatus} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Device Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-body">Device Type</label>
                  <p className="text-text-dark mt-1">{request.deviceType}</p>
                </div>
                {request.commonIssues.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-text-body">Reported Issues</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {request.commonIssues.map((issue, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-primary"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-text-body">Issue Description</label>
                  <p className="text-text-dark mt-1 whitespace-pre-wrap">
                    {request.issueDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-body">Name</label>
                  <p className="text-text-dark mt-1">{request.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-body">Email</label>
                  <p className="text-text-dark mt-1">
                    <a
                      href={`mailto:${request.customerEmail}`}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      {request.customerEmail}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-body">Phone</label>
                  <p className="text-text-dark mt-1">
                    {request.customerPhone ? (
                      <a
                        href={`tel:${request.customerPhone}`}
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        {request.customerPhone}
                      </a>
                    ) : (
                      <span className="text-text-body">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-body">Shipping Address</label>
                  <p className="text-text-dark mt-1">
                    {request.shippingAddress}
                    <br />
                    {request.shippingCity}, {request.shippingState} {request.shippingZip}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status Card */}
            {(request.quoteAmount || request.amountPaid) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-text-dark mb-4">Payment Summary</h2>
                <div className="space-y-3">
                  {request.quoteAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-body">Quote Amount</span>
                      <span className="font-semibold text-text-dark">
                        {formatCurrency(request.quoteAmount)}
                      </span>
                    </div>
                  )}
                  {request.depositAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-body">Deposit Required</span>
                      <span className="font-medium text-text-dark">
                        {formatCurrency(request.depositAmount)}
                      </span>
                    </div>
                  )}
                  {request.amountPaid !== null && request.amountPaid > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-text-body">Amount Paid</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(request.amountPaid)}
                      </span>
                    </div>
                  )}
                  {request.quoteAmount && request.amountPaid !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-body">Remaining</span>
                      <span className="font-semibold text-text-dark">
                        {formatCurrency(Math.max(0, request.quoteAmount - (request.amountPaid || 0)))}
                      </span>
                    </div>
                  )}
                  {request.stripePaymentId && (
                    <div className="pt-2 border-t">
                      <span className="text-xs text-text-body">
                        Stripe ID: {request.stripePaymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Send Quote Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">
                {request.paymentStatus === "NONE" || !request.paymentStatus
                  ? "Send Quote"
                  : "Update Quote"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-body mb-1">
                    Quote Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={quoteAmountDollars}
                      onChange={(e) => setQuoteAmountDollars(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={request.paymentStatus === "PAID_IN_FULL"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-1">
                    Deposit Amount ($) <span className="text-xs text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={depositAmountDollars}
                      onChange={(e) => setDepositAmountDollars(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={request.paymentStatus === "PAID_IN_FULL"}
                    />
                  </div>
                  <p className="text-xs text-text-body mt-1">
                    Leave empty to require full payment upfront
                  </p>
                </div>
                <button
                  onClick={handleSendQuote}
                  disabled={
                    sendingQuote ||
                    !quoteAmountDollars ||
                    request.paymentStatus === "PAID_IN_FULL"
                  }
                  className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingQuote ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Send Quote to Customer
                    </>
                  )}
                </button>
                {quoteMessage && (
                  <p
                    className={`text-sm ${
                      quoteMessage.type === "success" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {quoteMessage.text}
                  </p>
                )}
                {request.paymentStatus === "PAID_IN_FULL" && (
                  <p className="text-sm text-green-600 font-medium text-center">
                    This request has been paid in full
                  </p>
                )}
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Update Status</h2>
              <div className="space-y-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || selectedStatus === request.status}
                  className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Saving..." : "Save Status"}
                </button>
                {saveMessage && (
                  <p
                    className={`text-sm ${
                      saveMessage.type === "success" ? "text-success" : "text-red-500"
                    }`}
                  >
                    {saveMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Timeline</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-text-body">Created</label>
                  <p className="text-text-dark">{formatDate(request.createdAt)}</p>
                </div>
                <div>
                  <label className="text-text-body">Last Updated</label>
                  <p className="text-text-dark">{formatDate(request.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
