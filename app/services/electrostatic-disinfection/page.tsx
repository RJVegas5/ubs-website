import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Electrostatic Disinfection Las Vegas | 360° Coverage | UBS",
  description: "Advanced electrostatic disinfection services in Las Vegas. 360° surface coverage, EPA-approved disinfectants. Medical offices, schools, gyms. Call (702) 795-2855.",
};

export default function ElectrostaticDisinfectionPage() {
  return (
    <ServicePageTemplate
      service="Electrostatic Disinfection"
      slug="electrostatic-disinfection"
      headline="360° ELECTROSTATIC"
      subheadline="DISINFECTION."
      description="Advanced disinfection technology that wraps charged particles around every surface — achieving 360° coverage impossible with traditional wiping. Superior pathogen elimination for high-touch and high-risk environments."
      icon="⚡"
      color="#F5C518"
      includes={[
        "360° surface coverage",
        "High-touch surface treatment",
        "EPA List N disinfectants",
        "Medical-grade protection",
        "Air quality treatment",
        "HVAC vent disinfection",
        "Restroom disinfection",
        "Kitchen & breakroom treatment",
        "Lobby & waiting room service",
        "Elevator & stairwell treatment",
        "Conference room disinfection",
        "Scheduled or one-time service",
      ]}
      industries={[
        "Medical & Dental Offices",
        "Schools & Daycares",
        "Gyms & Fitness Centers",
        "Restaurants & Food Service",
        "Hotels & Hospitality",
        "Government Buildings",
        "Corporate Offices",
        "Senior Care Facilities",
      ]}
      benefits={[
        { icon: "⚡", title: "360° Coverage", body: "Electrostatically charged particles wrap around objects — reaching the back, sides, and undersurfaces that spray bottles and wipes miss entirely." },
        { icon: "🦠", title: "Kills 99.9%+ of Pathogens", body: "EPA-approved, hospital-grade disinfectants effective against bacteria, viruses, and fungi on contact." },
        { icon: "🚀", title: "10x Faster", body: "Electrostatic sprayers cover surfaces 10x faster than traditional methods — minimizing disruption to your operations." },
        { icon: "🌿", title: "Safe for Occupants", body: "Solutions dry quickly and are safe for re-entry typically within 10-15 minutes after application." },
        { icon: "📋", title: "Documentation Provided", body: "Certificate of treatment provided after every service session for your records and compliance needs." },
        { icon: "🔄", title: "Flexible Scheduling", body: "One-time decontamination or ongoing scheduled service — daily, weekly, or monthly rotations." },
      ]}
      process={[
        { step: "01", title: "Facility Assessment", body: "We evaluate your space, identify high-touch and high-risk areas, and select the appropriate disinfectant for your environment." },
        { step: "02", title: "Pre-Clean", body: "Surfaces are pre-cleaned to remove organic matter that would reduce disinfectant effectiveness." },
        { step: "03", title: "Electrostatic Application", body: "Charged disinfectant particles are applied, wrapping around all surfaces for complete 360° coverage." },
        { step: "04", title: "Certify & Document", body: "Dwell time is observed, effectiveness is confirmed, and a certificate of treatment is issued." },
      ]}
      faqs={[
        { q: "How is electrostatic disinfection different from regular spraying?", a: "Electrostatic sprayers give the disinfectant droplets a positive electric charge. Since most surfaces are neutral or negatively charged, the particles are attracted to surfaces and wrap around them — including the backs and undersides that normal spraying misses." },
        { q: "Which pathogens does it kill?", a: "Our EPA List N disinfectants are effective against bacteria, viruses (including SARS-CoV-2), fungi, and mold. We'll share the specific efficacy data for the product used in your facility." },
        { q: "How soon can the area be occupied after treatment?", a: "Most areas can be re-entered within 10-15 minutes after application. We'll give you specific re-entry times based on the disinfectant used." },
        { q: "Do you provide a certificate of service?", a: "Yes — every electrostatic disinfection service includes a dated certificate of treatment for your records, insurance, and compliance purposes." },
        { q: "Do you offer emergency decontamination service?", a: "Yes. If you have a confirmed illness exposure or outbreak situation, call us at (702) 795-2855 for priority response." },
      ]}
    />
  );
}
