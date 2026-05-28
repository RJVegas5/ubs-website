"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[#0D0F1E]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left dark panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-[#0D0F1E] p-10 md:p-14 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#F5C518]" />
            <div className="absolute bottom-0 right-0 font-display text-[160px] text-white/[0.025] leading-none select-none">UBS</div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-[#F5C518]" />
                <span className="font-cond text-xs tracking-[0.25em] uppercase text-[#F5C518]">Get in Touch</span>
              </div>
              <h2 className="font-display text-[clamp(40px,5vw,64px)] leading-[0.92] text-white mb-6">
                LET&apos;S BUILD<br />YOUR CLEANING<br /><span className="text-[#F5C518]">ROUTINE TODAY</span>
              </h2>
              <p className="text-white/50 font-light leading-relaxed mb-10">
                Questions, comments, or requests? Feel free to reach out — we&apos;d love to hear from you and build a plan that perfectly serves your needs.
              </p>

              <div className="space-y-6">
                <a href="tel:7027952855" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F5C518]/20 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-cond text-xs tracking-widest uppercase text-white/40">Phone</div>
                    <div className="font-display text-2xl text-[#F5C518] group-hover:text-[#D4A800] transition-colors">(702) 795-2855</div>
                  </div>
                </a>

                <a href="mailto:ultimate@prosharedservices.com" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-[#3B4FC8]/10 border border-[#3B4FC8]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B4FC8]/20 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#3B4FC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-cond text-xs tracking-widest uppercase text-white/40">Email</div>
                    <div className="text-white/70 text-sm group-hover:text-white transition-colors">ultimate@prosharedservices.com</div>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-cond text-xs tracking-widest uppercase text-white/40">Address</div>
                    <div className="text-white/60 text-sm">2645 Sorrel St., Las Vegas, NV 89146</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="bg-[#F5F5F2] p-10 md:p-14"
          >
            <h3 className="font-display text-3xl text-[#0D0F1E] mb-8">REQUEST A QUOTE</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {["First Name", "Last Name"].map((f) => (
                  <div key={f}>
                    <label className="font-cond text-xs tracking-widest uppercase text-[#6A6A80] mb-1.5 block">{f}</label>
                    <input type="text" className="w-full bg-white border border-[#E0E0EC] text-[#0D0F1E] text-sm px-4 py-3 focus:outline-none focus:border-[#3B4FC8] transition-colors" />
                  </div>
                ))}
              </div>
              {[
                { label: "Business Name", type: "text" },
                { label: "Email Address", type: "email" },
                { label: "Phone Number", type: "tel" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="font-cond text-xs tracking-widest uppercase text-[#6A6A80] mb-1.5 block">{f.label}</label>
                  <input type={f.type} className="w-full bg-white border border-[#E0E0EC] text-[#0D0F1E] text-sm px-4 py-3 focus:outline-none focus:border-[#3B4FC8] transition-colors" />
                </div>
              ))}
              <div>
                <label className="font-cond text-xs tracking-widest uppercase text-[#6A6A80] mb-1.5 block">Services Needed</label>
                <select className="w-full bg-white border border-[#E0E0EC] text-[#0D0F1E] text-sm px-4 py-3 focus:outline-none focus:border-[#3B4FC8] transition-colors">
                  <option value="">Select a service</option>
                  <option>Commercial Janitorial</option>
                  <option>Building Maintenance</option>
                  <option>Drywall Services</option>
                  <option>Commercial Painting</option>
                  <option>Pressure Washing</option>
                  <option>Window Cleaning</option>
                  <option>Carpet & Floor Care</option>
                  <option>Electrostatic Disinfection</option>
                  <option>Multiple Services</option>
                </select>
              </div>
              <div>
                <label className="font-cond text-xs tracking-widest uppercase text-[#6A6A80] mb-1.5 block">Message</label>
                <textarea rows={4} placeholder="Tell us about your facility and what you need..." className="w-full bg-white border border-[#E0E0EC] text-[#0D0F1E] text-sm px-4 py-3 focus:outline-none focus:border-[#3B4FC8] transition-colors resize-none placeholder:text-[#6A6A80]/40" />
              </div>
              <button className="w-full font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] py-4 hover:bg-[#D4A800] transition-colors">
                Send Message
              </button>
              <p className="text-[#6A6A80] text-xs font-light text-center">We typically respond within a few hours during business hours.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
