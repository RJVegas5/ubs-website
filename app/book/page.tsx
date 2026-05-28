import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import BookingWizard from "../components/BookingWizard";

export const metadata: Metadata = {
  title: "Book a Service | Ultimate Building Services Las Vegas",
  description: "Book commercial cleaning, janitorial, maintenance, pressure washing, and more. Fast online booking for Las Vegas, Henderson, Summerlin businesses. (702) 795-2855",
};

export default function BookPage() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #070915 0%, #0D0F1E 100%)" }}>
      <Nav />
      <div className="pt-20">
        <BookingWizard />
      </div>
      <Footer />
    </main>
  );
}
