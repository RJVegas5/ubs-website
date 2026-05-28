"use client";
import { motion } from "framer-motion";

export default function Footer() {
  const services = ["Commercial Janitorial", "Building Maintenance", "Drywall Services", "Commercial Painting", "Pressure Washing", "Window Cleaning", "Carpet & Floor Care", "Electrostatic Disinfection"];
  const areas = ["Las Vegas", "Henderson", "Summerlin", "North Las Vegas", "Boulder City"];

  return (
    <footer className="bg-[#0D0F1E] border-t-2 border-[#F5C518]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#F5C518] rounded-sm flex items-center justify-center font-cond font-bold text-[#0D0F1E] text-sm">UBS</div>
              <div>
                <div className="font-cond font-bold text-white text-sm tracking-wider uppercase leading-none">Ultimate Building</div>
                <div className="font-cond text-[#F5C518] text-xs tracking-widest uppercase leading-none mt-0.5">Services, Inc.</div>
              </div>
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-5">
              Family-owned commercial janitorial and building maintenance. Serving Las Vegas since day one.
            </p>
            <div className="space-y-1">
              <div className="font-cond text-xs tracking-widest uppercase text-white/30">NV Contractor License</div>
              <div className="font-cond font-bold text-[#F5C518] text-sm">#91170 · Bid Limit: $45,000</div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-5">Services</div>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-white/45 text-sm font-light hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-5">Service Areas</div>
            <ul className="space-y-2.5">
              {areas.map((a) => (
                <li key={a}>
                  <a href="#areas" className="text-white/45 text-sm font-light hover:text-white transition-colors">{a}</a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-3">Quick Links</div>
              <ul className="space-y-2">
                {["About Us", "Why Choose UBS", "Careers", "Get a Quote"].map((l) => (
                  <li key={l}><a href="#" className="text-white/45 text-sm font-light hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-5">Contact</div>
            <div className="space-y-4">
              <div>
                <div className="text-white/30 text-xs font-cond tracking-wider uppercase mb-1">Phone</div>
                <a href="tel:7027952855" className="font-display text-2xl text-white hover:text-[#F5C518] transition-colors">(702) 795-2855</a>
              </div>
              <div>
                <div className="text-white/30 text-xs font-cond tracking-wider uppercase mb-1">Email</div>
                <a href="mailto:ultimate@prosharedservices.com" className="text-white/55 text-sm hover:text-white transition-colors break-all">ultimate@prosharedservices.com</a>
              </div>
              <div>
                <div className="text-white/30 text-xs font-cond tracking-wider uppercase mb-1">Address</div>
                <address className="text-white/55 text-sm not-italic font-light">2645 Sorrel St.<br />Las Vegas, NV 89146</address>
              </div>
              <div>
                <div className="text-white/30 text-xs font-cond tracking-wider uppercase mb-1">Hours</div>
                <div className="text-white/55 text-sm font-light">Mon–Sat: 6am – 10pm<br />Available after-hours by arrangement</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/25 text-xs font-light">&copy; 2024 Ultimate Building Services, Inc. All rights reserved.</div>
          <div className="text-white/25 text-xs font-light">Commercial Janitorial · Building Maintenance · Las Vegas, NV</div>
        </div>
      </div>
    </footer>
  );
}
