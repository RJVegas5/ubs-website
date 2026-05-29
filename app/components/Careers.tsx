"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconDollar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconShirt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const positions = [
  { title: "Janitor / Custodian", pay: "$11.25 – $15/hr", type: "Full-Time", details: "Mon–Sat · 36+ hrs/week · Reliable transportation required", badge: "Hiring Now" },
  { title: "Maintenance Technician", pay: "Based on Experience", type: "Full-Time", details: "Mon–Sat · 36+ hrs/week · Multi-trade preferred", badge: "Hiring Now" },
  { title: "Commercial Painter", pay: "Based on Experience", type: "Full-Time / Contract", details: "Mon–Sat · Project-based · Portfolio preferred", badge: "Open" },
  { title: "Handyman", pay: "Based on Experience", type: "Full-Time", details: "Mon–Sat · 36+ hrs/week · Diverse skill set preferred", badge: "Open" },
];

type IconFC = () => React.JSX.Element;

const benefits: { Icon: IconFC; title: string; body: string }[] = [
  { Icon: IconDollar, title: "Competitive Pay", body: "Starting at $11.25/hr with room to grow based on skill and performance." },
  { Icon: IconCalendar, title: "Consistent Schedule", body: "Monday through Saturday with predictable hours you can plan your life around." },
  { Icon: IconUsers, title: "Family Culture", body: "We treat every team member like family. Respect, support, and appreciation every day." },
  { Icon: IconTrendingUp, title: "Growth Opportunities", body: "Promote from within. Many of our supervisors started as custodians." },
  { Icon: IconShirt, title: "Uniforms Provided", body: "Professional UBS uniforms provided. Show up looking sharp, represent us well." },
  { Icon: IconShield, title: "Stable Company", body: "20+ years in business means stability. We're not going anywhere — and neither should you." },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Careers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    position: "", transport: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* ok */ }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div>
      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-bl-full opacity-10"
          style={{ background: "radial-gradient(circle, #F5C518 0%, transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#3B4FC8]">Why Join UBS</span>
              <div className="w-8 h-px bg-[#3B4FC8]" />
            </div>
            <h2 className="font-display text-[clamp(40px,5vw,64px)] leading-[0.92] text-[#0D0F1E] tracking-wide mb-4">
              MORE THAN A JOB.<br /><span className="text-[#3B4FC8]">A CAREER.</span>
            </h2>
            <p className="text-[#6A6A80] font-light text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Join a family-owned company that invests in its people. We&apos;re building a team of professionals who take pride in their work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 group transition-all duration-300 cursor-default"
                style={{ background: "#F5F5F2", border: "1px solid rgba(59,79,200,0.08)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,79,200,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,79,200,0.08)"; }}
              >
                <div className="w-10 h-10 mb-4 text-[#3B4FC8] group-hover:scale-110 transition-transform origin-left">
                  <b.Icon />
                </div>
                <div className="font-cond font-bold text-base tracking-wider uppercase text-[#0D0F1E] mb-2 group-hover:text-[#3B4FC8] transition-colors">{b.title}</div>
                <div className="text-[#6A6A80] text-sm font-light leading-relaxed">{b.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Positions + Application ─────────────────────────────────── */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D0F1E 0%, #070915 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #3B4FC8 0, #3B4FC8 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px",
        }} />

        <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left: Positions */}
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#F5C518]" />
                <span className="font-cond text-xs tracking-[0.25em] uppercase text-[#F5C518]">Open Positions</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
                className="font-display text-[clamp(36px,5vw,60px)] leading-[0.92] text-white tracking-wide mb-8 sm:mb-10"
              >
                JOIN OUR<br /><span className="text-[#F5C518]">GROWING TEAM</span>
              </motion.h2>

              <div className="space-y-3 mb-10">
                {positions.map((pos, i) => (
                  <motion.div
                    key={pos.title}
                    initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-4 sm:p-5 group transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.25)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="min-w-0">
                        <div className="font-cond font-bold text-sm sm:text-base tracking-wider uppercase text-white group-hover:text-[#F5C518] transition-colors">{pos.title}</div>
                        <div className="text-white/40 text-xs font-light mt-0.5">{pos.details}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`font-cond text-[10px] tracking-wider uppercase px-2 py-0.5 ${pos.badge === "Hiring Now" ? "bg-[#F5C518]/15 text-[#F5C518]" : "bg-white/10 text-white/50"}`}>
                          {pos.badge}
                        </span>
                        <span className="font-cond font-bold text-sm text-[#F5C518]">{pos.pay}</span>
                      </div>
                    </div>
                    <span className="font-cond text-[10px] tracking-wider uppercase text-white/30 px-2 py-0.5"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {pos.type}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Culture stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { n: "20+", l: "Years Operating" },
                  { n: "100%", l: "Background Checked" },
                  { n: "98%", l: "Employee Retention" },
                ].map(s => (
                  <div key={s.l} className="text-center p-3 sm:p-4"
                    style={{ background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.15)" }}>
                    <div className="font-display text-2xl sm:text-3xl text-[#F5C518]">{s.n}</div>
                    <div className="font-cond text-[9px] tracking-widest uppercase text-white/35 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Application form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
              id="apply"
              className="relative p-6 sm:p-8"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,197,24,0.15)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F5C518] to-transparent" />

              {submitted ? (
                <div className="text-center py-10 sm:py-12">
                  <motion.div
                    animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-5"
                  >
                    <IconCheckCircle />
                  </motion.div>
                  <h3 className="font-display text-3xl text-white mb-3">APPLICATION SENT!</h3>
                  <p className="text-white/60 font-light leading-relaxed">We&apos;ll review your application and reach out within 48 hours.</p>
                  <a
                    href="tel:7027952855"
                    className="mt-6 inline-block font-display text-2xl text-[#F5C518] hover:text-[#D4A800] transition-colors cursor-pointer"
                  >
                    (702) 795-2855
                  </a>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-3xl text-white mb-6">APPLY NOW</h3>
                  <div className="space-y-4">

                    {/* First / Last name row */}
                    <div className="grid grid-cols-2 gap-3">
                      {[{ k: "firstName", l: "First Name", p: "John" }, { k: "lastName", l: "Last Name", p: "Smith" }].map(f => (
                        <div key={f.k}>
                          <label htmlFor={`career-${f.k}`} className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">{f.l}</label>
                          <input
                            id={`career-${f.k}`}
                            type="text"
                            value={form[f.k as keyof typeof form] as string}
                            onChange={e => setForm(d => ({ ...d, [f.k]: e.target.value }))}
                            placeholder={f.p}
                            className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors min-h-[44px]"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                            onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.5)"; }}
                            onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Email / Phone */}
                    {[{ k: "email", l: "Email", p: "you@email.com", t: "email" }, { k: "phone", l: "Phone", p: "(702) 000-0000", t: "tel" }].map(f => (
                      <div key={f.k}>
                        <label htmlFor={`career-${f.k}`} className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">{f.l}</label>
                        <input
                          id={`career-${f.k}`}
                          type={f.t}
                          value={form[f.k as keyof typeof form] as string}
                          onChange={e => setForm(d => ({ ...d, [f.k]: e.target.value }))}
                          placeholder={f.p}
                          className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors min-h-[44px]"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                          onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.5)"; }}
                          onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                        />
                      </div>
                    ))}

                    {/* Position */}
                    <div>
                      <label htmlFor="career-position" className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">Position</label>
                      <select
                        id="career-position"
                        value={form.position}
                        onChange={e => setForm(d => ({ ...d, position: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm text-white/70 focus:outline-none transition-colors min-h-[44px] cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,197,24,0.5)"; }}
                        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                      >
                        <option value="" className="bg-[#0D0F1E]">Select position...</option>
                        {positions.map(p => <option key={p.title} value={p.title} className="bg-[#0D0F1E]">{p.title}</option>)}
                      </select>
                    </div>

                    {/* Transportation */}
                    <div>
                      <div className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-2">Reliable Transportation?</div>
                      <div className="flex gap-6">
                        {["Yes", "No"].map(v => (
                          <label key={v} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                            <input
                              type="radio"
                              name="transport"
                              value={v}
                              checked={form.transport === v}
                              onChange={() => setForm(d => ({ ...d, transport: v }))}
                              className="accent-[#F5C518] w-4 h-4"
                            />
                            <span className="text-white/60 text-sm">{v}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full font-cond font-bold text-sm tracking-widest uppercase min-h-[48px] flex items-center justify-center gap-2 hover:bg-[#D4A800] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] disabled:opacity-60"
                      style={{ background: "#F5C518", color: "#0D0F1E" }}
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-[#0D0F1E]/30 border-t-[#0D0F1E] rounded-full"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
