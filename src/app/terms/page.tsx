import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Arbafix",
  description: "Terms and conditions for using Arbafix console repair services. Learn about our service policies, warranty terms, and more.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
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
                  1. Service Description
                </h2>
                <p className="text-text-body mb-6 leading-relaxed">
                  Arbafix provides professional video game console repair services for Nintendo, PlayStation, Xbox, and retro gaming consoles. Our services include diagnostics, parts replacement, and general repairs. We operate as a mail-in repair service, where customers ship their devices to us for repair.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  2. Pricing and Payment
                </h2>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li><strong>Quotes:</strong> We provide repair quotes before any work begins. You will receive a detailed estimate based on the issues you describe.</li>
                  <li><strong>Deposit:</strong> A deposit is required to begin the repair process. This covers initial diagnostic work and secures your place in our repair queue.</li>
                  <li><strong>Final Payment:</strong> The remaining balance is due upon completion of the repair, before we ship your device back to you.</li>
                  <li><strong>Payment Methods:</strong> We accept all major credit cards through our secure Stripe payment system.</li>
                </ul>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  3. Warranty
                </h2>
                <p className="text-text-body mb-4 leading-relaxed">
                  All repairs completed by Arbafix come with a <strong>90-day warranty</strong> covering parts and labor. This warranty:
                </p>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li>Begins from the date your device is returned to you</li>
                  <li>Covers the same issue recurring within the warranty period</li>
                  <li>Does not cover new damage, water damage, or tampering</li>
                </ul>
                <p className="text-text-body mb-6 leading-relaxed">
                  For full warranty details, please see our{" "}
                  <a href="/warranty" className="text-primary hover:text-primary-dark">
                    Warranty Information
                  </a>{" "}
                  page.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  4. Limitations of Liability
                </h2>
                <p className="text-text-body mb-4 leading-relaxed">
                  By using our services, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li><strong>Data Loss:</strong> Arbafix is not responsible for any data loss that may occur during the repair process. We strongly recommend backing up your data before sending your device.</li>
                  <li><strong>Pre-existing Damage:</strong> We are not liable for any pre-existing damage to your device that was not caused by our repair work.</li>
                  <li><strong>Cosmetic Damage:</strong> While we handle all devices with care, minor cosmetic wear during shipping is beyond our control.</li>
                  <li><strong>Unrepairable Devices:</strong> Some devices may be beyond repair. In such cases, we will inform you and refund your deposit.</li>
                </ul>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  5. Cancellation Policy
                </h2>
                <ul className="list-disc pl-6 text-text-body space-y-2 mb-6">
                  <li><strong>Before Repair Starts:</strong> If you cancel your repair request before we begin work on your device, you will receive a full refund of your deposit.</li>
                  <li><strong>After Repair Starts:</strong> Once repair work has begun, the deposit is non-refundable as it covers diagnostic work and parts ordering.</li>
                  <li><strong>Unrepairable Devices:</strong> If we determine your device cannot be repaired, you will receive a full refund of your deposit.</li>
                </ul>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  6. Shipping
                </h2>
                <p className="text-text-body mb-6 leading-relaxed">
                  Customers are responsible for shipping their devices to us. We provide a prepaid return shipping label for the repaired device. We recommend using tracked shipping when sending your device and packaging it securely to prevent damage during transit.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  7. Governing Law
                </h2>
                <p className="text-text-body mb-6 leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the Commonwealth of Pennsylvania, United States, without regard to its conflict of law provisions.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  8. Changes to Terms
                </h2>
                <p className="text-text-body mb-6 leading-relaxed">
                  We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>

                <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4">
                  9. Contact Us
                </h2>
                <p className="text-text-body leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at{" "}
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
