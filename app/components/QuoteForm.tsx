"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IconDroplet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
  </svg>
);
const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <polygon points="12 2 22 8.5 12 15 2 8.5"/>
    <polyline points="2 15 12 21.5 22 15"/>
    <polyline points="2 11.5 12 18 22 11.5"/>
  </svg>
);
const IconWindow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="1"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);
const IconShieldCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconPainting = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M2 13.5V20a2 2 0 002 2h16a2 2 0 002-2v-6.5"/>
    <path d="M2 13.5L12 2l10 11.5"/>
    <path d="M12 2v20"/>
  </svg>
);
const IconDrywall = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <rect x="2" y="3" width="20" height="18" rx="1"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="7" y1="3" x2="7" y2="12"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <line x1="17" y1="3" x2="17" y2="12"/>
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconStepCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Service Options ───────────────────────────────────────────────────────────
type IconFC = () => React.JSX.Element;

const serviceOptions: { value: string; label: string; Icon: IconFC }[] = [
  { value: "commercial-janitorial", label: "Commercial Janitorial", Icon: IconBuilding },
  { value: "building-maintenance", label: "Building Maintenance", Icon: IconWrench },
  { value: "pressure-washing", label: "Pressure Washing", Icon: IconDroplet },
  { value: "carpet-floor", label: "Carpet & Floor Care", Icon: IconLayers },
  { value: "window-cleaning", label: "Window Cleaning", Icon: IconWindow },
  { value: "electrostatic", label: "Electrostatic Disinfection", Icon: IconShieldCheck },
  { value: "painting", label: "Commercial Painting", Icon: IconPainting },
  { value: "drywall", label: "Drywall Services", Icon: IconDrywall },
  { value: "multiple", label: "Multiple Services", Icon: IconClipboard },
];

// ── Steps ─────────────────────────────────────────────────────────────────────
type Field =
  | { key: string; label: string; type: "select"; options: string[] }
  | { key: string; label: string; type: "text" | "email" | "tel"; placeholder: string }
  | { key: string; label: string; type: "textarea"; placeholder: string };

