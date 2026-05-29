"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/portal");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#070915" }}
    >
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(59,79,200,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                style={{ background: "#F5C518", color: "#070915" }}
              >
                U
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ color: "#F5C518", fontFamily: "var(--font-display)" }}
              >
                UBS
              </span>
            </div>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Customer Portal</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "#0D0F1E",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "#F5C518", fontFamily: "var(--font-display)" }}
          >
            SIGN IN
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Access your service history, estimates, and invoices.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-colors"
                style={{
                  background: "#151729",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "0.9rem",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-colors"
                style={{
                  background: "#151729",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "0.9rem",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,197,24,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#FCA5A5",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-base transition-all"
              style={{
                background: loading ? "#2A3A9E" : "#F5C518",
                color: "#070915",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.05em",
              }}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div
            className="mt-6 pt-5 text-center text-sm"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-gray-500">
              Don&apos;t have portal access?{" "}
              <a
                href="tel:7027952855"
                style={{ color: "#F5C518" }}
                className="font-medium"
              >
                Call (702) 795-2855
              </a>
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            ← Back to UBS website
          </Link>
        </div>
      </div>
    </div>
  );
}
