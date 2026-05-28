"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    num: "01", name: "Commercial Janitorial Services", category: "Cleaning",
    desc: "Complete office and facility cleaning tailored to your schedule. We cover restrooms, common areas, floors, surfaces, breakrooms, and every corner — with zero disruption to your operations.",
    details: ["Daily, weekly, or custom schedules", "Restrooms & common areas", "Breakroom & kitchen cleaning", "Trash removal & recycling", "Floor mopping & vacuuming", "Surface sanitization"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  },
  {
    num: "02", name: "Building Maintenance", category: "Maintenance",
    desc: "Comprehensive interior and exterior upkeep. From minor repairs to full facility management — keeping your property at peak performance year-round so you never have to worry.",
    details: ["Interior & exterior upkeep", "Minor plumbing & electrical", "Door & hardware repairs", "Lighting maintenance", "HVAC filter changes", "General handyman work"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>),
  },
  {
    num: "03", name: "Drywall Services", category: "Construction",
    desc: "Installation, repair, and flawless finishing for commercial interiors of any scale. Licensed NV contractor delivering quality drywall work that looks as good as new — or better.",
    details: ["New drywall installation", "Crack & hole repairs", "Texture matching", "Finishing & sanding", "Water damage repair", "Commercial & tenant improvements"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>),
  },
  {
    num: "04", name: "Commercial Painting", category: "Construction",
    desc: "Interior and exterior painting with professional prep, premium materials, and a lasting finish that elevates your workspace. Clean lines, zero mess, on-time every time.",
    details: ["Interior & exterior painting", "Surface prep & priming", "Accent walls & feature areas", "Epoxy floor coatings", "Touch-up & maintenance painting", "Color consultation"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M2 20h.01M7 20v-4"/><path d="M12 20V10"/><path d="M17 20V4"/></svg>),
  },
  {
    num: "05", name: "Pressure Washing", category: "Exterior",
    desc: "High-powered exterior cleaning for concrete, building facades, parking lots, dumpster areas, and entryways. First impressions start before clients even walk in the door.",
    details: ["Building exterior washing", "Concrete & sidewalk cleaning", "Parking lot washing", "Dumpster pad cleaning", "Graffiti removal", "Drive-through cleaning"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>),
  },
  {
    num: "06", name: "Window Cleaning", category: "Cleaning",
    desc: "Streak-free interior and exterior window cleaning for offices, retail, and commercial buildings. Crystal clear glass every time — because dirty windows undermine even the cleanest interiors.",
    details: ["Interior window cleaning", "Exterior window cleaning", "Storefront glass", "High-rise window cleaning", "Screen cleaning", "Frame & sill wiping"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>),
  },
  {
    num: "07", name: "Carpet, Floor & Upholstery Cleaning", category: "Cleaning",
    desc: "Deep extraction carpet cleaning, hard floor polishing and stripping, and upholstery care. Restoring appearance, eliminating allergens, and extending the life of your flooring investment.",
    details: ["Hot water extraction carpet cleaning", "Hard floor stripping & waxing", "VCT floor care", "Tile & grout cleaning", "Upholstery cleaning", "Stain treatment & removal"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect x="2" y="8" width="20" height="12" rx="2"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>),
  },
  {
    num: "08", name: "Electrostatic Disinfection", category: "Specialty",
    desc: "Advanced disinfection technology that wraps charged particles around every surface — achieving 360° coverage impossible with traditional wiping. Superior pathogen elimination for high-touch environments.",
    details: ["360° surface coverage", "EPA-approved disinfectants", "Medical-grade protection", "Schools & daycares", "Offices & break rooms", "Gyms & fitness centers"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  },
  {
    num: "09", name: "Exterior Maintenance", category: "Exterior",
    desc: "Grounds upkeep, parking lot maintenance, exterior surface care, and more — keeping the outside of your property as sharp as the inside. Curb appeal matters every single day.",
    details: ["Parking lot sweeping", "Grounds & landscape upkeep", "Exterior lighting checks", "Trash & debris removal", "Signage cleaning", "General exterior repairs"],
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
  },
];

const categories = ["All", "Cleaning", "Maintenance", "Construction", "Exterior", "Specialty"];

export default function ServicesContent() {
  return (
    <section className="py-20 bg-[#0D0F1E]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 mb-16">
          {services.map((svc, i) => (
            <motion.div key={svc.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group bg-[#0D0F1E] p-8 relative overflow-hidden hover:bg-[#151729] transition-colors duration-300">
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F5C518] group-hover:w-full transition-all duration-500" />
              <div className="absolute top-4 right-4 font-display text-[80px] leading-none text-white/[0.025] select-none">{svc.num}</div>
              <div className="inline-block bg-[#3B4FC8]/20 border border-[#3B4FC8]/30 px-2 py-0.5 mb-4">
                <span className="font-cond text-[10px] tracking-widest uppercase text-[#3B4FC8]">{svc.category}</span>
              </div>
              <div className="w-12 h-12 bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center text-[#F5C518] mb-5">{svc.icon}</div>
              <h3 className="font-cond font-bold text-lg tracking-wider uppercase text-white mb-3">{svc.name}</h3>
              <p className="text-white/45 text-sm font-light leading-relaxed mb-5">{svc.desc}</p>
              <ul className="space-y-1.5 mb-6">
                {svc.details.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-white/35 text-xs font-light">
                    <div className="w-1 h-1 rounded-full bg-[#F5C518]/60 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-2 font-cond font-semibold text-xs tracking-widest uppercase text-[#F5C518] hover:gap-3 transition-all duration-200">
                Get a Quote
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-[#151729] border border-[#3B4FC8]/30 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#F5C518]" />
          <h3 className="font-display text-4xl text-white mb-3">NEED MULTIPLE SERVICES?</h3>
          <p className="text-white/50 font-light mb-8 max-w-lg mx-auto">Most clients use us for 3+ services. We bundle them together for a custom quote that works for your budget and schedule.</p>
          <Link href="/contact" className="inline-block font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-10 py-4 hover:bg-[#D4A800] transition-colors">
            Request a Custom Quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
