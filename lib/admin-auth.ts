/**
 * Admin auth helpers — uses Web Crypto API (crypto.subtle) so it works in both
 * Edge Runtime (proxy.ts) and Node.js runtime (API routes).
 */
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "ubs_admin_session";

// ── Web Crypto HMAC helpers ───────────────────────────────────────────────────

async function hmacHex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getSecret(): string {
  return process.env.ADMIN_PIN ?? "ubs-admin-2024";
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export async function signAdminToken(): Promise<string> {
  const payload = "admin";
  const hmac = await hmacHex(getSecret(), payload);
  return `${payload}.${hmac}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const hmac = token.slice(dotIndex + 1);
  if (payload !== "admin" || !hmac) return false;
  const expected = await hmacHex(getSecret(), payload);
  return hmac === expected;
}

// ── Used from proxy.ts (Edge Runtime, reads cookie from request) ──────────────

export async function isAdminAuthedFromRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

// ── Used from Route Handlers (Node.js runtime) ───────────────────────────────

export async function isAdminAuthedFromHeaders(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
