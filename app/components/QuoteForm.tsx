"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: 1, title: "Service Needed", subtitle: "What can we help with?",
    fields: null,
    options: [
      { value: "commercial-janitorial", label: "Commercial Janitorial", icon: "🏢" },
      { value: "building-maintenance", label: "Building Maintenance", icon: "🔧" },
      { value: "pressure-washing", label: "Pressure Washing", icon: "💧" },
      { value: "carpet-floor", label: "Carpet & Floor Care", icon: "✨" },
      { value: "window-cleaning", label: "Window Cleaning", icon: "🪟" },
      { value: "electrostatic", label: "Electrostatic Disinfection", icon: "⚡" },
      { value: "painting", label: "Commercial Painting", icon: "🎨" },
      { value: "drywall", label: "Drywall Services", icon: "🧱" },
      { value: "multiple", label: "Multiple Services", icon: "📋" },
    ],
  },
  {
    id: 2, title: "About Your Facility", subtitle: "Help us understand your needs",
    options: null,
    fields: [
      { key: "buildingType", label: "Building Type", type: "select", options: ["Office Building", "Medical/Dental Office", "Retail Store", "Restaurant/Food Service", "Warehouse/Industrial", "School/Daycare", "Gym/Fitness Center", "Church/Place of Worship", "Government Building", "Other"] },
      { key: "sqFootage", label: "Approximate Square Footage", type: "select", options: ["Under 1,000 sq ft", "1,000 – 5,000 sq ft", "5,000 – 15,000 sq ft", "15,000 – 50,000 sq ft", "50,000+ sq ft"] },
      { key: "frequency", label: "Cleaning Frequency", type: "select", options: ["Daily", "3x per week", "Weekly", "Bi-weekly", "Monthly", "One-time", "Custom / TBD"] },
    ],
  },
  {
    id: 3, title: "Your Contact Info", subtitle: "How do we reach you?",
    options: null,
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

  if (submitted) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-8"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,197,24,0.2)" }}>
      <motion.div animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-6xl mb-6">✅</motion.div>
      <h3 className="font-display text-4xl text-white mb-3">QUOTE REQUEST SENT!</h3>
      <p className="text-white/60 font-light mb-2">We&apos;ve received your request and will contact you within 2 business hours.</p>
      <p className="text-[#F5C518] font-cond text-sm tracking-wider">Check your email for a confirmation from us.</p>
      <div className="mt-8 p-4 rounded-sm" style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)" }}>
        <p className="text-white/50 text-sm">Need immediate assistance?</p>
        <a href="tel:7027952855" className="font-display text-2xl text-[#F5C518]">(702) 795-2855</a>
      </div>
    </motion.div>
  );

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 ${i <= step ? "text-[#F5C518]" : "text-white/30"} transition-colors duration-300`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-cond transition-all duration-300 ${i < step ? "bg-[#F5C518] text-[#0D0F1E]" : i === step ? "border-2 border-[#F5C518] text-[#F5C518]" : "border border-white/20 text-white/30"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="hidden sm:block font-cond text-xs tracking-widest uppercase">{s.title}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-[#3B4FC8] to-[#F5C518] rounded-full"
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

          <h3 className="font-display text-3xl text-white mb-1">{current.title}</h3>
          <p className="text-white/40 text-sm font-light mb-7">{current.subtitle}</p>

          {/* Step 1: Service selector */}
          {current.options && (
            <div className="grid grid-cols-3 gap-2">
              {current.options.map((opt) => (
                <motion.button key={opt.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleOption(opt.value)}
                  className={`p-3 text-center rounded-sm transition-all duration-200 group ${data.service === opt.value ? "border-[#F5C518]/60 bg-[#F5C518]/10" : "border-white/10 hover:border-white/25"}`}
                  style={{ border: `1px solid ${data.service === opt.value ? "rgba(245,197,24,0.5)" : "rgba(255,255,255,0.08)"}`, background: data.service === opt.value ? "rgba(245,197,24,0.08)" : "rgba(255,255,255,0.02)" }}>
                  <div className="text-2xl mb-1">{opt.icon}</div>
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
                  <label className="font-cond text-xs tracking-widest uppercase text-white/50 mb-1.5 block">{f.label}</label>
                  {f.type === "select" ? (
                    <select value={data[f.key] || ""} onChange={e => handleField(f.key, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/50 transition-colors rounded-sm">
                      <option value="" className="bg-[#0D0F1E]">Select...</option>
                      {'options' in f && f.options?.map(o => <option key={o} value={o} className="bg-[#0D0F1E]">{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea rows={3} value={data[f.key] || ""} onChange={e => handleField(f.key, e.target.value)}
                      placeholder={'placeholder' in f ? f.placeholder : ''} className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/50 transition-colors resize-none placeholder:text-white/20 rounded-sm" />
                  ) : (
                    <input type={f.type} value={data[f.key] || ""} onChange={e => handleField(f.key, e.target.value)}
                      placeholder={'placeholder' in f ? f.placeholder : ''} className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/50 transition-colors placeholder:text-white/20 rounded-sm" />
                  )}
                </div>
              ))}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="font-cond font-semibold text-xs tracking-widest uppercase border border-white/20 text-white/60 px-6 py-3 hover:border-white/40 hover:text-white transition-all rounded-sm">
                    ← Back
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button onClick={handleNext}
                    className="flex-1 font-cond font-bold text-sm tracking-widest uppercase bg-[#3B4FC8] text-white py-3 hover:bg-[#2A3A9E] transition-colors rounded-sm">
                    Continue →
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] py-3 hover:bg-[#D4A800] transition-colors disabled:opacity-60 rounded-sm flex items-center justify-center gap-2">
                    {submitting ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-[#0D0F1E]/30 border-t-[#0D0F1E] rounded-full" /> Sending...</>
                    ) : "Send Quote Request ✓"}
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
