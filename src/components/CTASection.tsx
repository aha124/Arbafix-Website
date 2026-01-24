import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="bg-primary py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Ready to Fix Your Console?
        </h2>
        <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
          Get a free diagnosis and quote. No fix, no fee - we only charge if we
          successfully repair your device.
        </p>
        <div className="mt-8">
          <a
            href="/request-repair"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Your Repair
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
        <p className="mt-6 text-blue-200 text-sm">
          Or call us at{" "}
          <a href="tel:+15704198540" className="underline hover:text-white">
            (570) 419-8540
          </a>
        </p>
      </div>
    </section>
  );
}
