import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Services from "./components/Services";
import About from "./components/About";
import WhyUs from "./components/WhyUs";
import Areas from "./components/Areas";
import Careers from "./components/Careers";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <TrustBar />
      <Services />
      <About />
      <WhyUs />
      <Areas />
      <Careers />
      <Contact />
      <Footer />
    </main>
  );
}
