import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Console Repair | Arbafix",
  description:
    "Check the status of your Arbafix console repair using your ticket number. See real-time updates from received to shipped back.",
  alternates: { canonical: "/track" },
  openGraph: {
    title: "Track Your Console Repair | Arbafix",
    description:
      "Check the status of your Arbafix console repair using your ticket number.",
    url: "/track",
    type: "website",
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
