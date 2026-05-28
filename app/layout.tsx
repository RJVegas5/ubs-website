import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultimate Building Services, Inc. | Commercial Janitorial & Building Maintenance Las Vegas",
  description: "Las Vegas' premier commercial janitorial and building maintenance company. Licensed & insured (NV Lic #91170). Serving Las Vegas, Henderson, Summerlin, North Las Vegas & Boulder City. Call (702) 795-2855.",
  keywords: "commercial cleaning Las Vegas, janitorial services Las Vegas, building maintenance Las Vegas, office cleaning Henderson, pressure washing Las Vegas, carpet cleaning commercial, electrostatic disinfection Las Vegas, UBS cleaning, Ultimate Building Services",
  authors: [{ name: "Ultimate Building Services, Inc." }],
  creator: "Ultimate Building Services, Inc.",
  publisher: "Ultimate Building Services, Inc.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ultimatebuildingservices.com",
    siteName: "Ultimate Building Services, Inc.",
    title: "Ultimate Building Services, Inc. | #1 Commercial Cleaning Las Vegas",
    description: "Family-owned commercial janitorial & building maintenance. Licensed, insured, and trusted by Las Vegas businesses. NV Lic #91170.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ultimate Building Services Las Vegas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Building Services, Inc. | Commercial Cleaning Las Vegas",
    description: "Family-owned commercial janitorial & building maintenance serving Las Vegas, Henderson, Summerlin & more.",
  },
  alternates: {
    canonical: "https://ultimatebuildingservices.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="grain">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Ultimate Building Services, Inc.",
              "image": "https://ultimatebuildingservices.com/og-image.jpg",
              "@id": "https://ultimatebuildingservices.com",
              "url": "https://ultimatebuildingservices.com",
              "telephone": "(702) 795-2855",
              "email": "ultimate@prosharedservices.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2645 Sorrel St.",
                "addressLocality": "Las Vegas",
                "addressRegion": "NV",
                "postalCode": "89146",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 36.1441,
                "longitude": -115.2028
              },
              "areaServed": ["Las Vegas", "Henderson", "Summerlin", "North Las Vegas", "Boulder City"],
              "priceRange": "$$",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "06:00",
                "closes": "22:00"
              },
              "sameAs": [],
              "description": "Ultimate Building Services, Inc. is a family-owned and operated commercial janitorial and building maintenance company serving Las Vegas, Henderson, Summerlin, North Las Vegas, and Boulder City, Nevada.",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Commercial Cleaning & Maintenance Services",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Janitorial Services" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Building Maintenance" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pressure Washing" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Carpet Cleaning" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Window Cleaning" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Painting" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Drywall Services" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrostatic Disinfection" } }
                ]
              }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
