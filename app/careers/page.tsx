import type { Metadata } from "next";
import Nav from "../components/Nav";
import PageHero from "../components/PageHero";
import Footer from "../components/Footer";
import Careers from "../components/Careers";

export const metadata: Metadata = {
  title: "Careers | Ultimate Building Services, Inc. Las Vegas",
  description: "Join the UBS team. We're hiring janitors, maintenance technicians, painters, and handymen in Las Vegas. Competitive pay, flexible hours, family culture.",
};

export default function CareersPage() {
  return (
    <main>
      <Nav />
      <PageHero
        tag="Join Our Team"
        title="COME WORK"
        highlight="WITH US."
        sub="Join a family-owned company that values hard work, reliability, and integrity. We offer competitive pay, consistent hours Mon–Sat, and a team that genuinely has your back."
      />
      <Careers />
      <Footer />
    </main>
  );
}
