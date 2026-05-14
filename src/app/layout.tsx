import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://arbafix.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arbafix - Professional Video Game Console Repair | Hershey, PA",
    template: "%s | Arbafix",
  },
  description:
    "Expert repairs for Nintendo, PlayStation, Xbox, and retro consoles. 90-day warranty on every repair. Serving Hershey, PA and surrounding south-central Pennsylvania.",
  keywords: [
    "console repair",
    "video game repair",
    "Nintendo Switch repair",
    "PlayStation repair",
    "PS5 HDMI repair",
    "Xbox repair",
    "Hershey PA",
    "Harrisburg PA",
    "game console fix",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Arbafix - Professional Video Game Console Repair",
    description:
      "Expert repairs for Nintendo, PlayStation, Xbox, and retro consoles. 90-day warranty on every repair.",
    url: SITE_URL,
    siteName: "Arbafix",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbafix - Professional Video Game Console Repair",
    description:
      "Expert repairs for Nintendo, PlayStation, Xbox, and retro consoles. 90-day warranty on every repair.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
