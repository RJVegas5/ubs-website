import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageHero from "../components/PageHero";
import Footer from "../components/Footer";
import Areas from "../components/Areas";
import QuoteForm from "../components/QuoteForm";

export const metadata: Metadata = {
  title: "Get a Free Quote | Ultimate Building Services Las Vegas",
  description: "Request a free commercial cleaning quote. We respond within 2 hours. Serving Las Vegas, Henderson, Summerlin, North Las Vegas & Boulder City. Call (702) 795-2855.",
};

export default function ContactPage() {
  return (
    <main>
      <Nav />
      <PageHero
        tag="Free Quote · 2-Hour Response"
        title="LET'S BUILD YOUR"
        highlight="CLEANING ROUTINE."
        sub="Tell us about your facility and we'll build a custom plan. We respond within 2 business hours — guaranteed."
      />

      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D0F1E 0%, #070915 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #3B4FC8 0, #3B4FC8 1px, transparent 0, transparent 50%)`,
          backgroundSize: "24px 24px",
        }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-0 items-start">
            {/* Left: Quote form */}
            <div className="p-8 md:p-12 relative" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,197,24,0.15)", borderRight: "none" }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#F5C518]/60 to-transparent" />
              <QuoteForm />
            </div>

            {/* Right: Contact info */}
            <div className="p-8 md:p-12" style={{ background: "rgba(59,79,200,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,79,200,0.2)" }}>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-[#F5C518]" />
                  <span className="font-cond text-xs tracking-[0.25em] uppercase text-[#F5C518]">Direct Contact</span>
                </div>
                <h3 className="font-display text-4xl text-white mb-2">GET IN TOUCH</h3>
                <p className="text-white/50 font-light text-sm leading-relaxed">Prefer to talk directly? We&apos;re available Monday through Saturday, 6am to 10pm.</p>
              </div>

              <div className="space-y-6 mb-10">
                {[
                  { icon: "📞", label: "Phone", value: "(702) 795-2855", href: "tel:7027952855", highlight: true },
                  { icon: "✉️", label: "Email", value: "ultimate@prosharedservices.com", href: "mailto:ultimate@prosharedservices.com", highlight: false },
                  { icon: "📍", label: "Address", value: "2645 Sorrel St., Las Vegas, NV 89146", href: null, highlight: false },
                  { icon: "🕐", label: "Hours", value: "Mon–Sat: 6am – 10pm\nAfter-hours by arrangement", href: null, highlight: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-cond text-xs tracking-widest uppercase text-white/30 mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className={`font-display text-2xl transition-colors ${item.highlight ? "text-[#F5C518] hover:text-[#D4A800]" : "text-white/70 hover:text-white"}`}>{item.value}</a>
                      ) : (
                        <div className="text-white/60 text-sm font-light whitespace-pre-line">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="space-y-3 mb-10">
                <div className="font-cond text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-4">Our Guarantees</div>
                {[
                  "⏱️ 2-hour response during business hours",
                  "✅ 100% satisfaction or we come back free",
                  "🛡️ Fully licensed & insured (NV Lic #91170)",
                  "👥 Same dedicated team every visit",
                  "📋 Custom cleaning plan for your facility",
                ].map((g) => (
                  <div key={g} className="flex items-center gap-3 text-white/60 text-sm font-light">{g}</div>
                ))}
              </div>

              {/* Certifications */}
              <div style={{ background: "rgba(245,197,24,0.05)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: "2px" }} className="p-4">
                <div className="font-cond text-xs tracking-widest uppercase text-[#F5C518] mb-3">Licensed & Certified</div>
                <div className="flex flex-wrap gap-3">
                  {["NV Lic #91170", "Bid Limit: $45,000", "Fully Insured", "Background Checked"].map((c) => (
                    <span key={c} className="font-cond text-xs tracking-wider uppercase text-white/50 px-3 py-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Areas />
      <Footer />
    </main>
  );
}
