import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Commercial Pressure Washing Las Vegas | Ultimate Building Services",
  description: "Professional commercial pressure washing in Las Vegas. Building exteriors, parking lots, sidewalks, dumpster pads, graffiti removal. Licensed & insured. (702) 795-2855.",
};

export default function PressureWashingPage() {
  return (
    <ServicePageTemplate
      service="Pressure Washing"
      slug="pressure-washing"
      headline="COMMERCIAL"
      subheadline="PRESSURE WASHING."
      description="High-powered exterior cleaning for concrete, building facades, parking lots, dumpster areas, and entryways. First impressions start before your clients even walk in the door."
      icon="💧"
      color="#1A2470"
      includes={[
        "Building exterior washing",
        "Concrete & sidewalk cleaning",
        "Parking lot washing",
        "Dumpster pad cleaning",
        "Drive-through cleaning",
        "Loading dock areas",
        "Graffiti removal",
        "Stairways & walkways",
        "Storefront facades",
        "Awning cleaning",
        "Trash enclosure areas",
        "Curb & gutter cleaning",
      ]}
      industries={[
        "Retail Centers",
        "Restaurants",
        "Warehouses & Industrial",
        "Medical Facilities",
        "Office Complexes",
        "Schools",
        "Auto Dealerships",
        "Property Management",
      ]}
      benefits={[
        { icon: "✨", title: "Curb Appeal Matters", body: "A clean exterior communicates professionalism and quality before customers enter your doors." },
        { icon: "🏗️", title: "Protect Your Investment", body: "Regular pressure washing prevents buildup that degrades concrete, masonry, and exterior surfaces over time." },
        { icon: "💧", title: "Commercial Equipment", body: "We use commercial-grade, high-pressure equipment that delivers results far beyond standard consumer units." },
        { icon: "🌿", title: "Eco-Friendly Methods", body: "EPA-approved cleaning agents and water recovery techniques minimize environmental impact." },
        { icon: "📅", title: "Flexible Scheduling", body: "We work early mornings, nights, and weekends to avoid disrupting your business operations." },
        { icon: "⭐", title: "Consistent Results", body: "Before and after documentation for every job. See the difference or we redo it free." },
      ]}
      process={[
        { step: "01", title: "Site Assessment", body: "We evaluate your surfaces, identify problem areas, and select the appropriate pressure and cleaning agents." },
        { step: "02", title: "Prep & Protect", body: "We protect surrounding areas, cover landscaping, and pre-treat stubborn stains before washing." },
        { step: "03", title: "Power Wash", body: "Commercial-grade equipment delivers precise cleaning at the right pressure for each surface type." },
        { step: "04", title: "Inspect & Document", body: "Final walkthrough with you. We document before and after for your records." },
      ]}
      faqs={[
        { q: "How often should commercial properties be pressure washed?", a: "Most commercial properties benefit from pressure washing 2-4 times per year. High-traffic areas like drive-throughs and dumpster pads may need monthly service." },
        { q: "Can you remove graffiti?", a: "Yes, we specialize in graffiti removal from concrete, brick, metal, and most exterior surfaces using professional-grade removal agents." },
        { q: "Do you offer after-hours pressure washing?", a: "Yes, we frequently work early mornings and late evenings to minimize disruption to your operations and customers." },
        { q: "Will pressure washing damage my property?", a: "Our technicians are trained to select the appropriate pressure for each surface. We do not use excessive pressure that could damage delicate surfaces." },
        { q: "Do you service the entire Las Vegas valley?", a: "Yes — Las Vegas, Henderson, Summerlin, North Las Vegas, and Boulder City. Call for other areas." },
      ]}
    />
  );
}
