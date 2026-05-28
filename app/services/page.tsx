import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageHero from "../components/PageHero";
import Footer from "../components/Footer";
import ServicesContent from "../components/ServicesContent";

export const metadata: Metadata = {
  title: "Services | Ultimate Building Services, Inc. Las Vegas",
  description: "Commercial janitorial, building maintenance, pressure washing, carpet cleaning, window cleaning, drywall, painting, and electrostatic disinfection services in Las Vegas, NV.",
};

export default function ServicesPage() {
  return (
    <main>
      <Nav />
      <PageHero
        tag="What We Offer"
        title="FULL-SPECTRUM"
        highlight="FACILITY SERVICES"
        sub="High-quality and experienced commercial services — whether your building requires standard cleaning, electrostatic disinfection, maintenance, or construction services. We handle it all."
      />
      <ServicesContent />
      <Footer />
    </main>
  );
}
