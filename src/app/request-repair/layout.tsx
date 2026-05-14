import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Repair Request - Free Quote | Arbafix Hershey PA",
  description:
    "Request a free repair quote for your Nintendo, PlayStation, Xbox, or retro console. Three-step form, no obligation. Mail-in service from anywhere in the U.S.",
  alternates: { canonical: "/request-repair" },
  openGraph: {
    title: "Start a Repair Request - Free Quote | Arbafix",
    description:
      "Request a free repair quote for your Nintendo, PlayStation, Xbox, or retro console.",
    url: "/request-repair",
    type: "website",
  },
};

export default function RequestRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
