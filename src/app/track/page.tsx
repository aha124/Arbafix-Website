"use client";

import { useState } from "react";
import { Search, Package, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface TicketData {
  ticketNumber: string;
  status: string;
  deviceType: string;
  createdAt: string;
  updatedAt: string;
}

// All possible statuses in order
const STATUS_STEPS = [
  "PENDING",
  "QUOTED",
  "APPROVED",
  "RECEIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "SHIPPED",
] as const;

// Status display configuration
const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; message: string }> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    message: "We're reviewing your request and will send a quote within 24 hours.",
  },
  QUOTED: {
    label: "Quoted",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    message: "Check your email for your quote.",
  },
  APPROVED: {
    label: "Approved",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    message: "Your quote has been approved. Please ship your device to us.",
  },
  RECEIVED: {
    label: "Received",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    message: "We've received your device.",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    message: "Your device is being repaired.",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-100",
    message: "Repair complete! Preparing to ship.",
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    message: "Your device is on its way!",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    message: "This repair request has been cancelled.",
  },
};

export default function TrackPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = ticketNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a ticket number");
      return;
    }

    setIsLoading(true);
    setError("");
    setTicketData(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/track/${encodeURIComponent(trimmed)}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError("Ticket not found. Please check the number and try again.");
        } else {
          setError(data.error || "Failed to fetch ticket information");
        }
        return;
      }

      setTicketData(data);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    const index = STATUS_STEPS.indexOf(status as typeof STATUS_STEPS[number]);
    return index === -1 ? 0 : index;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusConfig = ticketData
    ? STATUS_CONFIG[ticketData.status] || STATUS_CONFIG.PENDING
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
              Track Your Repair
            </h1>
            <p className="mt-3 text-text-body text-lg">
              Enter your ticket number to check the status of your repair
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="ticketNumber" className="sr-only">
                  Ticket Number
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-body" />
                  <input
                    type="text"
                    id="ticketNumber"
                    value={ticketNumber}
                    onChange={(e) => {
                      setTicketNumber(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="e.g., ARB-XXXXX"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-lg"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Track"
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && hasSearched && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {ticketData && statusConfig && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Ticket Header */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-body mb-1">Ticket Number</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary tracking-wider">
                      {ticketData.ticketNumber}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="p-6 md:p-8 bg-bg-light">
                <h3 className="text-sm font-semibold text-text-body uppercase tracking-wide mb-6">
                  Repair Progress
                </h3>
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full hidden sm:block" />

                  {/* Progress Bar Fill */}
                  <div
                    className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-500 hidden sm:block"
                    style={{
                      width: `${(getStatusIndex(ticketData.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />

                  {/* Steps */}
                  <div className="relative flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
                    {STATUS_STEPS.map((step, index) => {
                      const currentIndex = getStatusIndex(ticketData.status);
                      const isPast = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      const isFuture = index > currentIndex;
                      const config = STATUS_CONFIG[step];

                      return (
                        <div
                          key={step}
                          className={`flex sm:flex-col items-center gap-3 sm:gap-2 ${
                            isFuture ? "opacity-40" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              isCurrent
                                ? "bg-primary text-white ring-4 ring-primary/20"
                                : isPast
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {isPast ? (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <span className="text-xs font-bold">{index + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium text-center ${
                              isCurrent
                                ? "text-primary"
                                : isPast
                                ? "text-text-dark"
                                : "text-gray-400"
                            }`}
                          >
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 md:p-8">
                {/* Status Message */}
                <div className={`rounded-xl p-5 mb-6 ${statusConfig.bgColor}`}>
                  <p className={`font-medium ${statusConfig.color}`}>
                    {statusConfig.message}
                  </p>
                </div>

                {/* Ticket Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-bg-light rounded-xl p-4">
                    <p className="text-sm text-text-body mb-1">Device Type</p>
                    <p className="text-text-dark font-semibold">{ticketData.deviceType}</p>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4">
                    <p className="text-sm text-text-body mb-1">Date Submitted</p>
                    <p className="text-text-dark font-semibold">
                      {formatDate(ticketData.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
