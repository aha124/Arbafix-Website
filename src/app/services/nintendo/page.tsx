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
  Battery,
  Disc3,
  Fan,
  Cpu,
  CircuitBoard,
  Volume2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Nintendo Switch Repair | Arbafix - Hershey, PA",
  description:
    "Expert Nintendo repair services in Hershey, PA. We fix Switch, Switch OLED, Switch 2, 3DS, Wii, and retro systems. Joy-Con drift repair, screen replacement, and more. Free diagnosis.",
};

export default function NintendoServicesPage() {
  const devices = [
    {
      name: "Nintendo Switch",
      description: "Original 2017 model",
      image: "switch",
    },
    {
      name: "Switch Lite",
      description: "Handheld-only model",
      image: "switch-lite",
    },
    {
      name: "Switch OLED",
      description: "Enhanced display model",
      image: "switch-oled",
    },
    {
      name: "Switch 2",
      description: "Latest generation",
      image: "switch-2",
    },
    {
      name: "3DS / 2DS",
      description: "Including XL variants",
      image: "3ds",
    },
    {
      name: "Wii U",
      description: "Console & GamePad",
      image: "wiiu",
    },
    {
      name: "Wii",
      description: "Original console",
      image: "wii",
    },
    {
      name: "Retro Systems",
      description: "NES, SNES, N64, GameCube",
      image: "retro",
    },
  ];

  const commonRepairs = [
    {
      category: "Switch / Switch 2",
      repairs: [
        {
          name: "Joy-Con Drift Repair",
          description:
            "Fix analog stick drift and unresponsive controls on Joy-Cons",
          icon: Gamepad2,
        },
        {
          name: "Charging Port Replacement",
          description:
            "Repair or replace USB-C charging ports that won't charge",
          icon: Zap,
        },
        {
          name: "Screen Replacement",
          description: "Fix cracked, scratched, or malfunctioning displays",
          icon: Monitor,
        },
        {
          name: "Fan Replacement",
          description: "Replace noisy or failing cooling fans",
          icon: Fan,
        },
        {
          name: "Game Card Reader",
          description: "Repair slot that won't read game cartridges",
          icon: Disc3,
        },
        {
          name: "Battery Replacement",
          description: "Replace degraded batteries for better playtime",
          icon: Battery,
        },
      ],
    },
    {
      category: "3DS / 2DS",
      repairs: [
        {
          name: "Screen Replacement",
          description: "Top or bottom screen repair for cracks or dead pixels",
          icon: Monitor,
        },
        {
          name: "Hinge Repair",
          description: "Fix loose or broken hinges on folding models",
          icon: Wrench,
        },
        {
          name: "Charging Port",
          description: "Repair ports that won't charge or have loose connection",
          icon: Zap,
        },
        {
          name: "Circle Pad Replacement",
          description: "Replace worn or broken analog circle pads",
          icon: Gamepad2,
        },
      ],
    },
    {
      category: "Wii / Wii U",
      repairs: [
        {
          name: "Disc Drive Repair",
          description: "Fix drives that won't read, eject, or accept discs",
          icon: Disc3,
        },
        {
          name: "Sensor Bar Issues",
          description: "Replace or repair Wii sensor bar connections",
          icon: Volume2,
        },
        {
          name: "GamePad Screen",
          description: "Wii U GamePad screen and touch digitizer repair",
          icon: Monitor,
        },
        {
          name: "HDMI Port (Wii U)",
          description: "Repair damaged or non-working HDMI output",
          icon: Monitor,
        },
      ],
    },
    {
      category: "Retro (NES, SNES, N64, GameCube)",
      repairs: [
        {
          name: "Cartridge Slot Cleaning",
          description:
            "Deep clean and repair cartridge connectors for reliable reading",
          icon: Disc3,
        },
        {
          name: "Capacitor Replacement",
          description:
            "Replace aging capacitors to prevent power and audio issues",
          icon: CircuitBoard,
        },
        {
          name: "AV Port Repair",
          description:
            "Fix loose or damaged video/audio output connections",
          icon: Monitor,
        },
        {
          name: "Power Issues",
          description: "Diagnose and repair consoles that won't power on",
          icon: Cpu,
        },
      ],
    },
  ];

  const faqs = [
    {
      question: "How long does a Joy-Con drift repair take?",
      answer:
        "Most Joy-Con drift repairs are completed within 1-2 business days once we receive your controllers. We replace the analog stick module with high-quality parts and test thoroughly before returning.",
    },
    {
      question: "Can you fix a Switch that won't turn on?",
      answer:
        "Yes! We diagnose power issues including battery problems, charging port damage, and motherboard issues. Our free diagnosis will identify the exact problem before any repair work begins.",
    },
    {
      question: "Do you repair Switch Lite and Switch OLED models?",
      answer:
        "Absolutely. We repair all Switch variants including the original Switch, Switch Lite, Switch OLED, and the new Switch 2. Each model has specific repair procedures we're trained to handle.",
    },
    {
      question: "Can you fix my retro Nintendo console?",
      answer:
        "Yes! We love working on classic systems. We repair NES, SNES, N64, and GameCube consoles including cartridge slot issues, capacitor replacement, and video output problems.",
    },
    {
      question: "What warranty do you offer on Nintendo repairs?",
      answer:
        "All our Nintendo repairs come with a 90-day warranty. If the same issue reoccurs within that period, we'll fix it at no additional charge.",
    },
    {
      question: "Do you use official Nintendo parts?",
      answer:
        "We use high-quality replacement parts that meet or exceed OEM specifications. For certain repairs, we can source official parts upon request, though this may affect pricing and availability.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section - Nintendo Red */}
        <section className="bg-gradient-to-br from-red-500 to-red-600 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-2xl">
                <Link
                  href="/services"
                  className="inline-flex items-center text-red-100 hover:text-white mb-4 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  All Services
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Nintendo Repair Services
                </h1>
                <p className="text-xl text-red-100 mb-8">
                  From Joy-Con drift to retro console restoration, we bring your
                  Nintendo devices back to life with expert care and quality
                  parts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/request-repair"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors shadow-lg"
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
                <Shield className="w-5 h-5 text-red-500" />
                <span className="text-text-dark font-medium">
                  90-Day Warranty
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-red-500" />
                <span className="text-text-dark font-medium">
                  Free Diagnosis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span className="text-text-dark font-medium">
                  Fast Turnaround
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-red-500" />
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
            <ServiceTrustBanner accentColor="red" />
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
                Devices We Repair
              </h2>
              <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
                We service all Nintendo consoles and handhelds, from the latest
                Switch to classic retro systems.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {devices.map((device, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all text-center"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="w-8 h-8 text-red-500" />
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
                Common Nintendo Repairs
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
                    <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                    {category.category}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.repairs.map((repair, repairIndex) => (
                      <div
                        key={repairIndex}
                        className="bg-bg-light rounded-xl p-5 border border-gray-100 hover:border-red-200 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <repair.icon className="w-5 h-5 text-red-600" />
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
            <div className="mt-12 bg-red-50 rounded-2xl p-6 md:p-8 border border-red-100">
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
                  className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
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
                Common questions about our Nintendo repair services
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
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Fix Your Nintendo?
              </h2>
              <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
                Get started with a free diagnosis. We&apos;ll have your Nintendo
                back in action in no time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/request-repair"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors shadow-lg"
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
