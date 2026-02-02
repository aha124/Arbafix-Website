import { Star, BadgeCheck, ExternalLink } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "This was by far, the best experience I've had with any of my eBay transactions. The seller was exceptionally quick with communication, he received my Xbox, fixed it and shipped it back all in the same day.",
      repairType: "Xbox Series X HDMI Repair",
      category: "Speed",
    },
    {
      quote:
        "5 out of 5 stars! I needed an HDMI port solder on PS4 motherboard that was also missing a pin/pad and he did an amazing job. Complete and shipped back in less than 24 hours, very clean and professional soldering.",
      repairType: "PS4 HDMI Repair",
      category: "Expertise",
    },
    {
      quote:
        "Excellent communication, total professional, and extremely skilled. Seller was able to bring back my PS5 to life. The same PS5 that I showed other repair professionals and they said it was a goner.",
      repairType: "PS5 HDMI Repair",
      category: "Trust",
    },
    {
      quote:
        "Lightning fast is an accurate description for the time frame in which my PS5 returned. Less than 48 hours from when I shipped it.",
      repairType: "PS5 HDMI Repair",
      category: "Speed",
    },
    {
      quote:
        "Very fast and professional repair service. Got my Xbox Series X done in 1 day. I recommend him for the very difficult and tedious repairs.",
      repairType: "Xbox Series X HDMI Repair",
      category: "Quality",
    },
    {
      quote:
        "Good Business. I highly recommend. Honest and Truthful and Friendly.",
      repairType: "PS4 Disc Drive Replacement",
      category: "Honesty",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
            Real reviews from verified eBay buyers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-bg-light rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-text-body italic leading-relaxed mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-text-dark font-medium">
                  — eBay Buyer | {testimonial.repairType}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Verified eBay Buyer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="https://www.ebay.com/fdbk/feedback_profile/arbafix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            See all 1,200+ reviews on eBay
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
