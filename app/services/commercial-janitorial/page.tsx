import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Commercial Janitorial Services Las Vegas | Ultimate Building Services",
  description: "Professional commercial janitorial services in Las Vegas, Henderson & Summerlin. Daily, weekly, or custom schedules. Licensed, insured, family-owned. Call (702) 795-2855.",
};

export default function CommercialJanitorialPage() {
  return (
    <ServicePageTemplate
      service="Commercial Janitorial"
      slug="commercial-janitorial"
      headline="PROFESSIONAL"
      subheadline="JANITORIAL SERVICES."
      description="Complete facility cleaning tailored to your schedule and needs. We cover every corner — restrooms, common areas, floors, surfaces — with zero disruption to your business operations."
      icon="🏢"
      color="#3B4FC8"
      includes={[
        "Daily, weekly, or custom schedules",
        "Restrooms & common areas",
        "Breakroom & kitchen cleaning",
        "Trash removal & recycling",
        "Floor mopping & vacuuming",
        "Surface sanitization & disinfection",
        "Entry & lobby cleaning",
        "Conference room cleaning",
        "Window sill & ledge wiping",
        "Stairwell & elevator cleaning",
        "Parking garage spot cleaning",
        "Supply restocking (optional)",
      ]}
      industries={[
        "Corporate Offices",
        "Medical & Dental Offices",
        "Retail Stores",
        "Schools & Daycares",
        "Government Buildings",
        "Financial Institutions",
        "Law Firms",
        "Property Management",
      ]}
      benefits={[
        { icon: "🔍", title: "Attention to Detail", body: "We inspect what others skip. Every surface, every corner, every visit — no exceptions and no shortcuts." },
        { icon: "👥", title: "Consistent Team", body: "The same background-checked crew every visit. You know who's in your building, and they know your space." },
        { icon: "📅", title: "Your Schedule", body: "We work days, nights, and weekends — around your operations, not around ours." },
        { icon: "⭐", title: "Commercial-Grade Products", body: "Professional cleaning solutions and equipment that deliver lasting, visible results your clients notice." },
        { icon: "✅", title: "Satisfaction Guaranteed", body: "100% satisfaction or we come back at no charge. We don't stop until the job is done right." },
        { icon: "🛡️", title: "Fully Licensed & Insured", body: "NV Contractor License #91170. Fully bonded and insured for your complete peace of mind." },
      ]}
      process={[
        { step: "01", title: "Free Estimate", body: "We walk your facility and build a custom plan matched to your size, schedule, and budget." },
        { step: "02", title: "Custom Plan", body: "You approve the scope, frequency, and price. No surprises, no hidden fees." },
        { step: "03", title: "Crew Assigned", body: "We assign your dedicated team and introduce them to your facility before service begins." },
        { step: "04", title: "Ongoing Service", body: "Your facility is cleaned on schedule every time. Direct line to ownership for any concerns." },
      ]}
      faqs={[
        { q: "What areas of Las Vegas do you serve?", a: "We serve Las Vegas, Henderson, Summerlin, North Las Vegas, and Boulder City. Call us for other areas." },
        { q: "Do you offer after-hours or weekend cleaning?", a: "Yes — we offer flexible scheduling including nights and weekends to work around your business operations." },
        { q: "Are your cleaners background checked?", a: "Every UBS employee is fully background checked before they set foot in any client facility." },
        { q: "What cleaning products do you use?", a: "We use commercial-grade, EPA-approved cleaning solutions. We can accommodate green or fragrance-free products on request." },
        { q: "How quickly can you start?", a: "We typically complete a walkthrough within 24-48 hours and can begin service within a week of signing an agreement." },
        { q: "What if I'm not satisfied?", a: "100% satisfaction guaranteed. If anything is missed, call us and we'll return to fix it at no charge." },
      ]}
    />
  );
}
