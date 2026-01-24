import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, CheckCircle, XCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Warranty Information - Arbafix",
  description: "Learn about Arbafix's 90-day warranty on all console repairs. We stand behind our work with comprehensive coverage on parts and labor.",
};

export default function WarrantyPage() {
  const covered = [
    "The same issue recurring within 90 days",
    "Parts that fail due to defects",
    "Labor to re-repair the original issue",
    "Return shipping for warranty repairs",
  ];

  const notCovered = [
    "New damage (drops, spills, power surges)",
    "Water or liquid damage",
    "Tampering or unauthorized repairs",
    "Issues unrelated to the original repair",
    "Normal wear and tear",
    "Software issues or corrupted data",
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <ShieldCheck className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              90-Day Warranty
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We stand behind every repair. Your peace of mind is our priority.
            </p>
          </div>
        </section>

        {/* Warranty Overview */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-text-dark mb-6">
                Our Warranty Promise
              </h2>
              <p className="text-text-body leading-relaxed mb-6">
                Every repair completed by Arbafix comes with our comprehensive <strong>90-day warranty</strong>. We believe in the quality of our work, and we want you to feel confident that your device is in good hands.
              </p>
              <p className="text-text-body leading-relaxed mb-6">
                Our warranty covers both parts and labor on the repair we performed. If the same issue recurs within 90 days of receiving your repaired device, simply contact us and we&apos;ll make it right—at no additional cost to you.
              </p>
              <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                <p className="text-green-800 font-medium">
                  Your warranty begins on the date your repaired device is delivered back to you, giving you a full 90 days of coverage.
                </p>
              </div>
            </div>

            {/* Coverage Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* What's Covered */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark">What&apos;s Covered</h3>
                </div>
                <ul className="space-y-4">
                  {covered.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-text-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's Not Covered */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark">What&apos;s Not Covered</h3>
                </div>
                <ul className="space-y-4">
                  {notCovered.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-text-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How to Claim */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text-dark">How to Make a Warranty Claim</h2>
              </div>
              <p className="text-text-body leading-relaxed mb-6">
                If you experience the same issue with your device within 90 days of receiving it back from us, here&apos;s how to get it resolved:
              </p>
              <ol className="list-decimal pl-6 text-text-body space-y-4 mb-6">
                <li>
                  <strong>Contact us</strong> at{" "}
                  <a href="mailto:repairs@arbafix.com" className="text-primary hover:text-primary-dark">
                    repairs@arbafix.com
                  </a>{" "}
                  or call{" "}
                  <a href="tel:+15704198540" className="text-primary hover:text-primary-dark">
                    (570) 419-8540
                  </a>
                </li>
                <li>
                  <strong>Provide your ticket number</strong> from the original repair so we can look up your repair history
                </li>
                <li>
                  <strong>Describe the issue</strong> you&apos;re experiencing so we can assess if it&apos;s covered under warranty
                </li>
                <li>
                  <strong>Ship your device back</strong> using the prepaid label we&apos;ll provide for warranty repairs
                </li>
                <li>
                  <strong>We&apos;ll repair it</strong> and ship it back to you at no additional cost
                </li>
              </ol>
              <p className="text-text-body leading-relaxed">
                Most warranty claims are processed within 3-5 business days of receiving your device. We&apos;ll keep you updated every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">
              Ready to Get Your Console Fixed?
            </h2>
            <p className="text-text-body mb-8 max-w-xl mx-auto">
              With our 90-day warranty, you can trust that your repair is in good hands. Get started today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-repair"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Request a Repair
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-text-dark font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
