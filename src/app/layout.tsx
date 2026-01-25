import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arbafix - Professional Video Game Console Repair | Hershey, PA",
  description:
    "Expert repairs for Nintendo, PlayStation, Xbox, and retro consoles. 90-day warranty on every repair. Serving Hershey, PA and surrounding areas.",
  keywords: [
    "console repair",
    "video game repair",
    "Nintendo repair",
    "PlayStation repair",
    "Xbox repair",
    "Hershey PA",
    "game console fix",
  ],
  openGraph: {
    title: "Arbafix - Professional Video Game Console Repair",
    description:
      "Expert repairs for Nintendo, PlayStation, Xbox, and retro consoles. 90-day warranty on every repair.",
    type: "website",
    locale: "en_US",
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
