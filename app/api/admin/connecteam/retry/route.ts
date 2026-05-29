/**
 * POST /api/admin/connecteam/retry
 *
 * Admin-only route that retries all bookings whose connecteam_sync_status
 * is "failed".  Protected by the same admin cookie used by the dashboard.
 *
 * Optional JSON body:
 *   { "bookingId": "uuid" }  — retry a single specific booking
 *   {}                       — retry ALL failed bookings (max 50 per call)
 *
 * Returns:
 *   {
 *     attempted: number,
 *     synced:    number,
 *     failed:    number,
 *     results:   Array<{ bookingId, status, externalId?, error? }>
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthedFromHeaders } from "@/lib/admin-auth";
import {
  isConnecteamConfigured,
  mapBookingToConnecteamPayload,
  createConnecteamJobOrShift,
} from "@/lib/connecteam";

export async function POST(req: NextRequest) {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const authed = await isAdminAuthedFromHeaders();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Connecteam config check ───────────────────────────────────────────────
  if (!isConnecteamConfigured()) {
    return NextResponse.json(
      {
        error: "Connecteam is not configured. Set CONNECTEAM_ENABLED=true and ensure CONNECTEAM_API_KEY and CONNECTEAM_SCHEDULER_ID are present.",
      },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  // ── Parse optional body ───────────────────────────────────────────────────
  let targetBookingId: string | null = null;
  try {
    const body = await req.json().catch(() => ({}));
    targetBookingId = body?.bookingId ?? null;
  } catch { /* ignore */ }

  // ── Fetch failed bookings ─────────────────────────────────────────────────
  const query = supabase
    .from("bookings")
    .select("id, service, company_name, contact_name, phone, email, address, date, time_slot, notes, instructions, lead_id")
    .eq("connecteam_sync_status", "failed")
    .order("created_at", { ascending: false })
    .limit(50);

  if (targetBookingId) {
    query.eq("id", targetBookingId);
  }

  const { data: bookings, error: fetchErr } = await query;

  if (fetchErr) {
    console.error("[connecteam/retry] DB fetch error:", fetchErr);
    return NextResponse.json({ error: "Failed to fetch bookings", detail: fetchErr.message }, { status: 500 });
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({
      attempted: 0,
      synced: 0,
      failed: 0,
      results: [],
      message: targetBookingId
        ? "Booking not found or not in failed state."
        : "No failed bookings found.",
    });
  }

  // ── Retry each booking ────────────────────────────────────────────────────
  type RetryResult = {
    bookingId: string;
    status: "synced" | "failed";
    externalId?: string;
    error?: string;
  };

  const results: RetryResult[] = [];
  let synced = 0;
  let failed = 0;

  for (const booking of bookings) {
    try {
      const ctPayload = mapBookingToConnecteamPayload({
        service:      booking.service      ?? null,
        companyName:  booking.company_name ?? null,
        contactName:  booking.contact_name ?? null,
        phone:        booking.phone        ?? null,
        email:        booking.email        ?? null,
        address:      booking.address      ?? null,
        date:         booking.date         ?? null,
        timeSlot:     booking.time_slot    ?? null,
        notes:        booking.notes        ?? null,
        instructions: booking.instructions ?? null,
        bookingId:    booking.id,
        leadId:       booking.lead_id      ?? null,
      });

      const result = await createConnecteamJobOrShift(ctPayload);

      // Update booking status
      await supabase
        .from("bookings")
        .update({
          connecteam_sync_status: "synced",
          connecteam_external_id: result.externalId ?? null,
        })
        .eq("id", booking.id);

      // Activity log
      if (booking.lead_id) {
        await Promise.resolve(supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   booking.lead_id,
          action:      "connecteam_synced",
          description: `Booking re-synced to Connecteam via retry. Shift ID: ${result.externalId ?? "unknown"}`,
          created_by:  "admin",
        })).catch(() => {});
      }

      results.push({ bookingId: booking.id, status: "synced", externalId: result.externalId });
      synced++;
    } catch (ctErr) {
      const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
      console.error(`[connecteam/retry] Booking ${booking.id} still failing:`, errMsg);

      // Keep status as "failed" — just log the fresh attempt
      if (booking.lead_id) {
        await Promise.resolve(supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   booking.lead_id,
          action:      "connecteam_sync_failed",
          description: `Retry attempt for booking ${booking.id} failed again: ${errMsg}`,
          created_by:  "admin",
        })).catch(() => {});
      }

      results.push({ bookingId: booking.id, status: "failed", error: errMsg });
      failed++;
    }
  }

  return NextResponse.json({
    attempted: bookings.length,
    synced,
    failed,
    results,
  });
}

// ── GET: quick status check ───────────────────────────────────────────────────
// Returns a count of pending/failed bookings so the admin dashboard can show
// a badge without exposing sensitive data.

export async function GET() {
  const authed = await isAdminAuthedFromHeaders();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("connecteam_sync_status")
    .in("connecteam_sync_status", ["pending", "failed"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts = { pending: 0, failed: 0 };
  for (const row of data ?? []) {
    if (row.connecteam_sync_status === "pending") counts.pending++;
    if (row.connecteam_sync_status === "failed")  counts.failed++;
  }

  return NextResponse.json({
    configured: isConnecteamConfigured(),
    ...counts,
  });
}
