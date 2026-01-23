import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Gamepad2,
  ChevronRight,
  Shield,
  Clock,
  BadgeCheck,
  Laptop,
  Wrench,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Console Repair Services | Arbafix - Hershey, PA",
  description:
    "Expert video game console repair services in Hershey, PA. We fix Nintendo Switch, PlayStation, Xbox, and more. Free diagnosis, 90-day warranty on all repairs.",
};

export default function ServicesPage() {
  const brands = [
    {
      name: "Nintendo",
      href: "/services/nintendo",
      subtitle: "Switch, 3DS, Wii & Retro",
      description:
        "From Joy-Con drift to classic NES repairs, we handle all Nintendo consoles with care.",
      items: [
        "Switch & Switch 2",
        "3DS / 2DS Family",
        "Wii & Wii U",
        "Retro Systems",
      ],
      color: "bg-red-500",
      hoverColor: "hover:border-red-200",
      iconBg: "bg-red-50",
    },
    {
      name: "PlayStation",
      href: "/services/playstation",
      subtitle: "PS5, PS4, PS3 & Vita",
      description:
        "HDMI repairs, disc drive fixes, and overheating solutions for all PlayStation generations.",
      items: ["PS5 & PS5 Slim", "PS4 / PS4 Pro", "PS3 & Vita", "Retro Systems"],
      color: "bg-blue-600",
      hoverColor: "hover:border-blue-200",
      iconBg: "bg-blue-50",
    },
    {
      name: "Xbox",
      href: "/services/xbox",
      subtitle: "Series X/S, One & 360",
      description:
        "Power issues, RROD fixes, and disc drive repairs for every Xbox generation.",
      items: [
        "Series X & Series S",
        "Xbox One Family",
        "Xbox 360",
        "Original Xbox",
      ],
      color: "bg-green-600",
      hoverColor: "hover:border-green-200",
      iconBg: "bg-green-50",
    },
  ];

  const trustSignals = [
    {
      icon: Shield,
      title: "90-Day Warranty",
      description: "All repairs backed by our comprehensive warranty",
    },
    {
      icon: BadgeCheck,
      title: "Free Diagnosis",
      description: "We'll quote you before any work begins",
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Most repairs completed within 3-5 business days",
    },
    {
      icon: Wrench,
      title: "Expert Technicians",
      description: "Experienced professionals who love gaming",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Repair Services
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Expert repairs for all major gaming consoles. From the latest
                releases to beloved retro systems, we bring your gaming back to
                life.
              </p>
              <Link
                href="/request-repair"
                className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Start Your Repair
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustSignals.map((signal, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <signal.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-dark">
                    {signal.title}
                  </h3>
                  <p className="text-sm text-text-body mt-1">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Cards */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
                Choose Your Console Brand
              </h2>
              <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
                Select your console brand to see all supported devices and
                common repairs we offer.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {brands.map((brand, index) => (
                <Link
                  key={index}
                  href={brand.href}
                  className={`bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all group ${brand.hoverColor}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${brand.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-text-dark">
                    {brand.name}
                  </h3>
                  <p className="text-text-body mt-1">{brand.subtitle}</p>

                  {/* Description */}
                  <p className="text-text-body mt-4">{brand.description}</p>

                  {/* Items */}
                  <ul className="mt-6 space-y-2">
                    {brand.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center gap-2 text-text-body"
                      >
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <div className="inline-flex items-center gap-1 mt-6 text-primary font-semibold group-hover:gap-2 transition-all">
                    View {brand.name} Services
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Laptop Diagnostics Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                    <Laptop className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Laptop Diagnostics
                  </h2>
                  <p className="text-slate-300 text-lg mb-6">
                    In addition to gaming consoles, we offer comprehensive
                    laptop diagnostic services. Whether your laptop is running
                    slow, won&apos;t boot, or has hardware issues, we can help
                    identify the problem.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Hardware diagnostics & testing",
                      "Performance troubleshooting",
                      "Boot & startup issues",
                      "Virus & malware scanning",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/request-repair"
                    className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Request Diagnostic
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-64 h-64 bg-white/5 rounded-full flex items-center justify-center">
                    <Laptop className="w-32 h-32 text-white/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Your Console Fixed?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Start with a free diagnosis. We&apos;ll assess your device and
                provide an upfront quote before any work begins.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/request-repair"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Start Your Repair
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                >
                  Track Existing Repair
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