const steps: { id: number; title: string; subtitle: string; fields: Field[] | null }[] = [
  { id: 1, title: "Service Needed", subtitle: "What can we help with?", fields: null },
  {
    id: 2, title: "About Your Facility", subtitle: "Help us understand your needs",
    fields: [
      { key: "buildingType", label: "Building Type", type: "select", options: ["Office Building", "Medical/Dental Office", "Retail Store", "Restaurant/Food Service", "Warehouse/Industrial", "School/Daycare", "Gym/Fitness Center", "Church/Place of Worship", "Government Building", "Other"] },
      { key: "sqFootage", label: "Approximate Square Footage", type: "select", options: ["Under 1,000 sq ft", "1,000 – 5,000 sq ft", "5,000 – 15,000 sq ft", "15,000 – 50,000 sq ft", "50,000+ sq ft"] },
      { key: "frequency", label: "Cleaning Frequency", type: "select", options: ["Daily", "3x per week", "Weekly", "Bi-weekly", "Monthly", "One-time", "Custom / TBD"] },
    ],
  },
  {
    id: 3, title: "Your Contact Info", subtitle: "How do we reach you?",
    fields: [
      { key: "firstName", label: "First Name", type: "text", placeholder: "John" },
      { key: "lastName", label: "Last Name", type: "text", placeholder: "Smith" },
      { key: "businessName", label: "Business Name", type: "text", placeholder: "Acme Corp" },
      { key: "email", label: "Email Address", type: "email", placeholder: "john@business.com" },
      { key: "phone", label: "Phone Number", type: "tel", placeholder: "(702) 000-0000" },
      { key: "notes", label: "Additional Notes", type: "textarea", placeholder: "Tell us anything else about your facility or cleaning needs..." },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleOption = (val: string) => {
    setData(d => ({ ...d, service: val }));
    setTimeout(() => setStep(1), 300);
  };

  const handleField = (key: string, val: string) => setData(d => ({ ...d, [key]: val }));

  const handleNext = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please call us directly at (702) 795-2855.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success State ────────────────────────────────────────────────────────
  if (submitted) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-8"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,197,24,0.2)" }}
    >
      <motion.div
        animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }}
        className="w-20 h-20 mx-auto mb-6 text-[#F5C518]"
      >
        <IconCheckCircle />
      </motion.div>
      <h3 className="font-display text-4xl text-white mb-3">QUOTE REQUEST SENT!</h3>
      <p className="text-white/60 font-light mb-2">We&apos;ve received your request and will contact you within 2 business hours.</p>
      <p className="text-[#F5C518] font-cond text-sm tracking-wider">Check your email for a confirmation from us.</p>
      <div className="mt-8 p-4" style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)" }}>
        <p className="text-white/50 text-sm mb-1">Need immediate assistance?</p>
        <a href="tel:7027952855" className="font-display text-2xl text-[#F5C518] hover:text-[#D4A800] transition-colors cursor-pointer">(702) 795-2855</a>
      </div>
    </motion.div>
  );

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 transition-colors duration-300 ${i <= step ? "text-[#F5C518]" : "text-white/30"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-cond transition-all duration-300
                ${i < step ? "bg-[#F5C518] text-[#0D0F1E]" : i === step ? "border-2 border-[#F5C518] text-[#F5C518]" : "border border-white/20 text-white/30"}`}>
                {i < step ? <IconStepCheck /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <span className="hidden sm:block font-cond text-xs tracking-widest uppercase">{s.title}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#3B4FC8] to-[#F5C518] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-display text-3xl text-white mb-1">{current.title}</h3>
          <p className="text-white/40 text-sm font-light mb-7">{current.subtitle}</p>

          {/* Step 1: Service selector */}
          {step === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {serviceOptions.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOption(opt.value)}
                  className="p-3 text-center transition-all duration-200 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]/70"
                  style={{
                    border: `1px solid ${data.service === opt.value ? "rgba(245,197,24,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background: data.service === opt.value ? "rgba(245,197,24,0.08)" : "rgba(255,255,255,0.02)",
                  }}
                  onMouseEnter={e => { if (data.service !== opt.value) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
                  onMouseLeave={e => { if (data.service !== opt.value) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <div className={`w-6 h-6 mx-auto mb-2 transition-colors duration-200 ${data.service === opt.value ? "text-[#F5C518]" : "text-white/50 group-hover:text-[#F5C518]"}`}>
                    <opt.Icon />
                  </div>
                  <div className="font-cond text-[10px] tracking-wider uppercase text-white/70 group-hover:text-white transition-colors leading-tight">{opt.label}</div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Steps 2-3: Fields */}
          {current.fields && (
            <div className="space-y-4">
              {current.fields.map((f) => (
                <div key={f.key}>
                  <label htmlFor={f.key} className="font-cond text-xs tracking-widest uppercase text-white/50 mb-1.5 block">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      id={f.key}
                      value={data[f.key] || ""}
                      onChange={e => handleField(f.key, e.target.value)}
                      className="w-full text-white text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/60 focus-visible:ring-2 focus-visible:ring-[#F5C518]/50 transition-colors cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <option value="" className="bg-[#0D0F1E]">Select...</option>
                      {"options" in f && f.options?.map(o => <option key={o} value={o} className="bg-[#0D0F1E]">{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      id={f.key}
                      rows={3}
                      value={data[f.key] || ""}
                      onChange={e => handleField(f.key, e.target.value)}
                      placeholder={"placeholder" in f ? f.placeholder : ""}
                      className="w-full text-white text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/60 transition-colors resize-none placeholder:text-white/20"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  ) : (
                    <input
                      id={f.key}
                      type={f.type}
                      value={data[f.key] || ""}
                      onChange={e => handleField(f.key, e.target.value)}
                      placeholder={"placeholder" in f ? f.placeholder : ""}
                      className="w-full text-white text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/60 transition-colors placeholder:text-white/20"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  )}
                </div>
              ))}

              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="font-cond font-semibold text-xs tracking-widest uppercase text-white/60 px-6 min-h-[44px] hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
                  >
                    ← Back
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 font-cond font-bold text-sm tracking-widest uppercase bg-[#3B4FC8] text-white min-h-[44px] flex items-center justify-center gap-2 hover:bg-[#2A3A9E] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4FC8]"
                  >
                    Continue <IconArrowRight />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] min-h-[44px] flex items-center justify-center gap-2 hover:bg-[#D4A800] transition-colors disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-[#0D0F1E]/30 border-t-[#0D0F1E] rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Quote Request
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
