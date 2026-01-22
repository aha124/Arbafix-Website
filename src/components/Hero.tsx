import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark leading-tight">
              Professional Console Repair You Can Trust
            </h1>
            <p className="mt-6 text-lg md:text-xl text-text-body leading-relaxed">
              Expert repairs for Nintendo, PlayStation, Xbox, and retro consoles.{" "}
              <span className="text-success font-semibold">90-day warranty</span> on
              every repair.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
              >
                Start Your Repair
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-text-body font-semibold hover:text-text-dark transition-colors"
              >
                See how it works
                <ChevronDown className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-bg-light rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-text-body"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-text-body font-medium">Console repair image</p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-success/10 rounded-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
