import type { Metadata } from "next";
import ServicePageTemplate from "../../components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Commercial Carpet Cleaning Las Vegas | Hot Water Extraction | UBS",
  description: "Professional commercial carpet cleaning in Las Vegas. Hot water extraction, stain treatment, deodorizing. Hotels, offices, medical. Licensed & insured. (702) 795-2855.",
};

export default function CarpetCleaningPage() {
  return (
    <ServicePageTemplate
      service="Carpet Cleaning"
      slug="carpet-cleaning"
      headline="DEEP CLEAN"
      subheadline="CARPET CLEANING."
      description="Commercial hot water extraction carpet cleaning that eliminates allergens, bacteria, and deep-set stains. We extend the life of your carpet investment and keep your facility fresh and professional."
      icon="🧹"
      color="#3B4FC8"
      includes={[
        "Hot water extraction cleaning",
        "Pre-treatment & pre-spray",
        "Stain treatment & removal",
        "Pet odor treatment",
        "Deodorizing & sanitizing",
        "Carpet grooming & raking",
        "Traffic lane restoration",
        "Upholstery cleaning",
        "Area rug cleaning",
        "Staircase carpet cleaning",
        "Color restoration treatment",
        "Scotchgard protector (optional)",
      ]}
      industries={[
        "Corporate Offices",
        "Hotels & Hospitality",
        "Medical & Dental Offices",
        "Schools & Universities",
        "Property Management",
        "Gyms & Fitness Centers",
        "Churches",
        "Retail Stores",
      ]}
      benefits={[
        { icon: "🫁", title: "Healthier Air Quality", body: "Deep extraction removes allergens, dust mites, and bacteria that standard vacuuming cannot reach — critical for medical and high-occupancy spaces." },
        { icon: "💰", title: "Extends Carpet Life", body: "Regular professional cleaning dramatically extends carpet lifespan, saving you thousands in early replacement costs." },
        { icon: "✨", title: "Professional Appearance", body: "Clean carpets project professionalism to clients and instill pride in employees. The difference is immediately visible." },
        { icon: "⚡", title: "Fast Dry Times", body: "Our extraction methods minimize residual moisture, with most areas dry within 2-4 hours." },
        { icon: "🛡️", title: "Commercial Equipment", body: "Truck-mounted and portable extraction equipment powerful enough for any commercial carpet type." },
        { icon: "🌿", title: "Safe Products", body: "EPA-approved, low-residue cleaning solutions that are safe for employees, customers, and the environment." },
      ]}
      process={[
        { step: "01", title: "Inspection", body: "We inspect carpet fiber type, soiling level, stains, and high-traffic areas to select the right treatment approach." },
        { step: "02", title: "Pre-Treatment", body: "Pre-spray applied to traffic lanes and stains, agitated to break up soil before extraction begins." },
        { step: "03", title: "Hot Water Extraction", body: "High-temperature water injection and immediate extraction removes deep-set soil, bacteria, and allergens." },
        { step: "04", title: "Dry & Protect", body: "Speed-drying with air movers, optional protector application, and final grooming leave carpets looking new." },
      ]}
      faqs={[
        { q: "How often should commercial carpets be professionally cleaned?", a: "High-traffic commercial carpets typically need professional cleaning every 3-6 months. Lower-traffic areas may only need it once or twice a year." },
        { q: "How long will the carpets take to dry?", a: "Most commercial carpets are dry within 2-4 hours with proper ventilation. We use air movers to accelerate drying." },
        { q: "Can you remove all stains?", a: "We can remove most commercial stains. Some older, set stains may be lightened but not fully removed — we'll give you an honest assessment upfront." },
        { q: "Do you work after hours to avoid disruption?", a: "Yes — we frequently clean carpets in the evenings or on weekends so your team isn't disrupted and carpets are dry by morning." },
        { q: "What's the difference between hot water extraction and steam cleaning?", a: "Hot water extraction uses hot water (not steam) injected into the carpet fibers under pressure, then immediately extracted with the soil. It's the most effective method for commercial carpets." },
      ]}
    />
  );
}
