"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get("ticket");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your repair request has been approved and
          we&apos;ll begin working on it shortly.
        </p>

        {ticketNumber && (
          <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Your Ticket Number</p>
            <p className="text-2xl font-bold text-blue-600 tracking-wider">
              {ticketNumber}
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">What&apos;s Next?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                1
              </span>
              You&apos;ll receive a confirmation email with payment details
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                2
              </span>
              Ship your device to us (address in email)
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                3
              </span>
              We&apos;ll repair your device and ship it back
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {ticketNumber && (
            <Link
              href={`/track?ticket=${ticketNumber}`}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Track Your Repair
            </Link>
          )}
          <Link
            href="/"
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
