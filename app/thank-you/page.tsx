import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | UBS — Ultimate Building Services",
  description: "Thank you for contacting Ultimate Building Services. We'll be in touch within 1 business day.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#070915" }}
    >
      {/* Gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(59,79,200,0.1) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 text-center max-w-lg">
        {/* Animated checkmark */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.3)" }}
        >
          ✓
        </div>

        <h1
          className="text-4xl sm:text-5xl font-bold mb-3"
          style={{ fontFamily: "var(--font-display)", color: "#F5C518" }}
        >
          GOT IT — THANK YOU!
        </h1>

        <p className="text-gray-400 text-base mb-2">
          Your request has been received by the UBS team.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          We typically respond within{" "}
          <span className="text-gray-300 font-medium">1 business day</span>.
          For immediate assistance, call us directly.
        </p>

        {/* What happens next */}
        <div
          className="text-left rounded-2xl p-5 mb-8"
          style={{
            background: "#0D0F1E",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: "#F5C518", fontFamily: "var(--font-display)" }}
          >
            What Happens Next
          </h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "We review your request",
                body: "Our team reviews your submission and identifies the right person for your project.",
              },
              {
                step: "2",
                title: "We reach out",
                body: "A UBS representative will contact you by phone or email within 1 business day.",
              },
              {
                step: "3",
                title: "Site visit or estimate",
                body: "We'll schedule a site visit or provide a detailed estimate based on your needs.",
              },
              {
                step: "4",
                title: "You approve, we deliver",
                body: "Once you approve the estimate, we schedule your service and get to work.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ background: "rgba(59,79,200,0.3)", color: "#93A3F8" }}
                >
                  {item.step}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-200">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:7027952855"
            className="px-6 py-3 rounded-xl font-bold text-base transition-all"
            style={{
              background: "#F5C518",
              color: "#070915",
              fontFamily: "var(--font-display)",
            }}
          >
            📞 CALL (702) 795-2855
          </a>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all text-gray-300"
            style={{ borderColor: "rgba(255,255,255,0.12)" }}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-600 mt-8">
          Ultimate Building Services · Las Vegas, NV · NV License #91170
        </p>
      </div>
    </div>
  );
}
