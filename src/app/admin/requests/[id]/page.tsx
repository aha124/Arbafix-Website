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
  depositPercent: number | null;
  depositAmount: number | null;
  amountPaid: number | null;
  paymentStatus: string | null;
  stripePaymentId: string | null;
  // Tracking fields
  trackingNumber: string | null;
  trackingCarrier: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    QUOTED: "bg-purple-100 text-purple-800",
    DEPOSIT_PAID: "bg-blue-100 text-blue-800",
    RECEIVED: "bg-indigo-100 text-indigo-800",
    IN_PROGRESS: "bg-orange-100 text-orange-800",
    REPAIR_COMPLETE: "bg-teal-100 text-teal-800",
    SHIPPED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    // Legacy statuses
    APPROVED: "bg-green-100 text-green-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  const labels: Record<string, string> = {
    PENDING: "Pending",
    QUOTED: "Quote Sent",
    DEPOSIT_PAID: "Deposit Paid",
    RECEIVED: "Device Received",
    IN_PROGRESS: "In Progress",
    REPAIR_COMPLETE: "Repair Complete",
    SHIPPED: "Shipped",
    CANCELLED: "Cancelled",
    // Legacy statuses
    APPROVED: "Approved",
    COMPLETED: "Completed",
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
    PAYMENT_REQUESTED: "bg-orange-100 text-orange-800",
    PAID_IN_FULL: "bg-green-100 text-green-800",
  };

  const labels: Record<string, string> = {
    NONE: "No Quote",
    QUOTE_SENT: "Quote Sent",
    DEPOSIT_PAID: "Deposit Paid",
    PAYMENT_REQUESTED: "Payment Requested",
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

function PaymentProgressBar({ amountPaid, quoteAmount }: { amountPaid: number; quoteAmount: number }) {
  const percentage = quoteAmount > 0 ? Math.min(100, (amountPaid / quoteAmount) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-body">Payment Progress</span>
        <span className="text-text-dark font-medium">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${
            percentage >= 100 ? "bg-green-500" : percentage > 0 ? "bg-blue-500" : "bg-gray-300"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Quote state
  const [quoteAmountDollars, setQuoteAmountDollars] = useState("");
  const [depositPercent, setDepositPercent] = useState<number>(50);

  // Shipping state
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");

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
        // Initialize quote fields if they exist
        if (data.request.quoteAmount) {
          setQuoteAmountDollars((data.request.quoteAmount / 100).toFixed(2));
        }
        if (data.request.depositPercent) {
          setDepositPercent(data.request.depositPercent);
        }
        if (data.request.trackingNumber) {
          setTrackingNumber(data.request.trackingNumber);
        }
        if (data.request.trackingCarrier) {
          setTrackingCarrier(data.request.trackingCarrier);
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

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSendQuote = async () => {
    if (!request) return;

    const quoteAmountCents = Math.round(parseFloat(quoteAmountDollars) * 100);

    if (isNaN(quoteAmountCents) || quoteAmountCents <= 0) {
      showMessage("error", "Please enter a valid quote amount");
      return;
    }

    setActionLoading("quote");

    try {
      const res = await fetch(`/api/admin/requests/${request.id}/send-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteAmount: quoteAmountCents,
          depositPercent,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("success", "Quote sent successfully!");
        fetchRequest();
      } else {
        showMessage("error", data.error || "Failed to send quote");
      }
    } catch (error) {
      console.error("Error sending quote:", error);
      showMessage("error", "Failed to send quote");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!request) return;

    setActionLoading(newStatus);

    try {
      const updateData: Record<string, unknown> = { status: newStatus };

      // Include tracking info when marking as shipped
      if (newStatus === "SHIPPED") {
        updateData.trackingNumber = trackingNumber || null;
        updateData.trackingCarrier = trackingCarrier || null;
      }

      const res = await fetch(`/api/admin/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        showMessage("success", `Status updated to ${newStatus}`);
        fetchRequest();
      } else {
        showMessage("error", "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showMessage("error", "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestFinalPayment = async () => {
    if (!request) return;

    setActionLoading("final-payment");

    try {
      const res = await fetch(`/api/admin/requests/${request.id}/request-final-payment`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("success", "Final payment request sent successfully!");
        fetchRequest();
      } else {
        showMessage("error", data.error || "Failed to request final payment");
      }
    } catch (error) {
      console.error("Error requesting final payment:", error);
      showMessage("error", "Failed to request final payment");
    } finally {
      setActionLoading(null);
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

  // Calculate deposit amount preview
  const calculatedDepositAmount = quoteAmountDollars
    ? (parseFloat(quoteAmountDollars) * depositPercent / 100).toFixed(2)
    : "0.00";

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

  const amountPaid = request.amountPaid || 0;
  const quoteAmount = request.quoteAmount || 0;
  const remainingBalance = Math.max(0, quoteAmount - amountPaid);

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

        {/* Global Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

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
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-text-body">Quote Amount</span>
                        <span className="font-semibold text-text-dark">
                          {formatCurrency(request.quoteAmount)}
                        </span>
                      </div>
                      {request.depositAmount && request.depositPercent && (
                        <div className="flex justify-between items-center">
                          <span className="text-text-body">Deposit ({request.depositPercent}%)</span>
                          <span className="font-medium text-text-dark">
                            {formatCurrency(request.depositAmount)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {amountPaid > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-text-body">Amount Paid</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(amountPaid)}
                      </span>
                    </div>
                  )}
                  {quoteAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-text-body">Remaining Balance</span>
                      <span className={`font-semibold ${remainingBalance === 0 ? "text-green-600" : "text-text-dark"}`}>
                        {formatCurrency(remainingBalance)}
                      </span>
                    </div>
                  )}
                  {quoteAmount > 0 && (
                    <div className="pt-3">
                      <PaymentProgressBar amountPaid={amountPaid} quoteAmount={quoteAmount} />
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

            {/* Quote Section - Show when PENDING or QUOTED */}
            {(request.status === "PENDING" || request.status === "QUOTED") &&
             request.paymentStatus !== "PAID_IN_FULL" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-text-dark mb-4">
                  {request.paymentStatus === "QUOTE_SENT" ? "Update Quote" : "Send Quote"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1">
                      Total Quote Amount
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
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1">
                      Deposit Percentage
                    </label>
                    <select
                      value={depositPercent}
                      onChange={(e) => setDepositPercent(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value={25}>25% Deposit</option>
                      <option value={50}>50% Deposit</option>
                      <option value={75}>75% Deposit</option>
                      <option value={100}>100% (Full Payment)</option>
                    </select>
                  </div>
                  {quoteAmountDollars && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Deposit Amount:</strong> ${calculatedDepositAmount}
                        {depositPercent < 100 && (
                          <span className="text-blue-600 ml-2">
                            (Remaining: ${(parseFloat(quoteAmountDollars) - parseFloat(calculatedDepositAmount)).toFixed(2)})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleSendQuote}
                    disabled={actionLoading === "quote" || !quoteAmountDollars}
                    className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading === "quote" ? (
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
                        {request.paymentStatus === "QUOTE_SENT" ? "Resend Quote" : "Send Quote"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Workflow Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Actions</h2>
              <div className="space-y-3">
                {/* Show based on current status */}

                {/* DEPOSIT_PAID -> Mark as Received */}
                {request.status === "DEPOSIT_PAID" && (
                  <button
                    onClick={() => handleStatusUpdate("RECEIVED")}
                    disabled={actionLoading === "RECEIVED"}
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading === "RECEIVED" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Mark as Received
                  </button>
                )}

                {/* RECEIVED -> Mark In Progress */}
                {request.status === "RECEIVED" && (
                  <button
                    onClick={() => handleStatusUpdate("IN_PROGRESS")}
                    disabled={actionLoading === "IN_PROGRESS"}
                    className="w-full px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading === "IN_PROGRESS" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    Mark In Progress
                  </button>
                )}

                {/* IN_PROGRESS -> Mark Repair Complete */}
                {request.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleStatusUpdate("REPAIR_COMPLETE")}
                    disabled={actionLoading === "REPAIR_COMPLETE"}
                    className="w-full px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading === "REPAIR_COMPLETE" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    Mark Repair Complete
                  </button>
                )}

                {/* REPAIR_COMPLETE + not paid in full -> Request Final Payment */}
                {request.status === "REPAIR_COMPLETE" &&
                 request.paymentStatus !== "PAID_IN_FULL" &&
                 request.paymentStatus !== "PAYMENT_REQUESTED" &&
                 remainingBalance > 0 && (
                  <button
                    onClick={handleRequestFinalPayment}
                    disabled={actionLoading === "final-payment"}
                    className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading === "final-payment" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    Request Final Payment ({formatCurrency(remainingBalance)})
                  </button>
                )}

                {/* REPAIR_COMPLETE or PAID_IN_FULL -> Ship with tracking */}
                {(request.status === "REPAIR_COMPLETE" && request.paymentStatus === "PAID_IN_FULL") && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-1">
                        Tracking Number (optional)
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="1Z999AA10123456784"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-1">
                        Carrier (optional)
                      </label>
                      <select
                        value={trackingCarrier}
                        onChange={(e) => setTrackingCarrier(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      >
                        <option value="">Select carrier...</option>
                        <option value="USPS">USPS</option>
                        <option value="UPS">UPS</option>
                        <option value="FedEx">FedEx</option>
                        <option value="DHL">DHL</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleStatusUpdate("SHIPPED")}
                      disabled={actionLoading === "SHIPPED"}
                      className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {actionLoading === "SHIPPED" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      )}
                      Mark as Shipped
                    </button>
                  </div>
                )}

                {/* Show tracking info if shipped */}
                {request.status === "SHIPPED" && (request.trackingNumber || request.trackingCarrier) && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-medium mb-1">Shipped</p>
                    {request.trackingCarrier && (
                      <p className="text-sm text-green-700">Carrier: {request.trackingCarrier}</p>
                    )}
                    {request.trackingNumber && (
                      <p className="text-sm text-green-700">Tracking: {request.trackingNumber}</p>
                    )}
                  </div>
                )}

                {/* Cancel button - always available except for shipped/cancelled */}
                {!["SHIPPED", "CANCELLED"].includes(request.status) && (
                  <button
                    onClick={() => handleStatusUpdate("CANCELLED")}
                    disabled={actionLoading === "CANCELLED"}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading === "CANCELLED" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Cancel Request
                  </button>
                )}

                {/* Status info */}
                <p className="text-xs text-text-body text-center pt-2">
                  Current status: <strong>{request.status}</strong>
                </p>
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
