import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Commercial Floor Care Las Vegas | Stripping, Waxing & Polishing | UBS",
  description: "Professional commercial floor care in Las Vegas. VCT stripping & waxing, hard floor polishing, tile & grout cleaning. Licensed & insured. Call (702) 795-2855.",
};

export default function FloorCarePage() {
  return (
    <ServicePageTemplate
      service="Floor Care"
      slug="floor-care"
      headline="COMMERCIAL"
      subheadline="FLOOR CARE."
      description="Hard floor stripping, waxing, polishing, and restoration. We extend the life of your flooring investment and keep your facility looking sharp — every single day."
      icon="✨"
      color="#3B4FC8"
      includes={[
        "VCT floor stripping & waxing",
        "Hard floor polishing",
        "Burnishing & buffing",
        "Tile & grout deep cleaning",
        "Grout sealing",
        "Floor restoration",
        "Concrete floor cleaning",
        "Epoxy floor maintenance",
        "Anti-slip treatment",
        "Floor finish application",
        "Scrubbing & auto-scrubber service",
        "Floor finish removal",
      ]}
      industries={[
        "Healthcare Facilities",
        "Schools & Universities",
        "Retail Stores",
        "Warehouses",
        "Government Buildings",
        "Gyms & Fitness Centers",
        "Restaurants",
        "Office Buildings",
      ]}
      benefits={[
        { icon: "💎", title: "Showroom Finish", body: "Our floor care process delivers a high-gloss, mirror finish that elevates the appearance of your entire facility." },
        { icon: "💰", title: "Protects Your Investment", body: "Regular floor maintenance dramatically extends the life of expensive flooring — saving you thousands in replacement costs." },
        { icon: "⚡", title: "Commercial Equipment", body: "Industrial auto-scrubbers, high-speed burnishers, and professional-grade floor care products." },
        { icon: "🛡️", title: "Slip Resistance", body: "Proper floor finish application maintains appropriate slip resistance — reducing liability and keeping people safe." },
        { icon: "📅", title: "Scheduled Maintenance", body: "We set up a floor care rotation so your floors always look maintained without emergency deep cleans." },
        { icon: "✅", title: "Results Guaranteed", body: "Before and after photos for every floor care job. Not satisfied? We'll redo it at no charge." },
      ]}
      process={[
        { step: "01", title: "Floor Assessment", body: "We evaluate floor type, current condition, and finish layers to determine the right treatment plan." },
        { step: "02", title: "Strip & Prepare", body: "Old finish is stripped down to bare floor, ensuring the new application bonds properly." },
        { step: "03", title: "Clean & Apply", body: "Deep scrub, rinse, and multiple coats of commercial-grade floor finish applied and dried between coats." },
        { step: "04", title: "Buff & Polish", body: "High-speed burnishing delivers the final high-gloss finish. Results are immediate and impressive." },
      ]}
      faqs={[
        { q: "How often should VCT floors be stripped and waxed?", a: "Most commercial VCT floors benefit from a full strip and wax 1-2 times per year, with scrub and recoat every 3-4 months, and regular buffing/burnishing in between." },
        { q: "How long does floor care take?", a: "It depends on square footage and condition. A typical 5,000 sq ft space takes 4-8 hours for a full strip and wax. We work after hours to minimize disruption." },
        { q: "Do you work on other floor types besides VCT?", a: "Yes — we service VCT, tile, concrete, hardwood, laminate, and epoxy floors. Each requires different products and techniques." },
        { q: "How long until we can walk on the floors?", a: "Typically 30-60 minutes after the final coat dries, though we recommend 2 hours before heavy traffic." },
        { q: "Can you match the existing shine level?", a: "Absolutely. We can adjust finish coats to achieve high-gloss, semi-gloss, or matte finishes as needed." },
      ]}
    />
  );
}
