import type { Metadata } from "next";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import AboutTeaser from "./components/AboutTeaser";
import ServicesTeaser from "./components/ServicesTeaser";
import HowItWorks from "./components/HowItWorks";
import IndustriesGrid from "./components/IndustriesGrid";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commercial Cleaning Las Vegas | UBS — Ultimate Building Services",
  description:
    "Professional commercial cleaning, janitorial services, building maintenance & facility services in Las Vegas. Licensed, insured & 5-star rated. Call (702) 795-2855.",
};

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <TrustBar />
      <AboutTeaser />
      <ServicesTeaser />
      <HowItWorks />
      <IndustriesGrid />
      <WhyUs />
      <Testimonials />
      <CtaStrip />
      <Footer />
    </main>
  );
}

function CtaStrip() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0D0F1E 0%, #1A2470 50%, #0D0F1E 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518] mb-5">
          Contact Us Today
        </div>
        <h2 className="font-display text-[clamp(36px,5.5vw,68px)] leading-[0.92] text-white mb-5 tracking-wide">
          ESTABLISH A CLEANING ROUTINE
          <br />
          <span className="text-[#F5C518]">THAT BEST SERVES YOUR NEEDS</span>
        </h2>
        <p className="text-white/50 font-light text-lg max-w-xl mx-auto mb-10">
          Questions, comments, or requests? We respond within 2 business hours
          — guaranteed.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/contact"
            className="group relative font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-10 py-4 hover:bg-white transition-colors overflow-hidden"
          >
            Get a Free Quote
            <div className="absolute -inset-1 bg-[#F5C518]/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </Link>
          <a
            href="tel:7027952855"
            className="font-cond font-bold text-sm tracking-widest uppercase text-white px-10 py-4 transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            📞 (702) 795-2855
          </a>
        </div>
      </div>
    </section>
  );
}
