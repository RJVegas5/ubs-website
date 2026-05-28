"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const services = [
    { name: "Commercial Janitorial", href: "/services" },
    { name: "Building Maintenance", href: "/services" },
    { name: "Pressure Washing", href: "/services" },
    { name: "Window Cleaning", href: "/services" },
    { name: "Carpet & Floor Care", href: "/services" },
    { name: "Electrostatic Disinfection", href: "/services" },
    { name: "Commercial Painting", href: "/services" },
    { name: "Drywall Services", href: "/services" },
    { name: "Exterior Maintenance", href: "/services" },
  ];
  const areas = ["Las Vegas", "Henderson", "Summerlin", "North Las Vegas", "Boulder City"];

  return (
    <footer className="bg-[#0D0F1E] border-t-2 border-[#F5C518]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <div style={{ mixBlendMode: "lighten" }}><Image src="/logo.png" alt="Ultimate Building Services Inc" width={200} height={80} className="h-16 w-auto object-contain" /></div>
            </Link>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-5">
              Family-owned commercial janitorial and building maintenance. A Full-Service Janitorial Company serving Las Vegas since day one.
            </p>
            <div className="space-y-1">
              <div className="font-cond text-xs tracking-widest uppercase text-white/30">NV Contractor License</div>
              <div className="font-cond font-bold text-[#F5C518] text-sm">#91170 · Bid Limit: $45,000</div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-5">Our Services</div>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.name}>
                  <Link href={s.href} className="text-white/45 text-sm font-light hover:text-white transition-colors">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas & Links */}
          <div>
            <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-5">Service Areas</div>
            <ul className="space-y-2.5 mb-6">
              {areas.map((a) => (
                <li key={a}><Link href="/contact" className="text-white/45 text-sm font-light hover:text-white transition-colors">{a}, NV</Link></li>
              ))}
            </ul>
            <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-3">Quick Links</div>
            <ul className="space-y-2">
              {[{ label: "About Us", href: "/about" }, { label: "Why Choose UBS", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Get a Quote", href: "/contact" }].map((l) => (
                <li key={l.label}><Link href={l.href} className="text-white/45 text-sm font-light hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-[#F5C518] mb-5">Contact</div>
            <div className="space-y-5">
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
                <div className="text-white/55 text-sm font-light">Mon–Sat: 6am – 10pm<br />After-hours by arrangement</div>
              </div>
              <Link href="/contact" className="inline-block font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-5 py-2.5 hover:bg-[#D4A800] transition-colors">
                Free Quote →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/25 text-xs font-light">&copy; {new Date().getFullYear()} Ultimate Building Services, Inc. All rights reserved.</div>
          <div className="text-white/25 text-xs font-light text-center">Commercial Janitorial · Building Maintenance · Pressure Washing · Las Vegas, NV</div>
        </div>
      </div>
    </footer>
  );
}
