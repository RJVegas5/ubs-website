import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Building Maintenance Services Las Vegas | Ultimate Building Services",
  description: "Comprehensive commercial building maintenance in Las Vegas. Interior & exterior upkeep, repairs, handyman work. Licensed contractor NV #91170. Call (702) 795-2855.",
};

export default function BuildingMaintenancePage() {
  return (
    <ServicePageTemplate
      service="Building Maintenance"
      slug="building-maintenance"
      headline="COMPLETE BUILDING"
      subheadline="MAINTENANCE."
      description="Comprehensive interior and exterior building upkeep. From minor repairs to full facility management — keeping your property at peak performance year-round so you can focus on your business."
      icon="🔧"
      color="#2A3A9E"
      includes={[
        "Interior & exterior upkeep",
        "Minor plumbing repairs",
        "Electrical fixture replacement",
        "Door & hardware repairs",
        "Lighting maintenance",
        "HVAC filter changes",
        "Caulking & sealing",
        "Tile & grout repair",
        "Ceiling tile replacement",
        "Fence & gate repairs",
        "Exterior surface touch-ups",
        "General handyman work",
      ]}
      industries={[
        "Office Buildings",
        "Retail Centers",
        "Warehouses",
        "Medical Facilities",
        "Property Management",
        "Schools",
        "Restaurants",
        "Industrial Facilities",
      ]}
      benefits={[
        { icon: "🏗️", title: "One Call, All Trades", body: "Plumbing, electrical, carpentry, painting — one call handles it all. No need to manage multiple contractors." },
        { icon: "📋", title: "Proactive Maintenance", body: "We identify issues before they become expensive problems, protecting your property investment." },
        { icon: "⚡", title: "Fast Response", body: "Same-day response for urgent maintenance needs. We understand that downtime costs money." },
        { icon: "🛡️", title: "Licensed Contractor", body: "NV Contractor License #91170 with bid limit of $45,000. Fully licensed for commercial work." },
        { icon: "💰", title: "Cost Effective", body: "Regular maintenance prevents expensive emergency repairs and extends the life of your building systems." },
        { icon: "📱", title: "Direct Ownership Access", body: "Direct line to ownership. Every concern addressed same-day, no middlemen, no runaround." },
      ]}
      process={[
        { step: "01", title: "Facility Walk", body: "We inspect your property and document current conditions, priority items, and a maintenance schedule." },
        { step: "02", title: "Maintenance Plan", body: "We build a preventive maintenance plan matched to your building type and budget." },
        { step: "03", title: "Ongoing Service", body: "Scheduled maintenance visits keep your property performing. Urgent issues handled same-day." },
        { step: "04", title: "Detailed Reports", body: "Monthly service reports document all work completed, issues found, and recommendations." },
      ]}
      faqs={[
        { q: "What types of maintenance work do you handle?", a: "We handle a wide range: minor plumbing, electrical fixtures, carpentry, painting touch-ups, door hardware, HVAC filters, ceiling tiles, caulking, and general handyman work. For major systems we can coordinate licensed subcontractors." },
        { q: "Do you offer emergency maintenance service?", a: "Yes, we offer priority response for urgent maintenance issues. Contact us directly at (702) 795-2855." },
        { q: "What is your contractor license number?", a: "NV Contractor License #91170 with a bid limit of $45,000. We are fully licensed, bonded, and insured for commercial work in Nevada." },
        { q: "Can you handle maintenance for multiple locations?", a: "Absolutely. We work with property management companies managing multiple properties throughout the Las Vegas Valley." },
        { q: "How do you document completed work?", a: "We provide detailed service reports after each visit, including work completed, materials used, and any issues noted for follow-up." },
      ]}
    />
  );
}
