import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageHero from "../components/PageHero";
import Footer from "../components/Footer";
import Contact from "../components/Contact";
import Areas from "../components/Areas";

export const metadata: Metadata = {
  title: "Contact & Get a Quote | Ultimate Building Services, Inc. Las Vegas",
  description: "Contact Ultimate Building Services for a free quote. Call (702) 795-2855 or email ultimate@prosharedservices.com. Serving Las Vegas, Henderson, Summerlin, North Las Vegas, and Boulder City.",
};

export default function ContactPage() {
  return (
    <main>
      <Nav />
      <PageHero
        tag="Get in Touch"
        title="LET'S BUILD YOUR"
        highlight="CLEANING ROUTINE."
        sub="Questions, comments, or requests? We'd love to hear from you. Reach out and we'll build a custom plan around your facility, schedule, and budget."
      />
      <Contact />
      <Areas />
      <Footer />
    </main>
  );
}
