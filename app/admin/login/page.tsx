"use client";

import { useState, useEffect, FormEvent, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pin.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(
          newAttempts >= 3
            ? "Too many incorrect attempts. Verify your ADMIN_PIN in .env.local"
            : "Incorrect PIN. Please try again."
        );
        setPin("");
        inputRef.current?.focus();
        return;
      }

      const from = searchParams.get("from") ?? "/admin";
      router.push(from);
      router.refresh();
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
      {/* Background accent */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(59,79,200,0.10) 0%, transparent 55%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,197,24,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Brand */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
              style={{ background: "#F5C518" }}
            >
              <span
                className="font-bold text-2xl"
                style={{ color: "#070915", fontFamily: "var(--font-display)" }}
              >
                U
              </span>
            </div>
            <div
              className="font-bold text-xs tracking-[0.35em] uppercase mb-1"
              style={{ color: "#F5C518", fontFamily: "var(--font-display)", fontSize: "0.7rem" }}
            >
              Ultimate Building Services
            </div>
            <div className="text-white/30 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-cond, sans-serif)" }}>
              Admin Dashboard
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "#0D0F1E",
              border: "1px solid rgba(245,197,24,0.12)",
              boxShadow: "0 0 40px rgba(0,0,0,0.5)",
            }}
          >
            <h1
              className="text-xl font-bold tracking-wider mb-1"
              style={{ color: "#ffffff", fontFamily: "var(--font-display)" }}
            >
              ENTER ACCESS PIN
            </h1>
            <p className="text-white/35 text-sm mb-7">
              This area is restricted to authorized staff only.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* PIN dots display */}
              <div className="flex justify-center gap-3 mb-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full transition-all duration-150"
                    style={{
                      background: i < pin.length ? "#F5C518" : "rgba(255,255,255,0.1)",
                      transform: i < pin.length ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              <div>
                <input
                  ref={inputRef}
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter PIN"
                  maxLength={16}
                  className="w-full px-4 py-3.5 rounded-lg text-white text-center text-xl tracking-[0.5em] placeholder-gray-600 outline-none"
                  style={{
                    background: "#151729",
                    border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                    letterSpacing: "0.5em",
                  }}
                  onFocus={(e) => {
                    if (!error) e.currentTarget.style.borderColor = "rgba(245,197,24,0.4)";
                  }}
                  onBlur={(e) => {
                    if (!error) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.25)",
                    color: "#FCA5A5",
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || !pin}
                className="w-full py-3.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-200"
                style={{
                  background: loading || !pin ? "rgba(245,197,24,0.3)" : "#F5C518",
                  color: "#070915",
                  cursor: loading || !pin ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-display)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Access Dashboard"
                )}
              </button>
            </form>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-white/25 text-xs hover:text-white/60 transition-colors tracking-wider"
              style={{ fontFamily: "var(--font-cond, sans-serif)" }}
            >
              ← Back to UBS website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070915" }}>
        <div className="w-10 h-10 border-2 border-[#F5C518]/20 border-t-[#F5C518] rounded-full animate-spin" />
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
