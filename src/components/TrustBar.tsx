import { Shield, Truck, Award, Star } from "lucide-react";

export default function TrustBar() {
  const trustItems = [
    {
      icon: Star,
      title: "1,200+ Verified Reviews",
      description: "On eBay",
    },
    {
      icon: Award,
      title: "100% Positive Rating",
      description: "Trusted by gamers",
    },
    {
      icon: Shield,
      title: "90-Day Warranty",
      description: "Every repair guaranteed",
    },
    {
      icon: Truck,
      title: "Free Return Shipping",
      description: "On all repairs",
    },
  ];

  return (
    <section className="bg-bg-light border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center md:justify-start gap-4"
            >
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-text-dark">{item.title}</h3>
                <p className="text-sm text-text-body">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
