import { Gamepad2, ChevronRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Nintendo",
      subtitle: "Switch, 3DS, Wii & Retro",
      items: [
        "Joy-Con drift repair",
        "Screen replacement",
        "Battery replacement",
        "Charging port repair",
      ],
      color: "bg-red-500",
    },
    {
      title: "PlayStation",
      subtitle: "PS5, PS4, PS3 & Vita",
      items: [
        "HDMI port repair",
        "Disc drive issues",
        "Overheating fixes",
        "Controller repair",
      ],
      color: "bg-blue-600",
    },
    {
      title: "Xbox",
      subtitle: "Series X/S, One & 360",
      items: [
        "Power supply issues",
        "Red ring of death",
        "Disc drive repair",
        "Controller stick drift",
      ],
      color: "bg-green-600",
    },
  ];

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
            What We Repair
          </h2>
          <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
            From modern consoles to classic retro systems, we fix them all with
            expert care and quality parts.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow group"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-5`}
              >
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-text-dark">{service.title}</h3>
              <p className="text-text-body text-sm mt-1">{service.subtitle}</p>

              {/* Items */}
              <ul className="mt-4 space-y-2">
                {service.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center gap-2 text-text-body"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <a
                href="#contact"
                className="inline-flex items-center gap-1 mt-6 text-primary font-semibold group-hover:gap-2 transition-all"
              >
                Learn more
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
