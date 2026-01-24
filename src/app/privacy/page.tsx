import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Arbafix",
  description: "Learn how Arbafix collects, uses, and protects your personal information when you use our console repair services.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we handle your information.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
              <p className="text-text-body mb-8">
                <strong>Last Updated:</strong> January 2026
              </p>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  Information We Collect
                </h2>
                <p className="text-text-body mb-4 leading-relaxed">
                  When you use our services, we collect the following information to process your repair request:
                </p>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li><strong>Name:</strong> To identify you and personalize communication</li>
                  <li><strong>Email Address:</strong> To send repair updates, shipping information, and receipts</li>
                  <li><strong>Phone Number:</strong> To contact you about your repair if needed</li>
                  <li><strong>Shipping Address:</strong> To return your repaired device to you</li>
                  <li><strong>Device Information:</strong> Details about your console to facilitate the repair</li>
                </ul>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-text-body mb-4 leading-relaxed">
                  We use the information we collect solely for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li>Processing and completing your repair request</li>
                  <li>Communicating with you about your repair status</li>
                  <li>Generating shipping labels for device return</li>
                  <li>Sending payment receipts and invoices</li>
                  <li>Providing customer support</li>
                  <li>Honoring warranty claims</li>
                </ul>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  Data Sharing
                </h2>
                <p className="text-text-body mb-4 leading-relaxed">
                  <strong>We do not sell your personal information to third parties.</strong> We only share your information with:
                </p>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li><strong>Stripe:</strong> Our payment processor, to securely handle payments</li>
                  <li><strong>Shipping Carriers:</strong> To generate labels and deliver your device</li>
                </ul>
                <p className="text-text-body mb-6 leading-relaxed">
                  These partners are bound by their own privacy policies and only receive the minimum information necessary to provide their services.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  Payment Security
                </h2>
                <p className="text-text-body mb-6 leading-relaxed">
                  All payments are processed securely through Stripe. We never store your full credit card number on our servers. Stripe is PCI-DSS compliant and uses industry-standard encryption to protect your payment information.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  Data Retention
                </h2>
                <p className="text-text-body mb-6 leading-relaxed">
                  We retain your repair records for a reasonable period to honor warranty claims and provide customer support. After this period, your data may be deleted or anonymized.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  Your Rights
                </h2>
                <p className="text-text-body mb-4 leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li>Request access to the personal information we have about you</li>
                  <li>Request correction of any inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                </ul>
                <p className="text-text-body mb-6 leading-relaxed">
                  To exercise any of these rights, please contact us at{" "}
                  <a href="mailto:repairs@arbafix.com" className="text-primary hover:text-primary-dark">
                    repairs@arbafix.com
                  </a>.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  Contact Us
                </h2>
                <p className="text-text-body leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:repairs@arbafix.com" className="text-primary hover:text-primary-dark">
                    repairs@arbafix.com
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
