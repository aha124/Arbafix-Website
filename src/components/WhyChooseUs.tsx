import { Users, DollarSign, Clock, Cpu } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Users,
      title: "Expert Technicians",
      description:
        "Our certified technicians have years of experience repairing all types of gaming consoles.",
    },
    {
      icon: DollarSign,
      title: "No Fix, No Fee",
      description:
        "If we can't repair your device, you don't pay. It's that simple. No hidden costs.",
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description:
        "Most repairs are completed within 3-5 business days. Rush options available.",
    },
    {
      icon: Cpu,
      title: "Quality Parts",
      description:
        "We use only high-quality replacement parts to ensure your console works like new.",
    },
  ];

  return (
    <section id="about" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
            Why Gamers Trust Arbafix
          </h2>
          <p className="mt-4 text-lg text-text-body max-w-2xl mx-auto">
            Dedicated to providing the best repair experience for your gaming
            consoles.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-5 p-6 bg-bg-light rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-dark">
                  {feature.title}
                </h3>
                <p className="mt-2 text-text-body leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
