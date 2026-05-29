import { createHmac } from "crypto";
import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "./supabase";
import type { Customer } from "./types";

export const PORTAL_COOKIE = "ubs_portal";
const SECRET =
  process.env.PORTAL_SECRET || process.env.ADMIN_PIN || "ubs-portal-2024";

// ── Token helpers ─────────────────────────────────────────────────────────────

export function signToken(customerId: string): string {
  const hmac = createHmac("sha256", SECRET).update(customerId).digest("hex");
  return `${customerId}.${hmac}`;
}

export function verifyToken(token: string): string | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const customerId = token.slice(0, dotIndex);
  const hmac = token.slice(dotIndex + 1);
  if (!customerId || !hmac) return null;
  const expected = createHmac("sha256", SECRET)
    .update(customerId)
    .digest("hex");
  if (hmac !== expected) return null;
  return customerId;
}

// ── Used from Route Handlers (reads cookie from request) ──────────────────────

export async function getPortalCustomerFromRequest(
  req: NextRequest
): Promise<Customer | null> {
  const token = req.cookies.get(PORTAL_COOKIE)?.value;
  if (!token) return null;

  const customerId = verifyToken(token);
  if (!customerId) return null;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  return (data as Customer) || null;
}

// ── Used from Server Components (reads cookie via next/headers) ───────────────

export async function getPortalCustomerFromHeaders(): Promise<Customer | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_COOKIE)?.value;
  if (!token) return null;

  const customerId = verifyToken(token);
  if (!customerId) return null;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  return (data as Customer) || null;
}
