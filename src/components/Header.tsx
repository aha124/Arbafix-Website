"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Wrench, Menu, X, ChevronDown, Gamepad2 } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const serviceLinks = [
    { href: "/services/nintendo", label: "Nintendo", color: "bg-red-500" },
    { href: "/services/playstation", label: "PlayStation", color: "bg-blue-600" },
    { href: "/services/xbox", label: "Xbox", color: "bg-green-600" },
  ];

  const navLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/track", label: "Track Repair" },
    { href: "/blog", label: "Blog" },
    { href: "/#about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-dark transition-colors">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-dark">Arbafix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                className="flex items-center gap-1 text-text-body hover:text-text-dark transition-colors font-medium"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onMouseEnter={() => setIsServicesOpen(true)}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <Link
                    href="/services"
                    className="flex items-center gap-3 px-4 py-2.5 text-text-body hover:bg-bg-light hover:text-text-dark transition-colors"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">All Services</span>
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-text-body hover:bg-bg-light hover:text-text-dark transition-colors"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center`}>
                        <Gamepad2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-body hover:text-text-dark transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="/#contact"
              className="inline-flex items-center px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
            >
              Get a Free Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-body hover:text-text-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              {/* Mobile Services Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full py-2 text-text-body hover:text-text-dark transition-colors font-medium"
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMobileServicesOpen ? "rotate-180" : ""}`} />
                </button>
                {isMobileServicesOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100">
                    <Link
                      href="/services"
                      className="flex items-center gap-3 py-2 text-text-body hover:text-text-dark transition-colors"
                      onClick={() => { setIsMenuOpen(false); setIsMobileServicesOpen(false); }}
                    >
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                        <Gamepad2 className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-medium">All Services</span>
                    </Link>
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 py-2 text-text-body hover:text-text-dark transition-colors"
                        onClick={() => { setIsMenuOpen(false); setIsMobileServicesOpen(false); }}
                      >
                        <div className={`w-6 h-6 ${link.color} rounded flex items-center justify-center`}>
                          <Gamepad2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2 text-text-body hover:text-text-dark transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Get a Free Quote
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
