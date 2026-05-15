import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Arbafix - Console Repair in Hershey PA | Call (570) 419-8540",
  description:
    "Contact Arbafix for console repair questions, quote requests, or warranty claims. Phone, email, and contact form. Serving Hershey, Harrisburg, Lancaster, York PA.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Arbafix - Console Repair in Hershey PA",
    description:
      "Contact Arbafix for console repair questions, quotes, or warranty claims.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
