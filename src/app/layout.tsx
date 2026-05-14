import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import StickyMobileCTA from "@/components/StickyMobileCTA";
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

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Arbafix",
  url: SITE_URL,
  description:
    "Professional video game console repair service. Expert repairs for Nintendo, PlayStation, Xbox, and retro consoles. 90-day warranty on every repair.",
  telephone: "+1-570-419-8540",
  email: "repairs@arbafix.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hershey",
    addressRegion: "PA",
    postalCode: "17033",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Hershey, PA" },
    { "@type": "City", name: "Harrisburg, PA" },
    { "@type": "City", name: "Lancaster, PA" },
    { "@type": "City", name: "York, PA" },
    { "@type": "City", name: "Lebanon, PA" },
    { "@type": "City", name: "Carlisle, PA" },
    { "@type": "AdministrativeArea", name: "South-central Pennsylvania" },
    { "@type": "Country", name: "United States" },
  ],
  serviceType: [
    "Video game console repair",
    "Nintendo Switch repair",
    "PlayStation repair",
    "Xbox repair",
    "Retro console repair",
    "Laptop diagnostics",
  ],
  sameAs: ["https://www.ebay.com/fdbk/feedback_profile/arbafix"],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    reviewCount: "1148",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {children}
        <StickyMobileCTA />
        <Analytics />
      </body>
    </html>
  );
}
