"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Official Google "G" branded SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-label="Google">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const reviews = [
  { name: "Maria S.", company: "Property Manager, Summerlin Office Park",      rating: 5, text: "UBS has been cleaning our 3 office buildings for over 2 years. Their attention to detail is unmatched. The team is consistent, professional, and always goes above and beyond. Highly recommend to any property manager in Las Vegas.", initials: "MS" },
  { name: "James T.", company: "Operations Director, Henderson Medical Group",  rating: 5, text: "We needed a cleaning company that understood medical facility standards. UBS delivered from day one — thorough, discreet, and their electrostatic disinfection service is outstanding. Our staff and patients have noticed the difference.", initials: "JT" },
  { name: "Linda R.", company: "CEO, Vegas Valley Retail",                      rating: 5, text: "Switched to UBS after our previous cleaner kept missing things. Night and day difference. Our stores look incredible every morning, and the pressure washing they did on our parking areas was incredible. Worth every penny.", initials: "LR" },
  { name: "Robert M.", company: "Facility Manager, North Las Vegas Warehouse",  rating: 5, text: "These guys handle our 40,000 sq ft warehouse. Reliable, thorough, and their crew is always on time. Edwin and his team are the real deal — family business values with professional execution.", initials: "RM" },
  { name: "Sophia K.", company: "Owner, Boulder City Fitness Studio",           rating: 5, text: "For a fitness facility, cleanliness is critical. UBS understands that. They clean every night, handle all the equipment sanitization, and their floor care service keeps our gym looking brand new. Our members constantly compliment the cleanliness.", initials: "SK" },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setActive(i => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D0F1E 0%, #0a0c1a 100%)" }}>
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #3B4FC8 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#F5C518]" />
            <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518]">What Clients Say</span>
            <div className="w-8 h-px bg-[#F5C518]" />
          </div>
          <h2 className="font-display text-[clamp(40px,5vw,68px)] leading-[0.92] text-white tracking-wide mb-6">
            TRUSTED BY<br /><span className="text-[#F5C518]">LAS VEGAS BUSINESSES</span>
          </h2>

          {/* Google rating badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-sm"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <GoogleIcon />
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F5C518" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="font-cond font-bold text-white text-sm tracking-wider">5.0</span>
            <span className="text-white/40 text-xs">· Google Reviews</span>
          </div>
        </motion.div>

        {/* Main review card */}
        <div className="max-w-3xl mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="relative p-8 md:p-10 rounded-sm"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,197,24,0.15)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5C518]/40 to-transparent" />
              {/* Quote mark */}
              <div className="font-display text-8xl text-[#F5C518]/10 leading-none absolute top-4 left-8 select-none pointer-events-none">&ldquo;</div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(reviews[active].rating)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F5C518" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>

              <p className="text-white/80 text-lg font-light leading-relaxed mb-7 relative z-10">
                &ldquo;{reviews[active].text}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B4FC8] to-[#1A2470] flex items-center justify-center font-cond font-bold text-white text-sm flex-shrink-0">
                  {reviews[active].initials}
                </div>
                <div>
                  <div className="font-cond font-bold text-white text-sm tracking-wider">{reviews[active].name}</div>
                  <div className="text-white/40 text-xs font-light mt-0.5">{reviews[active].company}</div>
                </div>
                {/* Google verified badge */}
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <GoogleIcon />
                  <span className="font-cond text-[10px] tracking-widest uppercase text-white/50">Verified</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mb-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setAuto(false); }}
              className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] ${i === active ? "w-8 h-2 bg-[#F5C518]" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* Mini reviewer cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {reviews.map((r, i) => (
            <motion.button
              key={i}
              onClick={() => { setActive(i); setAuto(false); }}
              whileHover={{ scale: 1.02 }}
              className="p-4 text-left rounded-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]"
              style={{
                background: i === active ? "rgba(245,197,24,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === active ? "rgba(245,197,24,0.3)" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              <div className="font-cond font-bold text-white text-xs tracking-wider truncate">{r.name}</div>
              <div className="text-white/30 text-[10px] font-light mt-0.5 truncate">{r.company.split(",")[0]}</div>
              <div className="flex gap-0.5 mt-1.5">
                {[...Array(r.rating)].map((_, j) => (
                  <svg key={j} width="10" height="10" viewBox="0 0 24 24" fill="#F5C518" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
