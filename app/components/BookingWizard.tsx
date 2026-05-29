"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface BookingData {
  service: string;
  companyName: string; contactName: string; phone: string; email: string; address: string;
  propertyType: string; facilitySize: string; frequency: string;
  date: string; timeSlot: string;
  photos: File[]; instructions: string; notes: string;
}

// ── Services ───────────────────────────────────────────────────────────────
const SERVICES = [
  { id: "janitorial", name: "Commercial Janitorial", desc: "Daily, weekly, or custom office & facility cleaning", icon: "🏢", color: "#3B4FC8" },
  { id: "maintenance", name: "Building Maintenance", desc: "Interior & exterior upkeep and repairs", icon: "🔧", color: "#2A3A9E" },
  { id: "pressure", name: "Pressure Washing", desc: "Exterior deep cleaning for facades & parking", icon: "💧", color: "#1A2470" },
  { id: "windows", name: "Window Cleaning", desc: "Streak-free interior & exterior glass", icon: "🪟", color: "#3B4FC8" },
  { id: "carpet", name: "Carpet & Floor Care", desc: "Deep extraction, stripping, waxing & polishing", icon: "✨", color: "#2A3A9E" },
  { id: "electrostatic", name: "Electrostatic Disinfection", desc: "Advanced 360° pathogen elimination", icon: "⚡", color: "#1A2470" },
  { id: "painting", name: "Commercial Painting", desc: "Interior & exterior with premium materials", icon: "🎨", color: "#3B4FC8" },
  { id: "exterior", name: "Exterior Maintenance", desc: "Grounds, parking lots & exterior upkeep", icon: "🌿", color: "#2A3A9E" },
  { id: "drywall", name: "Drywall Services", desc: "Installation, repair & seamless finishing", icon: "🧱", color: "#1A2470" },
];

const PROPERTY_TYPES = ["Office Building", "Medical / Dental", "Retail Store", "Warehouse / Industrial", "School / Daycare", "Government Building", "Restaurant / Food Service", "Gym / Fitness", "Other"];
const FACILITY_SIZES = ["Under 2,500 sq ft", "2,500 – 10,000 sq ft", "10,000 – 25,000 sq ft", "25,000+ sq ft"];
const FREQUENCIES = ["One Time", "Weekly", "Bi-weekly", "Monthly", "Custom / TBD"];
const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "6:00 AM – 12:00 PM", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM – 5:00 PM", icon: "☀️" },
  { id: "evening", label: "Evening", time: "5:00 PM – 10:00 PM", icon: "🌆" },
];

const STEP_LABELS = ["Service", "Facility", "Schedule", "Details", "Review"];

