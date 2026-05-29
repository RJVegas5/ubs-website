import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Post Construction Cleanup Las Vegas | Commercial Final Clean | UBS",
  description: "Professional post-construction cleanup in Las Vegas. Commercial final clean, debris removal, window cleaning, floor care after renovation. Licensed NV contractor. (702) 795-2855.",
};

export default function PostConstructionCleanupPage() {
  return (
    <ServicePageTemplate
      service="Post Construction Cleanup"
      slug="post-construction-cleanup"
      headline="POST CONSTRUCTION"
      subheadline="CLEANUP."
      description="Thorough commercial post-construction and renovation cleanup. From rough clean to final polish — we prepare your facility for opening day so you can move in with confidence."
      icon="🏗️"
      color="#FB923C"
      includes={[
        "Construction debris removal",
        "Dust & drywall dust removal",
        "Window & glass cleaning",
        "Hard floor cleaning & polishing",
        "Carpet cleaning post-construction",
        "Ceiling & light fixture cleaning",
        "HVAC vent cleaning",
        "Restroom deep clean",
        "Paint overspray removal",
        "Sticker & adhesive removal",
        "Cabinet & surface cleaning",
        "Final inspection & touch-ups",
      ]}
      industries={[
        "Commercial Offices",
        "Retail Build-Outs",
        "Restaurant Renovations",
        "Medical Facility Renovations",
        "Hotel Renovations",
        "Warehouse Conversions",
        "School Renovations",
        "Condo & Apartment Complexes",
      ]}
      benefits={[
        { icon: "🚀", title: "Move-In Ready", body: "We don't just clean — we prepare your space for opening day. Every surface, every corner, spotless and inspection-ready." },
        { icon: "⚡", title: "Fast Turnaround", body: "We understand construction timelines are tight. We mobilize quickly and work efficiently to meet your opening date." },
        { icon: "🏗️", title: "Construction Expertise", body: "We know what construction leaves behind — concrete dust, drywall particles, overspray — and exactly how to remove it." },
        { icon: "🧹", title: "Three-Phase Process", body: "Rough clean, final clean, and touch-up clean — each phase brings your space closer to move-in ready." },
        { icon: "📋", title: "Punch List Ready", body: "Our detailed cleaning process often identifies items for the contractor's punch list — saving you time before inspection." },
        { icon: "🛡️", title: "Licensed & Insured", body: "NV Contractor License #91170. Fully bonded and insured for commercial construction site work." },
      ]}
      process={[
        { step: "01", title: "Rough Clean", body: "Large debris removal, sweeping, and initial dust removal from all surfaces. Construction waste cleared out." },
        { step: "02", title: "Detail Clean", body: "Deep cleaning of all surfaces — windows, floors, fixtures, cabinets, restrooms — removing construction residue." },
        { step: "03", title: "Final Polish", body: "Final touchup cleaning, glass polishing, floor treatment, and fixture cleaning for a move-in ready result." },
        { step: "04", title: "Walkthrough", body: "Final walkthrough with you or your GC to ensure everything meets your standard before occupancy." },
      ]}
      faqs={[
        { q: "How soon after construction is complete can you start?", a: "We can typically start within 24-48 hours of your call. For larger projects, we schedule in advance to ensure we're ready when construction wraps." },
        { q: "What is included in post-construction cleanup vs. standard cleaning?", a: "Post-construction cleanup is far more intensive — it involves removing construction dust (which gets everywhere), paint overspray, adhesive residue, stickers, debris, and preparing floors and windows that have never been cleaned before." },
        { q: "How many phases of cleaning are there?", a: "Typically three: rough clean (debris and major dust), detail clean (all surfaces), and final clean/touch-up before occupancy. We can do one or all three depending on your needs." },
        { q: "Can you work with our general contractor directly?", a: "Absolutely. We frequently coordinate directly with GCs and project managers to fit our work into the construction schedule." },
        { q: "Do you handle large commercial renovation projects?", a: "Yes — from tenant improvements to full building renovations. Contact us with your square footage and project scope for an accurate estimate." },
      ]}
    />
  );
}
