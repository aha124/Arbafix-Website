import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceTrustBanner from "@/components/ServiceTrustBanner";
import {
  Gamepad2,
  ChevronRight,
  ChevronDown,
  Shield,
  Clock,
  BadgeCheck,
  Wrench,
  Zap,
  Monitor,
  Disc3,
  Fan,
  Cpu,
  CircuitBoard,
  Thermometer,
  Wifi,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Xbox Repair Services | Arbafix - Hershey, PA",
  description:
    "Expert Xbox repair services in Hershey, PA. We fix Series X, Series S, Xbox One, Xbox 360, and Original Xbox. HDMI repair, RROD fixes, disc drive issues. Free diagnosis.",
};

export default function XboxServicesPage() {
  const devices = [
    {
      name: "Xbox Series X",
      description: "Latest flagship",
      image: "series-x",
    },
    {
      name: "Xbox Series S",
      description: "Digital edition",
      image: "series-s",
    },
    {
      name: "Xbox One",
      description: "Original model",
      image: "one",
    },
    {
      name: "Xbox One S",
      description: "Slim model",
      image: "one-s",
    },
    {
      name: "Xbox One X",
      description: "Enhanced 4K model",
      image: "one-x",
    },
    {
      name: "Xbox 360",
      description: "All variants",
      image: "360",
    },
    {
      name: "Original Xbox",
      description: "Classic 2001 console",
      image: "original",
    },
    {
      name: "Controllers",
      description: "All Xbox controllers",
      image: "controller",
    },
  ];

  const commonRepairs = [
    {
      category: "Xbox Series X / Series S",
      repairs: [
        {
          name: "HDMI Port Repair",
          description:
            "Fix no signal, bent pins, or damaged HDMI output on Series X/S",
          icon: Monitor,
        },
        {
          name: "Disc Drive Repair (Series X)",
          description:
            "Fix drives that won't read, eject, or accept game discs",
          icon: Disc3,
        },
        {
          name: "Overheating Issues",
          description:
            "Clean cooling system, replace thermal paste, fix fan problems",
          icon: Thermometer,
        },
        {
          name: "Controller Sync Issues",
          description:
            "Fix wireless connectivity and pairing problems",
          icon: Wifi,
        },
        {
          name: "Power Issues",
          description:
            "Diagnose and repair consoles that won't turn on",
          icon: Zap,
        },
        {
          name: "Controller Drift",
          description:
            "Fix analog stick drift on Xbox Wireless Controllers",
          icon: Gamepad2,
        },
      ],
    },
    {
      category: "Xbox One / One S / One X",
      repairs: [
        {
          name: "HDMI Port Repair",
          description:
            "The most common Xbox One issue - damaged or non-working HDMI",
          icon: Monitor,
        },
        {
          name: "Disc Drive Repair",
          description:
            "Fix grinding, not reading, or ejection problems",
          icon: Disc3,
        },
        {
          name: "Power Brick Replacement",
          description:
            "Replace faulty external power supplies (original Xbox One)",
          icon: Cpu,
        },
        {
          name: "Overheating & Loud Fan",
          description:
            "Thermal paste replacement and cooling system cleaning",
          icon: Fan,
        },
        {
          name: "Internal Power Supply",
          description:
            "Repair or replace internal PSU on One S and One X models",
          icon: Zap,
        },
        {
          name: "Wi-Fi/Bluetooth Issues",
          description:
            "Fix wireless connectivity problems",
          icon: Radio,
        },
      ],
    },
    {
      category: "Xbox 360",
      repairs: [
        {
          name: "Red Ring of Death (RROD)",
          description:
            "Diagnose and repair the infamous RROD caused by overheating",
          icon: Thermometer,
        },
        {
          name: "Disc Drive Repair",
          description:
            "Fix drives that won't open, read, or make grinding noises",
          icon: Disc3,
        },
        {
          name: "Overheating Prevention",
          description:
            "Thermal compound replacement and improved cooling",
          icon: Fan,
        },
        {
          name: "E74 Error Fix",
          description:
            "Repair GPU/HANA chip related display errors",
          icon: Monitor,
        },
        {
          name: "Power Supply Issues",
          description:
            "Replace faulty power bricks showing error lights",
          icon: Zap,
        },
      ],
    },
    {
      category: "Original Xbox",
      repairs: [
        {
          name: "Disc Drive Repair",
          description:
            "Fix disc reading issues on Thompson, Samsung, and Philips drives",
          icon: Disc3,
        },
        {
          name: "Capacitor Replacement",
          description:
            "Replace the infamous leaking clock capacitor and others",
          icon: CircuitBoard,
        },
        {
          name: "Power Supply Issues",
          description:
            "Repair consoles that won't power on or have unstable power",
          icon: Cpu,
        },
        {
          name: "AV Port Repair",
          description:
            "Fix loose or damaged video/audio output connections",
          icon: Monitor,
        },
        {
          name: "Hard Drive Upgrade",
          description:
            "Upgrade storage for more games and media",
          icon: Cpu,
        },
      ],
    },
  ];

  const faqs = [
    {
      question: "Can you fix the Red Ring of Death on Xbox 360?",
      answer:
        "Yes, we can diagnose and often repair RROD issues. The Red Ring of Death is typically caused by overheating leading to solder joint failures. We'll assess your console and provide honest options - some units can be repaired while others may be beyond economical repair.",
    },
    {
      question: "My Xbox Series X has no display. Is this fixable?",
      answer:
        "Most likely, yes! No display is usually caused by a damaged HDMI port or encoder chip. HDMI port repairs are one of our specialties. We'll diagnose the exact cause and provide a quote before any work begins.",
    },
    {
      question: "Do you repair Xbox controllers?",
      answer:
        "Absolutely! We fix stick drift, unresponsive buttons, trigger issues, and connectivity problems on all Xbox controllers including the latest Xbox Wireless Controllers, Elite controllers, and older Xbox One controllers.",
    },
    {
      question: "My Xbox One external power brick has an orange light. Can you help?",
      answer:
        "An orange light typically indicates a power supply issue. We can test and replace faulty power bricks. For Xbox One S and One X with internal power supplies, we can repair or replace those as well.",
    },
    {
      question: "Should I repair my old Original Xbox?",
      answer:
        "The Original Xbox is now a classic! If you have one, we strongly recommend getting the clock capacitor replaced - these commonly leak and can damage the motherboard over time. We love preserving these gaming classics.",
    },
    {
      question: "What warranty do you offer on Xbox repairs?",
      answer:
        "All our Xbox repairs come with a 90-day warranty. If the same issue reoccurs within that period, we'll fix it at no additional charge.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section - Xbox Green */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-2xl">
                <Link
                  href="/services"
                  className="inline-flex items-center text-green-200 hover:text-white mb-4 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  All Services
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Xbox Repair Services
                </h1>
                <p className="text-xl text-green-100 mb-8">
                  From RROD fixes to HDMI repairs, we handle all Xbox generations
                  with expert care. Series X, Xbox One, 360, and Original Xbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/request-repair"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors shadow-lg"
                  >
                    Start Your Repair
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Link>
                  <a
                    href="#repairs"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                  >
                    View Repairs
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-24 h-24 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-text-dark font-medium">
                  90-Day Warranty
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-green-600" />
                <span className="text-text-dark font-medium">
                  Free Diagnosis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-text-dark font-medium">
                  Fast Turnaround
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-green-600" />
                <span className="text-text-dark font-medium">
                  Expert Technicians
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Devices */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ServiceTrustBanner accentColor="green" />
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
                Devices We Repair
              </h2>
              <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
                We service all Xbox consoles, from the latest Series X to the
                classic Original Xbox.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {devices.map((device, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all text-center"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark">{device.name}</h3>
                  <p className="text-sm text-text-body mt-1">
                    {device.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Repairs */}
        <section id="repairs" className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
                Common Xbox Repairs
              </h2>
              <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
                Here are the most common issues we fix. Don&apos;t see your
                problem listed? Contact us - we can likely help!
              </p>
            </div>

            <div className="space-y-12">
              {commonRepairs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-green-600 rounded-full"></span>
                    {category.category}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.repairs.map((repair, repairIndex) => (
                      <div
                        key={repairIndex}
                        className="bg-bg-light rounded-xl p-5 border border-gray-100 hover:border-green-200 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <repair.icon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-text-dark">
                              {repair.name}
                            </h4>
                            <p className="text-sm text-text-body mt-1">
                              {repair.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Note */}
            <div className="mt-12 bg-green-50 rounded-2xl p-6 md:p-8 border border-green-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">
                    Free Diagnosis on All Repairs
                  </h3>
                  <p className="text-text-body mt-1">
                    We&apos;ll assess your device and provide an upfront quote
                    before any work begins. No surprises, no hidden fees.
                  </p>
                </div>
                <Link
                  href="/request-repair"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  Get Free Quote
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-text-body">
                Common questions about our Xbox repair services
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                >
                  <h3 className="font-semibold text-text-dark text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-text-body mt-3">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Fix Your Xbox?
              </h2>
              <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
                Get started with a free diagnosis. We&apos;ll have your Xbox
                back in action in no time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/request-repair"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors shadow-lg"
                >
                  Start Your Repair
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                >
                  View All Services
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
