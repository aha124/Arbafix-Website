import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle, Clock, Shield, Package, CreditCard, Search, RefreshCw, Droplets } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ - Arbafix",
  description: "Frequently asked questions about Arbafix console repair services. Learn about our repair process, warranty, shipping, and payment options.",
};

export default function FAQPage() {
  const faqs = [
    {
      icon: Clock,
      question: "How long does a repair take?",
      answer: "Most repairs are completed within 3-5 business days after we receive your device. Complex repairs may take longer, and we'll always keep you updated on the progress.",
    },
    {
      icon: Shield,
      question: "Do you offer a warranty?",
      answer: "Yes! We offer a 90-day warranty on all repairs. This covers parts and labor for the same issue. If the problem recurs within 90 days, we'll fix it at no additional cost.",
    },
    {
      icon: Package,
      question: "How do I ship my device?",
      answer: "After paying your deposit, we'll email you detailed shipping instructions along with a prepaid return shipping label. Pack your device securely and drop it off at any UPS location.",
    },
    {
      icon: CreditCard,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment system. Payment is split into a deposit upfront and final payment upon completion.",
    },
    {
      icon: Search,
      question: "How do I track my repair?",
      answer: "Use our Track Repair page and enter your ticket number. You'll receive this number via email when you submit your repair request. You can check the status anytime to see where your device is in the repair process.",
    },
    {
      icon: RefreshCw,
      question: "What if my device can't be repaired?",
      answer: "If we determine that your device cannot be repaired, we'll provide a full refund of your deposit. We'll also return your device to you at no additional shipping cost.",
    },
    {
      icon: Droplets,
      question: "Do you repair water damaged devices?",
      answer: "We can assess water damaged devices, but we cannot guarantee successful repairs. Water damage can cause unpredictable issues. We'll provide an honest assessment and only proceed if we believe the repair has a reasonable chance of success.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our repair process, warranty, and services.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <faq.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-text-dark mb-3">
                        {faq.question}
                      </h2>
                      <p className="text-text-body leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">
              Still Have Questions?
            </h2>
            <p className="text-text-body mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Start a repair request and we'll be happy to help with any specific questions about your device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-repair"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Request a Repair
              </Link>
              <Link
                href="/track"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-text-dark font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Track Your Repair
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
