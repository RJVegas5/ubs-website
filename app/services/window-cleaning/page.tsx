import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Commercial Window Cleaning Las Vegas | Streak-Free | UBS",
  description: "Professional commercial window cleaning in Las Vegas. Interior & exterior, storefronts, high-rise. Streak-free results guaranteed. Licensed & insured. (702) 795-2855.",
};

export default function WindowCleaningPage() {
  return (
    <ServicePageTemplate
      service="Window Cleaning"
      slug="window-cleaning"
      headline="STREAK-FREE"
      subheadline="WINDOW CLEANING."
      description="Crystal clear interior and exterior window cleaning for offices, retail, and commercial buildings. Dirty windows undermine even the cleanest interior — we make sure they never let you down."
      icon="🪟"
      color="#60A5FA"
      includes={[
        "Interior window cleaning",
        "Exterior window cleaning",
        "Storefront glass & doors",
        "Partition & interior glass",
        "Screen cleaning",
        "Frame & sill wiping",
        "Track cleaning",
        "Mirror cleaning",
        "Lobby & entrance glass",
        "High-reach window access",
        "Post-construction glass cleaning",
        "Scheduled maintenance service",
      ]}
      industries={[
        "Corporate Offices",
        "Retail Stores",
        "Restaurants",
        "Hotels & Hospitality",
        "Medical Buildings",
        "Auto Dealerships",
        "Property Management",
        "Financial Institutions",
      ]}
      benefits={[
        { icon: "✨", title: "First Impressions", body: "Clean windows are one of the most visible indicators of a well-maintained facility to clients and visitors." },
        { icon: "☀️", title: "Natural Light", body: "Clean glass maximizes natural light transmission, improving the atmosphere and reducing lighting costs." },
        { icon: "🔬", title: "Streak-Free Guarantee", body: "Professional technique and pure water systems ensure streak-free results every time, or we come back free." },
        { icon: "📅", title: "Flexible Service", body: "Monthly, quarterly, or custom schedule. We work around your business hours to minimize disruption." },
        { icon: "🪜", title: "All Heights Covered", body: "Ground floor to elevated access — we have the equipment and training to safely clean windows at any height." },
        { icon: "🛡️", title: "Fully Insured", body: "Fully bonded and insured for your peace of mind. NV Contractor License #91170." },
      ]}
      process={[
        { step: "01", title: "Assessment", body: "We evaluate window type, height, soil level, and access requirements to scope the job accurately." },
        { step: "02", title: "Interior First", body: "All interior glass, frames, sills, and tracks cleaned from the inside." },
        { step: "03", title: "Exterior Cleaning", body: "Exterior surfaces cleaned using professional squeegee technique or pure water fed-pole systems." },
        { step: "04", title: "Final Inspection", body: "Every pane inspected for streaks or spots before we consider the job done." },
      ]}
      faqs={[
        { q: "How often should commercial windows be cleaned?", a: "Most commercial properties benefit from window cleaning monthly to quarterly. High-traffic storefronts and restaurants often need weekly exterior cleaning." },
        { q: "Do you clean interior and exterior on the same visit?", a: "Yes — we typically do both interior and exterior on the same visit for complete results, unless you only need one side." },
        { q: "Can you clean high-rise or elevated windows?", a: "We have equipment for most commercial heights. Contact us to discuss your specific building and we'll confirm we can safely service it." },
        { q: "What about hard water spots on Las Vegas windows?", a: "Las Vegas has notoriously hard water. We use specialized descaling solutions and techniques specifically designed for hard water stain removal." },
        { q: "Do you offer after-hours window cleaning?", a: "Yes — we can work early mornings or evenings to avoid disrupting your business or customers." },
      ]}
    />
  );
}
