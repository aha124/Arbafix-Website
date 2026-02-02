import { Star, Award, Calendar, Wrench, ShieldCheck, ExternalLink } from "lucide-react";

export default function EbayTrustBadge() {
  const trustPoints = [
    {
      icon: Star,
      text: "1,148 Feedback Score on eBay",
    },
    {
      icon: Award,
      text: "100% Positive Rating",
    },
    {
      icon: Calendar,
      text: "Trusted Since 2006",
    },
    {
      icon: Wrench,
      text: "Nearly 20 Years of Console Repairs",
    },
    {
      icon: ShieldCheck,
      text: "Full Refund If We Can't Fix It",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left - Title & Description */}
            <div className="lg:max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-800 fill-yellow-800" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Trusted on eBay
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Verified seller with 100% positive feedback
                  </p>
                </div>
              </div>
              <a
                href="https://www.ebay.com/fdbk/feedback_profile/arbafix"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors mt-4"
              >
                View eBay Profile
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Right - Trust Points */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-white"
                >
                  <point.icon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{point.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
