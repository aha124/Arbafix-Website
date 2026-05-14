"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const HIDDEN_PATH_PREFIXES = ["/admin", "/request-repair", "/payment"];

export default function StickyMobileCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, [pathname]);

  const hidden = HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (hidden) return null;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-[0_-2px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div className="px-4 py-3">
        <Link
          href="/request-repair"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-primary text-white font-semibold text-base hover:bg-primary-dark active:bg-primary-dark transition-colors"
        >
          Start Repair Request
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
