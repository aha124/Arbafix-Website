import { ClipboardList, Package, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      step: "1",
      title: "Request a Repair",
      description:
        "Fill out our simple online form describing your console's issues. We'll get back to you with a free estimate.",
    },
    {
      icon: Package,
      step: "2",
      title: "Ship Your Device",
      description:
        "We provide a free prepaid shipping label. Securely pack your console and drop it off at any carrier location.",
    },
    {
      icon: CheckCircle,
      step: "3",
      title: "Get It Back Fixed",
      description:
        "We repair your device quickly and ship it back for free. Every repair includes our 90-day warranty.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-bg-light py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
            Getting your console repaired is easy. We handle everything from
            start to finish.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gray-200"></div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step Number & Icon */}
                <div className="relative inline-block">
                  <div className="w-16 h-16 bg-white border-2 border-primary rounded-full flex items-center justify-center mx-auto shadow-md relative z-10">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-bold text-text-dark">
                  {step.title}
                </h3>
                <p className="mt-3 text-text-body leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