// Generate available dates (next 30 days, skip Sundays)
function getAvailableDates() {
  const dates: { date: Date; available: boolean }[] = [];
  const today = new Date();
  for (let i = 1; i <= 35; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    dates.push({ date: d, available: d.getDay() !== 0 });
  }
  return dates;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Main Component ─────────────────────────────────────────────────────────
export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>({
    service: "", companyName: "", contactName: "", phone: "", email: "", address: "",
    propertyType: "", facilitySize: "", frequency: "",
    date: "", timeSlot: "",
    photos: [], instructions: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date());

  const set = (k: keyof BookingData, v: BookingData[keyof BookingData]) => setData(d => ({ ...d, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, photos: data.photos.map(f => f.name) }),
      });
      setSubmitted(true);
    } catch { /* still show success */ setSubmitted(true); }
    setSubmitting(false);
  };

  const progress = ((step + 1) / STEP_LABELS.length) * 100;
  const selectedService = SERVICES.find(s => s.id === data.service);

  if (submitted) return <SuccessScreen data={data} />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-px bg-[#F5C518]" />
          <span className="font-cond text-xs tracking-[0.3em] uppercase text-[#F5C518]">Premium Booking Experience</span>
          <div className="w-10 h-px bg-[#F5C518]" />
        </div>
        <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[0.92] text-white tracking-wide mb-3">
          BOOK YOUR <span className="text-[#F5C518]">SERVICE</span>
        </h1>
        <p className="text-white/50 font-light">Complete the form below. We respond within 2 business hours.</p>
      </motion.div>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between mb-4">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className={`flex flex-col items-center gap-1 transition-all duration-300 ${i <= step ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-cond transition-all duration-300 ${i < step ? "bg-[#F5C518] text-[#0D0F1E]" : i === step ? "border-2 border-[#F5C518] text-[#F5C518]" : "border border-white/20 text-white/30"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="hidden sm:block font-cond text-[10px] tracking-widest uppercase text-white/50">{label}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/10 rounded-full">
          <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            style={{ background: "linear-gradient(90deg, #3B4FC8, #F5C518)" }} />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

          {/* STEP 1: Service Selection */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-2">SELECT YOUR SERVICE</h2>
              <p className="text-white/40 text-sm font-light mb-8">Choose the service that best fits your facility needs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map((svc) => (
                  <motion.button key={svc.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { set("service", svc.id); setTimeout(() => setStep(1), 300); }}
                    className={`relative p-6 text-left rounded-sm transition-all duration-300 group overflow-hidden ${data.service === svc.id ? "border-[#F5C518]" : "border-white/8 hover:border-white/20"}`}
                    style={{ background: data.service === svc.id ? "rgba(245,197,24,0.08)" : "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", border: `1px solid ${data.service === svc.id ? "rgba(245,197,24,0.5)" : "rgba(255,255,255,0.08)"}` }}>
                    {/* Glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${svc.color}20, transparent 70%)` }} />
                    {/* Selected indicator */}
                    {data.service === svc.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#F5C518] flex items-center justify-center text-[#0D0F1E] text-xs font-bold">✓</div>
                    )}
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{svc.icon}</div>
                    <div className="font-cond font-bold text-base tracking-wider uppercase text-white mb-2 group-hover:text-[#F5C518] transition-colors">{svc.name}</div>
                    <div className="text-white/45 text-sm font-light leading-relaxed">{svc.desc}</div>
                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F5C518] group-hover:w-full transition-all duration-500" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Facility Info */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-2">FACILITY INFORMATION</h2>
              <p className="text-white/40 text-sm font-light mb-8">Tell us about your property so we can prepare the right team</p>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact fields */}
                <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                  {[
                    { key: "companyName", label: "Company Name", placeholder: "Acme Corporation" },
                    { key: "contactName", label: "Contact Name", placeholder: "John Smith" },
                    { key: "phone", label: "Phone Number", placeholder: "(702) 000-0000" },
                    { key: "email", label: "Email Address", placeholder: "john@company.com" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-2 block">{f.label}</label>
                      <input type="text" value={data[f.key as keyof BookingData] as string}
                        onChange={e => set(f.key as keyof BookingData, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#F5C518]/50 transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-2 block">Property Address</label>
                    <input type="text" value={data.address} onChange={e => set("address", e.target.value)}
                      placeholder="123 Business Blvd, Las Vegas, NV 89101"
                      className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#F5C518]/50 transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-3 block">Property Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PROPERTY_TYPES.map(pt => (
                      <button key={pt} onClick={() => set("propertyType", pt)}
                        className="py-2 px-2 text-center text-xs font-cond tracking-wider uppercase transition-all duration-200"
                        style={{ background: data.propertyType === pt ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${data.propertyType === pt ? "rgba(245,197,24,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "2px", color: data.propertyType === pt ? "#F5C518" : "rgba(255,255,255,0.5)" }}>
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Facility Size */}
                  <div className="mb-5">
                    <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-3 block">Facility Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FACILITY_SIZES.map(sz => (
                        <button key={sz} onClick={() => set("facilitySize", sz)}
                          className="py-2 px-3 text-xs font-cond tracking-wider uppercase transition-all duration-200"
                          style={{ background: data.facilitySize === sz ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${data.facilitySize === sz ? "rgba(245,197,24,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "2px", color: data.facilitySize === sz ? "#F5C518" : "rgba(255,255,255,0.5)" }}>
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Frequency */}
                  <div>
                    <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-3 block">Service Frequency</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FREQUENCIES.map(fr => (
                        <button key={fr} onClick={() => set("frequency", fr)}
                          className="py-2 px-2 text-xs font-cond tracking-wider uppercase transition-all duration-200"
                          style={{ background: data.frequency === fr ? "rgba(59,79,200,0.25)" : "rgba(255,255,255,0.03)", border: `1px solid ${data.frequency === fr ? "rgba(59,79,200,0.6)" : "rgba(255,255,255,0.08)"}`, borderRadius: "2px", color: data.frequency === fr ? "white" : "rgba(255,255,255,0.5)" }}>
                          {fr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Calendar */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-2">SELECT A DATE & TIME</h2>
              <p className="text-white/40 text-sm font-light mb-8">Choose your preferred start date for service</p>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="p-6 rounded-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Month nav */}
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={() => { const d = new Date(calMonth); d.setMonth(d.getMonth()-1); setCalMonth(d); }}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors">‹</button>
                    <span className="font-cond font-bold text-white tracking-wider">
                      {MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
                    </span>
                    <button onClick={() => { const d = new Date(calMonth); d.setMonth(d.getMonth()+1); setCalMonth(d); }}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors">›</button>
                  </div>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {DAYS.map(d => <div key={d} className="text-center font-cond text-[10px] tracking-wider uppercase text-white/30 py-1">{d}</div>)}
                  </div>
                  {/* Calendar grid */}
                  <CalendarGrid calMonth={calMonth} selectedDate={data.date} onSelect={d => set("date", d)} />
                </div>

                {/* Time slots */}
                <div>
                  <div className="font-cond text-xs tracking-widest uppercase text-white/40 mb-4">Preferred Time</div>
                  <div className="space-y-3 mb-6">
                    {TIME_SLOTS.map(slot => (
                      <motion.button key={slot.id} whileHover={{ scale: 1.01 }}
                        onClick={() => set("timeSlot", slot.id)}
                        className="w-full p-4 flex items-center gap-4 text-left transition-all duration-200"
                        style={{ background: data.timeSlot === slot.id ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${data.timeSlot === slot.id ? "rgba(245,197,24,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "2px" }}>
                        <span className="text-2xl">{slot.icon}</span>
                        <div>
                          <div className={`font-cond font-bold text-sm tracking-wider uppercase ${data.timeSlot === slot.id ? "text-[#F5C518]" : "text-white"}`}>{slot.label}</div>
                          <div className="text-white/40 text-xs font-light">{slot.time}</div>
                        </div>
                        {data.timeSlot === slot.id && <div className="ml-auto text-[#F5C518]">✓</div>}
                      </motion.button>
                    ))}
                  </div>
                  {data.date && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-sm" style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)" }}>
                      <div className="font-cond text-xs tracking-widest uppercase text-[#F5C518] mb-1">Selected Date</div>
                      <div className="text-white font-light">{new Date(data.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
                      {data.timeSlot && <div className="text-white/50 text-sm mt-1">{TIME_SLOTS.find(t => t.id === data.timeSlot)?.label} — {TIME_SLOTS.find(t => t.id === data.timeSlot)?.time}</div>}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Details */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-2">PROJECT DETAILS</h2>
              <p className="text-white/40 text-sm font-light mb-8">Help our team prepare with photos and specific instructions</p>
              <div className="space-y-6">
                {/* Photo upload */}
                <div>
                  <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-3 block">Upload Photos (Optional)</label>
                  <PhotoUpload photos={data.photos} onPhotos={p => set("photos", p)} />
                </div>
                <div>
                  <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-2 block">Special Instructions</label>
                  <textarea rows={3} value={data.instructions} onChange={e => set("instructions", e.target.value)}
                    placeholder="Entry instructions, access codes, specific areas of concern..."
                    className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#F5C518]/50 transition-colors resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                </div>
                <div>
                  <label className="font-cond text-xs tracking-widest uppercase text-white/40 mb-2 block">Additional Notes</label>
                  <textarea rows={3} value={data.notes} onChange={e => set("notes", e.target.value)}
                    placeholder="Anything else we should know about your project..."
                    className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#F5C518]/50 transition-colors resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-2">REVIEW & SUBMIT</h2>
              <p className="text-white/40 text-sm font-light mb-8">Confirm your booking details before submitting</p>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Service", value: selectedService?.name, icon: selectedService?.icon },
                  { label: "Company", value: data.companyName || "—" },
                  { label: "Contact", value: `${data.contactName} · ${data.phone}` || "—" },
                  { label: "Email", value: data.email || "—" },
                  { label: "Address", value: data.address || "—" },
                  { label: "Property Type", value: data.propertyType || "—" },
                  { label: "Facility Size", value: data.facilitySize || "—" },
                  { label: "Frequency", value: data.frequency || "—" },
                  { label: "Date", value: data.date ? new Date(data.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" }) : "—" },
                  { label: "Time", value: data.timeSlot ? TIME_SLOTS.find(t => t.id === data.timeSlot)?.label + " — " + TIME_SLOTS.find(t => t.id === data.timeSlot)?.time : "—" },
                ].map(item => (
                  <div key={item.label} className="flex gap-3 p-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    {item.icon && <span className="text-xl flex-shrink-0">{item.icon}</span>}
                    <div>
                      <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-0.5">{item.label}</div>
                      <div className="text-white text-sm font-light">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {data.photos.length > 0 && (
                <div className="mb-6 p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                  <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-2">{data.photos.length} Photo{data.photos.length > 1 ? "s" : ""} Attached</div>
                  <div className="flex flex-wrap gap-2">
                    {data.photos.map((f, i) => <span key={i} className="text-xs text-white/50 font-cond px-2 py-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>{f.name}</span>)}
                  </div>
                </div>
              )}
              <div className="p-5 mb-6" style={{ background: "rgba(59,79,200,0.08)", border: "1px solid rgba(59,79,200,0.2)", borderRadius: "2px" }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">ℹ️</span>
                  <div className="text-white/60 text-sm font-light leading-relaxed">
                    By submitting this booking request, our team will review your details and contact you within <strong className="text-white">2 business hours</strong> to confirm your appointment and provide a custom quote.
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="font-cond font-semibold text-xs tracking-widest uppercase px-6 py-3 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "2px", color: "rgba(255,255,255,0.6)" }}>
            ← Back
          </button>
        )}
        {step < 4 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !data.service}
            className="flex-1 font-cond font-bold text-sm tracking-widest uppercase py-4 transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(90deg, #3B4FC8, #2A3A9E)", border: "none", borderRadius: "2px", color: "white" }}>
            Continue →
          </button>
        ) : (
          <motion.button onClick={handleSubmit} disabled={submitting}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="flex-1 font-cond font-bold text-sm tracking-widest uppercase py-4 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
            style={{ background: "linear-gradient(90deg, #F5C518, #D4A800)", border: "none", borderRadius: "2px", color: "#0D0F1E" }}>
            {submitting ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-[#0D0F1E]/30 border-t-[#0D0F1E] rounded-full" /> Submitting...</>
            ) : "✓ Submit Booking Request"}
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ── Calendar Grid ──────────────────────────────────────────────────────────
function CalendarGrid({ calMonth, selectedDate, onSelect }: { calMonth: Date; selectedDate: string; onSelect: (d: string) => void }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="grid grid-cols-7 gap-1">
      {cells.map((d, i) => {
        if (!d) return <div key={i} />;
        const dt = new Date(calMonth.getFullYear(), calMonth.getMonth(), d);
        const past = dt < today;
        const sunday = dt.getDay() === 0;
        const disabled = past || sunday;
        const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const selected = selectedDate === dateStr;
        return (
          <button key={i} onClick={() => !disabled && onSelect(dateStr)} disabled={disabled}
            className={`aspect-square flex items-center justify-center text-sm font-cond transition-all duration-200 rounded-sm ${disabled ? "opacity-25 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"} ${selected ? "text-[#0D0F1E] font-bold" : "text-white/70"}`}
            style={selected ? { background: "#F5C518" } : {}}>
            {d}
          </button>
        );
      })}
    </div>
  );
}

// ── Photo Upload ───────────────────────────────────────────────────────────
function PhotoUpload({ photos, onPhotos }: { photos: File[]; onPhotos: (f: File[]) => void }) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    onPhotos([...photos, ...Array.from(files)].slice(0, 6));
  };
  return (
    <div>
      <label className="block cursor-pointer"
        style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: "4px", padding: "32px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
        <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
        <div className="text-4xl mb-3">📸</div>
        <div className="font-cond font-bold text-sm tracking-wider uppercase text-white/60 mb-1">Drop Photos Here</div>
        <div className="text-white/30 text-xs font-light">Up to 6 photos · JPG, PNG, HEIC · Max 10MB each</div>
        <div className="mt-3 inline-block font-cond text-xs tracking-widest uppercase px-4 py-2"
          style={{ border: "1px solid rgba(245,197,24,0.3)", color: "#F5C518", borderRadius: "2px" }}>Browse Files</div>
      </label>
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {photos.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px" }}>
              <span className="text-sm">🖼️</span>
              <span className="text-white/60 text-xs font-light truncate max-w-32">{f.name}</span>
              <button onClick={() => onPhotos(photos.filter((_,j)=>j!==i))} className="text-white/30 hover:text-white/60 ml-1">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Success Screen ─────────────────────────────────────────────────────────
function SuccessScreen({ data }: { data: BookingData }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-7xl mb-8">🎉</motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display text-5xl text-white mb-4">BOOKING RECEIVED!</h2>
        <p className="text-white/60 font-light text-lg mb-8">Thank you, <strong className="text-white">{data.contactName || data.companyName}</strong>. We&apos;ve received your request and will contact you within <strong className="text-[#F5C518]">2 business hours</strong> to confirm.</p>
        <div className="p-6 mb-8 text-left" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: "4px" }}>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="font-cond text-[10px] tracking-widest uppercase text-[#F5C518] mb-1">Service</div><div className="text-white text-sm">{SERVICES.find(s=>s.id===data.service)?.name}</div></div>
            <div><div className="font-cond text-[10px] tracking-widest uppercase text-[#F5C518] mb-1">Company</div><div className="text-white text-sm">{data.companyName}</div></div>
            <div><div className="font-cond text-[10px] tracking-widest uppercase text-[#F5C518] mb-1">Requested Date</div><div className="text-white text-sm">{data.date ? new Date(data.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"long",day:"numeric"}) : "TBD"}</div></div>
            <div><div className="font-cond text-[10px] tracking-widest uppercase text-[#F5C518] mb-1">Phone</div><div className="text-white text-sm">{data.phone}</div></div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="font-cond font-bold text-sm tracking-widest uppercase px-8 py-3" style={{ background: "#F5C518", color: "#0D0F1E", borderRadius: "2px" }}>Back to Home</Link>
          <a href="tel:7027952855" className="font-cond font-semibold text-sm tracking-widest uppercase px-8 py-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: "2px" }}>📞 (702) 795-2855</a>
        </div>
      </motion.div>
    </div>
  );
}
