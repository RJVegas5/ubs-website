import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageHero from "../components/PageHero";
import Footer from "../components/Footer";
import About from "../components/About";
import WhyUs from "../components/WhyUs";

export const metadata: Metadata = {
  title: "About Us | Ultimate Building Services, Inc. Las Vegas",
  description: "Learn why Las Vegas businesses choose Ultimate Building Services. Family-owned, licensed, and committed to going several steps further than the competition.",
};

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <PageHero
        tag="Our Story"
        title="FAMILY-OWNED."
        highlight="LAS VEGAS PROUD."
        sub="Ultimate Building Services, Inc. is a family-owned and operated company that understands what it truly means to go above and beyond. Not just a cleaning company — a business partner."
      />
      <About />
      <WhyUs />
      <Footer />
    </main>
  );
}
