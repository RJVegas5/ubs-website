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

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.72 6.72l1.76-1.76a2 2 0 012.11-.45c.9.36 1.85.6 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconTimer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

// ── Contact Items ─────────────────────────────────────────────────────────────
type IconFC = () => React.JSX.Element;

const contactItems: { Icon: IconFC; label: string; value: string; href: string | null; highlight: boolean }[] = [
  { Icon: IconPhone, label: "Phone", value: "(702) 795-2855", href: "tel:7027952855", highlight: true },
  { Icon: IconMail, label: "Email", value: "ultimate@prosharedservices.com", href: "mailto:ultimate@prosharedservices.com", highlight: false },
  { Icon: IconMapPin, label: "Address", value: "2645 Sorrel St., Las Vegas, NV 89146", href: null, highlight: false },
  { Icon: IconClock, label: "Hours", value: "Mon–Sat: 6am – 10pm\nAfter-hours by arrangement", href: null, highlight: false },
];

const guarantees: { Icon: IconFC; text: string }[] = [
  { Icon: IconTimer, text: "2-hour response during business hours" },
  { Icon: IconCheckCircle, text: "100% satisfaction or we come back free" },
  { Icon: IconShield, text: "Fully licensed & insured (NV Lic #91170)" },
  { Icon: IconUsers, text: "Same dedicated team every visit" },
  { Icon: IconClipboard, text: "Custom cleaning plan for your facility" },
];

export default function ContactPage() {
  return (
    <main>
      <Nav />
      <PageHero
        tag="Free Quote · 2-Hour Response"
        title="LET'S BUILD YOUR"
        highlight="CLEANING ROUTINE."
        sub="Tell us about your facility and we'll build a custom plan. We respond within 2 business hours — guaranteed."
        hideCta
      />

      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D0F1E 0%, #070915 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #3B4FC8 0, #3B4FC8 1px, transparent 0, transparent 50%)`,
          backgroundSize: "24px 24px",
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-0 items-start">

            {/* Left: Quote form */}
            <div className="p-6 sm:p-8 md:p-12 relative"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,197,24,0.15)", borderRight: "none" }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#F5C518]/60 to-transparent" />
              <QuoteForm />
            </div>

            {/* Right: Contact info */}
            <div className="p-6 sm:p-8 md:p-12"
              style={{ background: "rgba(59,79,200,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,79,200,0.2)" }}>

              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-[#F5C518]" />
                  <span className="font-cond text-xs tracking-[0.25em] uppercase text-[#F5C518]">Direct Contact</span>
                </div>
                <h3 className="font-display text-4xl text-white mb-2">GET IN TOUCH</h3>
                <p className="text-white/50 font-light text-sm leading-relaxed">
                  Prefer to talk directly? We&apos;re available Monday through Saturday, 6am to 10pm.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-6 mb-10">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-[#F5C518]"
                      style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)" }}>
                      <div className="w-5 h-5">
                        <item.Icon />
                      </div>
                    </div>
                    <div>
                      <div className="font-cond text-xs tracking-widest uppercase text-white/30 mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`font-display text-2xl transition-colors cursor-pointer ${item.highlight ? "text-[#F5C518] hover:text-[#D4A800]" : "text-white/70 hover:text-white"}`}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-white/60 text-sm font-light whitespace-pre-line leading-relaxed">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="space-y-3 mb-10">
                <div className="font-cond text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-4">Our Guarantees</div>
                {guarantees.map((g) => (
                  <div key={g.text} className="flex items-center gap-3 text-white/60 text-sm font-light">
                    <div className="text-[#F5C518]">
                      <g.Icon />
                    </div>
                    {g.text}
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div
                style={{ background: "rgba(245,197,24,0.05)", border: "1px solid rgba(245,197,24,0.15)" }}
                className="p-4"
              >
                <div className="font-cond text-xs tracking-widest uppercase text-[#F5C518] mb-3">Licensed & Certified</div>
                <div className="flex flex-wrap gap-3">
                  {["NV Lic #91170", "Bid Limit: $45,000", "Fully Insured", "Background Checked"].map((c) => (
                    <span
                      key={c}
                      className="font-cond text-xs tracking-wider uppercase text-white/50 px-3 py-1"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {c}
                    </span>
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
