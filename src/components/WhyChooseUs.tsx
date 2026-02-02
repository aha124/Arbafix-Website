import { Award, ShieldCheck, Cpu, DollarSign } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Award,
      title: "Proven Track Record",
      description:
        "Over 1,200 verified reviews with a 100% positive rating on eBay since 2006. Nearly 20 years of trusted console repairs.",
    },
    {
      icon: ShieldCheck,
      title: "Honest Service",
      description:
        "If we can't fix it, you get a full refund. No questions asked. We believe in transparency and fair pricing.",
    },
    {
      icon: Cpu,
      title: "Expert Soldering",
      description:
        "Specializing in HDMI port repairs, trace repairs, and retimer IC replacements that other shops turn away.",
    },
    {
      icon: DollarSign,
      title: "No Fix, No Fee",
      description:
        "We specialize in repairs other shops say are impossible. If we can't complete the repair, you don't pay a dime.",
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
            With nearly 20 years of experience and over 1,200 verified eBay reviews,
            we&apos;ve built our reputation on honest service and expert repairs.
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

        {/* About Section */}
        <div className="mt-16 bg-bg-light rounded-2xl p-8 md:p-10 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-text-dark mb-4">
                About Arbafix
              </h3>
              <p className="text-text-body leading-relaxed mb-4">
                Founded in 2006, Arbafix has been a trusted name in gaming console repairs
                for nearly two decades. What started as a passion for fixing gaming devices
                has grown into a repair service trusted by thousands of customers nationwide.
              </p>
              <p className="text-text-body leading-relaxed">
                We specialize in the repairs that other shops turn away &mdash; complex HDMI
                port replacements, trace repairs, and motherboard-level fixes. With over
                1,200 verified reviews and a 100% positive feedback rating on eBay, our
                track record speaks for itself.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark">1,200+ Verified Reviews</p>
                  <p className="text-sm text-text-body">100% positive feedback on eBay</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark">Trusted Since 2006</p>
                  <p className="text-sm text-text-body">Nearly 20 years of repairs</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark">Full Refund Guarantee</p>
                  <p className="text-sm text-text-body">If we can&apos;t fix it, you don&apos;t pay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
