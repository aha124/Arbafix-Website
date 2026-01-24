import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const links = {
    services: [
      { label: "Nintendo Repair", href: "#services" },
      { label: "PlayStation Repair", href: "#services" },
      { label: "Xbox Repair", href: "#services" },
      { label: "Retro Console Repair", href: "#services" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Track Repair", href: "/track" },
      { label: "FAQ", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Warranty Info", href: "#" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Arbafix</span>
            </a>
            <p className="mt-4 text-gray-400 leading-relaxed max-w-sm">
              Professional video game console repair service. Expert technicians,
              quality parts, and a 90-day warranty on every repair.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="mailto:repairs@arbafix.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                repairs@arbafix.com
              </a>
              <a
                href="tel:+15704198540"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                (570) 419-8540
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                Serving Hershey, PA & Surrounding Areas
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {links.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Arbafix. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Professional Console Repair in Hershey, PA
          </p>
        </div>
      </div>
    </footer>
  );
}
