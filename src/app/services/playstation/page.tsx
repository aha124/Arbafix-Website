import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  HardDrive,
  Thermometer,
} from "lucide-react";

export const metadata: Metadata = {
  title: "PlayStation Repair Services | Arbafix - Hershey, PA",
  description:
    "Expert PlayStation repair services in Hershey, PA. We fix PS5, PS4, PS3, PS Vita, PSP and retro systems. HDMI port repair, disc drive fixes, overheating solutions. Free diagnosis.",
};

export default function PlayStationServicesPage() {
  const devices = [
    {
      name: "PlayStation 5",
      description: "Standard & Digital Edition",
      image: "ps5",
    },
    {
      name: "PS5 Slim",
      description: "Compact model",
      image: "ps5-slim",
    },
    {
      name: "PlayStation 4",
      description: "Original model",
      image: "ps4",
    },
    {
      name: "PS4 Pro",
      description: "Enhanced performance",
      image: "ps4-pro",
    },
    {
      name: "PlayStation 3",
      description: "All models",
      image: "ps3",
    },
    {
      name: "PS Vita",
      description: "OLED & LCD models",
      image: "vita",
    },
    {
      name: "PSP",
      description: "All PSP models",
      image: "psp",
    },
    {
      name: "Retro Systems",
      description: "PS1 & PS2",
      image: "retro",
    },
  ];

  const commonRepairs = [
    {
      category: "PS5 / PS5 Slim",
      repairs: [
        {
          name: "HDMI Port Repair",
          description:
            "Fix bent pins, no signal, or damaged HDMI ports for video output",
          icon: Monitor,
        },
        {
          name: "Disc Drive Repair",
          description:
            "Repair drives that won't read, eject, or accept discs",
          icon: Disc3,
        },
        {
          name: "Overheating Fixes",
          description:
            "Clean cooling system, replace thermal paste, fix fan issues",
          icon: Thermometer,
        },
        {
          name: "SSD Issues",
          description:
            "Diagnose and resolve internal storage problems",
          icon: HardDrive,
        },
        {
          name: "Controller Drift",
          description:
            "Fix DualSense analog stick drift and button issues",
          icon: Gamepad2,
        },
        {
          name: "Power Issues",
          description:
            "Repair consoles that won't turn on or have power cycling",
          icon: Zap,
        },
      ],
    },
    {
      category: "PS4 / PS4 Pro",
      repairs: [
        {
          name: "HDMI Port Repair",
          description:
            "The most common PS4 issue - fix damaged or non-working HDMI",
          icon: Monitor,
        },
        {
          name: "Disc Drive Repair",
          description:
            "Fix drives that make noise, won't read, or won't eject",
          icon: Disc3,
        },
        {
          name: "Overheating & Loud Fan",
          description:
            "Deep cleaning, thermal paste replacement, and fan repair",
          icon: Fan,
        },
        {
          name: "Power Supply",
          description:
            "Replace faulty power supply units for reliable operation",
          icon: Cpu,
        },
        {
          name: "Hard Drive Issues",
          description:
            "Upgrade or replace failing hard drives",
          icon: HardDrive,
        },
        {
          name: "Controller Repair",
          description:
            "Fix DualShock 4 drift, buttons, and charging issues",
          icon: Gamepad2,
        },
      ],
    },
    {
      category: "PlayStation 3",
      repairs: [
        {
          name: "YLOD (Yellow Light of Death)",
          description:
            "Diagnose and repair the infamous YLOD caused by overheating",
          icon: Thermometer,
        },
        {
          name: "Blu-ray Drive Repair",
          description:
            "Fix disc reading issues, laser replacement, and drive errors",
          icon: Disc3,
        },
        {
          name: "Thermal Paste Replacement",
          description:
            "Proper reflow and thermal paste application to prevent overheating",
          icon: Fan,
        },
        {
          name: "HDMI/AV Output",
          description:
            "Repair video output issues for both HDMI and legacy connections",
          icon: Monitor,
        },
      ],
    },
    {
      category: "PS Vita / PSP",
      repairs: [
        {
          name: "Screen Replacement",
          description:
            "Fix cracked, dead pixel, or touch-unresponsive screens",
          icon: Monitor,
        },
        {
          name: "Battery Replacement",
          description:
            "Replace degraded batteries for better portable playtime",
          icon: Battery,
        },
        {
          name: "Analog Stick Repair",
          description:
            "Fix drift, unresponsive, or broken analog sticks",
          icon: Gamepad2,
        },
        {
          name: "Charging Port",
          description:
            "Repair loose or non-working charging connections",
          icon: Zap,
        },
      ],
    },
    {
      category: "Retro (PS1, PS2)",
      repairs: [
        {
          name: "Laser Replacement",
          description:
            "Replace worn laser assemblies for reliable disc reading",
          icon: Disc3,
        },
        {
          name: "Capacitor Replacement",
          description:
            "Replace aging capacitors causing power or audio issues",
          icon: CircuitBoard,
        },
        {
          name: "Controller Port Repair",
          description:
            "Fix loose or non-functional controller connections",
          icon: Gamepad2,
        },
        {
          name: "AV Output Repair",
          description:
            "Restore video and audio output on classic systems",
          icon: Monitor,
        },
      ],
    },
  ];

  const faqs = [
    {
      question: "My PS5 has no display output. Can you fix it?",
      answer:
        "Yes! HDMI port issues are one of our most common repairs. Whether it's bent pins, a damaged port, or an internal HDMI encoder issue, we can diagnose and repair it. Most HDMI repairs are completed within 3-5 business days.",
    },
    {
      question: "Why is my PS4 so loud? Can this be fixed?",
      answer:
        "A loud PS4 is usually caused by dust buildup and degraded thermal paste. We perform a thorough cleaning of the cooling system and replace the thermal paste, which typically makes the console run much quieter and cooler.",
    },
    {
      question: "Can you fix the Yellow Light of Death on PS3?",
      answer:
        "We can diagnose YLOD issues and in many cases provide repairs. YLOD is typically caused by solder joint failures due to overheating. We'll assess the console and give you an honest evaluation of repair options.",
    },
    {
      question: "Do you repair DualSense and DualShock controllers?",
      answer:
        "Yes! We fix controller drift, unresponsive buttons, charging issues, and more for both DualSense (PS5) and DualShock 4 (PS4) controllers.",
    },
    {
      question: "Can you upgrade my PS4 hard drive to an SSD?",
      answer:
        "Absolutely! We can upgrade your PS4 or PS4 Pro with a faster SSD for improved load times. We handle the hardware installation and can assist with data transfer.",
    },
    {
      question: "What warranty do you offer on PlayStation repairs?",
      answer:
        "All our PlayStation repairs come with a 90-day warranty. If the same issue returns within that period, we'll repair it at no additional cost.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section - PlayStation Blue */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-2xl">
                <Link
                  href="/services"
                  className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  All Services
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  PlayStation Repair Services
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Expert HDMI repairs, disc drive fixes, and overheating
                  solutions for all PlayStation generations. From PS5 to classic
                  PS1.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/request-repair"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
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
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-text-dark font-medium">
                  90-Day Warranty
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-600" />
                <span className="text-text-dark font-medium">
                  Free Diagnosis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-text-dark font-medium">
                  Fast Turnaround
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
                Devices We Repair
              </h2>
              <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
                We service all PlayStation consoles and handhelds, from the
                latest PS5 to classic retro systems.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {devices.map((device, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="w-8 h-8 text-blue-600" />
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
                Common PlayStation Repairs
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
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    {category.category}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.repairs.map((repair, repairIndex) => (
                      <div
                        key={repairIndex}
                        className="bg-bg-light rounded-xl p-5 border border-gray-100 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <repair.icon className="w-5 h-5 text-blue-600" />
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
            <div className="mt-12 bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100">
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
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
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
                Common questions about our PlayStation repair services
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
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Fix Your PlayStation?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Get started with a free diagnosis. We&apos;ll have your
                PlayStation back in action in no time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/request-repair"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
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
