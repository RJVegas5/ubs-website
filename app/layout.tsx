import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ultimatebuildingservices.com"),
  title: {
    default: "Ultimate Building Services, Inc. | #1 Commercial Cleaning Las Vegas",
    template: "%s | Ultimate Building Services Las Vegas",
  },
  description: "Las Vegas' top-rated commercial janitorial & building maintenance company. Licensed (NV Lic #91170), insured & family-owned. Serving Las Vegas, Henderson, Summerlin, North Las Vegas & Boulder City. Call (702) 795-2855 for a free quote.",
  keywords: [
    "commercial cleaning Las Vegas",
    "janitorial services Las Vegas",
    "commercial janitorial Las Vegas NV",
    "office cleaning Las Vegas",
    "building maintenance Las Vegas",
    "commercial cleaning Henderson NV",
    "office cleaning Henderson Nevada",
    "janitorial services Henderson",
    "commercial cleaning Summerlin",
    "pressure washing Las Vegas",
    "commercial pressure washing Las Vegas",
    "carpet cleaning Las Vegas commercial",
    "window cleaning Las Vegas commercial",
    "electrostatic disinfection Las Vegas",
    "floor cleaning Las Vegas",
    "commercial painting Las Vegas",
    "drywall services Las Vegas",
    "building maintenance Henderson",
    "commercial cleaning North Las Vegas",
    "commercial cleaning Boulder City",
    "janitorial company Las Vegas",
    "cleaning company Las Vegas NV",
    "office building cleaning Las Vegas",
    "retail cleaning Las Vegas",
    "medical office cleaning Las Vegas",
    "school cleaning Las Vegas",
    "warehouse cleaning Las Vegas",
    "property management cleaning Las Vegas",
    "UBS cleaning Las Vegas",
    "Ultimate Building Services",
    "licensed janitorial contractor Nevada",
    "NV Lic 91170",
    "family owned cleaning company Las Vegas",
    "full service janitorial Las Vegas",
    "commercial disinfection Las Vegas",
    "exterior maintenance Las Vegas",
    "upholstery cleaning commercial Las Vegas",
  ],
  authors: [{ name: "Ultimate Building Services, Inc." }],
  creator: "Ultimate Building Services, Inc.",
  publisher: "Ultimate Building Services, Inc.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ultimatebuildingservices.com",
    siteName: "Ultimate Building Services, Inc.",
    title: "Ultimate Building Services, Inc. | #1 Commercial Cleaning Las Vegas",
    description: "Family-owned commercial janitorial & building maintenance. Licensed (NV Lic #91170) & insured. Serving Las Vegas, Henderson, Summerlin & more. Free quotes. (702) 795-2855.",
    images: [{ url: "/header-bg.png", width: 1920, height: 780, alt: "Ultimate Building Services - Professional Commercial Cleaning Las Vegas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Building Services, Inc. | Commercial Cleaning Las Vegas",
    description: "Family-owned commercial janitorial & building maintenance serving Las Vegas, Henderson, Summerlin & more. NV Lic #91170.",
    images: ["/header-bg.png"],
  },
  alternates: { canonical: "https://ultimatebuildingservices.com" },
  category: "Commercial Cleaning & Janitorial Services",
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://ultimatebuildingservices.com/#business",
      "name": "Ultimate Building Services, Inc.",
      "alternateName": "UBS Cleaning Las Vegas",
      "image": "https://ultimatebuildingservices.com/header-bg.png",
      "logo": "https://ultimatebuildingservices.com/logo.png",
      "url": "https://ultimatebuildingservices.com",
      "telephone": "(702) 795-2855",
      "email": "ultimate@prosharedservices.com",
      "description": "Ultimate Building Services, Inc. is a family-owned and operated commercial janitorial and building maintenance company serving Las Vegas, Henderson, Summerlin, North Las Vegas, and Boulder City, Nevada. Licensed NV contractor #91170.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2645 Sorrel St.",
        "addressLocality": "Las Vegas",
        "addressRegion": "NV",
        "postalCode": "89146",
        "addressCountry": "US",
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 36.1441, "longitude": -115.2028 },
      "areaServed": [
        { "@type": "City", "name": "Las Vegas", "sameAs": "https://en.wikipedia.org/wiki/Las_Vegas" },
        { "@type": "City", "name": "Henderson", "sameAs": "https://en.wikipedia.org/wiki/Henderson,_Nevada" },
        { "@type": "City", "name": "Summerlin", "sameAs": "https://en.wikipedia.org/wiki/Summerlin_South,_Nevada" },
        { "@type": "City", "name": "North Las Vegas", "sameAs": "https://en.wikipedia.org/wiki/North_Las_Vegas,_Nevada" },
        { "@type": "City", "name": "Boulder City", "sameAs": "https://en.wikipedia.org/wiki/Boulder_City,_Nevada" },
      ],
      "priceRange": "$$",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "06:00",
        "closes": "22:00",
      },
      "hasCredential": { "@type": "EducationalOccupationalCredential", "name": "Nevada Contractor License #91170" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Commercial Cleaning & Maintenance Services Las Vegas",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Janitorial Services Las Vegas", "description": "Complete office and facility cleaning for Las Vegas businesses." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Building Maintenance Las Vegas", "description": "Interior and exterior building upkeep and maintenance." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pressure Washing Las Vegas", "description": "Commercial pressure washing for exteriors, parking lots, and entryways." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Carpet Cleaning Las Vegas Commercial", "description": "Deep extraction carpet cleaning for commercial properties." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Window Cleaning Las Vegas", "description": "Streak-free interior and exterior commercial window cleaning." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Painting Las Vegas", "description": "Interior and exterior commercial painting services." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Drywall Services Las Vegas", "description": "Commercial drywall installation, repair, and finishing." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrostatic Disinfection Las Vegas", "description": "Advanced 360° electrostatic disinfection for commercial facilities." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Floor Cleaning Las Vegas", "description": "Hard floor stripping, waxing, and polishing for commercial spaces." } },
        ],
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "47" },
      "sameAs": [],
    },
    {
      "@type": "WebSite",
      "@id": "https://ultimatebuildingservices.com/#website",
      "url": "https://ultimatebuildingservices.com",
      "name": "Ultimate Building Services, Inc.",
      "publisher": { "@id": "https://ultimatebuildingservices.com/#business" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What areas does Ultimate Building Services serve?", "acceptedAnswer": { "@type": "Answer", "text": "We serve Las Vegas, Henderson, Summerlin, North Las Vegas, and Boulder City, Nevada." } },
        { "@type": "Question", "name": "Is Ultimate Building Services licensed and insured?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we hold Nevada Contractor License #91170 and are fully insured." } },
        { "@type": "Question", "name": "What commercial cleaning services do you offer?", "acceptedAnswer": { "@type": "Answer", "text": "We offer commercial janitorial, building maintenance, pressure washing, carpet cleaning, window cleaning, floor care, electrostatic disinfection, drywall, and commercial painting services." } },
        { "@type": "Question", "name": "How do I get a quote for commercial cleaning?", "acceptedAnswer": { "@type": "Answer", "text": "Call us at (702) 795-2855 or fill out our online quote form at ultimatebuildingservices.com/contact" } },
        { "@type": "Question", "name": "Do you offer after-hours or weekend cleaning?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer flexible scheduling including nights and weekends to work around your business operations." } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="grain">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
