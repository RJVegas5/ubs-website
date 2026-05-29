/**
 * POST /api/admin/connecteam/retry
 *
 * Retries all records with connecteam_sync_status = "failed"
 * across leads, appointments, and jobs.
 *
 * Optional body:
 *   { "entityType": "lead"|"appointment"|"job", "entityId": "uuid" }
 *   → retry one specific record
 *
 *   {}
 *   → retry ALL failed records across every entity type (max 50 each)
 *
 * GET /api/admin/connecteam/retry
 *   → returns counts: { configured, leads, appointments, jobs }
 *
 * Protected by admin cookie auth.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthedFromHeaders } from "@/lib/admin-auth";
import {
  isConnecteamConfigured,
  mapLeadToConnecteamPayload,
  mapAppointmentToConnecteamPayload,
  mapJobToConnecteamPayload,
  createConnecteamJobOrShift,
  type ConnecteamBookingPayload,
} from "@/lib/connecteam";
import type { SupabaseClient } from "@supabase/supabase-js";

type EntityType = "lead" | "appointment" | "job";

const TABLE_MAP: Record<EntityType, string> = {
  lead:        "leads",
  appointment: "appointments",
  job:         "jobs",
};

type RetryResult = {
  entityType: EntityType;
  entityId:   string;
  status:     "synced" | "failed";
  externalId?: string;
  error?:      string;
};

// ── Shared per-record retry logic ─────────────────────────────────────────────

async function retryOne(
  supabase: SupabaseClient,
  entityType: EntityType,
  record: Record<string, unknown>
): Promise<RetryResult> {
  const entityId = record.id as string;
  let payload: ConnecteamBookingPayload;

  if (entityType === "lead") {
    payload = mapLeadToConnecteamPayload(record as Parameters<typeof mapLeadToConnecteamPayload>[0]);
  } else if (entityType === "appointment") {
    payload = mapAppointmentToConnecteamPayload(record as Parameters<typeof mapAppointmentToConnecteamPayload>[0]);
  } else {
    let customerName: string | null = null;
    if (record.customer_id) {
      const { data: cust } = await supabase
        .from("customers")
        .select("company_name, contact_name")
        .eq("id", record.customer_id)
        .single();
      customerName = (cust as { company_name?: string; contact_name?: string } | null)?.company_name
        ?? (cust as { company_name?: string; contact_name?: string } | null)?.contact_name
        ?? null;
    }
    payload = mapJobToConnecteamPayload(
      record as Parameters<typeof mapJobToConnecteamPayload>[0],
      customerName
    );
  }

  try {
    const result   = await createConnecteamJobOrShift(payload);
    const syncDate = new Date().toISOString();

    await supabase.from(TABLE_MAP[entityType]).update({
      connecteam_sync_status: "synced",
      connecteam_external_id: result.externalId ?? null,
      connecteam_sync_date:   syncDate,
    }).eq("id", entityId);

    const leadId = (record.lead_id as string | null) ?? (entityType === "lead" ? entityId : null);
    if (leadId) {
      await supabase.from("activities").insert({
        entity_type: "lead",
        entity_id:   leadId,
        action:      "connecteam_synced",
        description: `${entityType} re-synced via retry. Shift ID: ${result.externalId ?? "unknown"}`,
        created_by:  "admin",
      });
    }

    return { entityType, entityId, status: "synced", externalId: result.externalId };
  } catch (ctErr) {
    const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
    console.error(`[connecteam/retry] ${entityType} ${entityId} still failing:`, errMsg);

    const leadId = (record.lead_id as string | null) ?? (entityType === "lead" ? entityId : null);
    if (leadId) {
      await supabase.from("activities").insert({
        entity_type: "lead",
        entity_id:   leadId,
        action:      "connecteam_sync_failed",
        description: `Retry attempt for ${entityType} ${entityId} failed again: ${errMsg}`,
        created_by:  "admin",
      });
    }

    return { entityType, entityId, status: "failed", error: errMsg };
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const authed = await isAdminAuthedFromHeaders();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isConnecteamConfigured()) {
    return NextResponse.json({
      error: "Connecteam is not configured. Set CONNECTEAM_ENABLED=true plus API key and scheduler ID.",
    }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  // Parse optional target
  let targetType: EntityType | null = null;
  let targetId:   string | null     = null;
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.entityType && body?.entityId) {
      if (!["lead","appointment","job"].includes(body.entityType)) {
        return NextResponse.json({ error: "entityType must be lead, appointment, or job" }, { status: 400 });
      }
      targetType = body.entityType as EntityType;
      targetId   = body.entityId   as string;
    }
  } catch { /* ignore */ }

  const results: RetryResult[] = [];
  const entityTypes: EntityType[] = targetType ? [targetType] : ["lead", "appointment", "job"];

  for (const et of entityTypes) {
    const query = supabase
      .from(TABLE_MAP[et])
      .select("*")
      .eq("connecteam_sync_status", "failed")
      .order("created_at", { ascending: false })
      .limit(50);

    if (targetId) query.eq("id", targetId);

    const { data: records, error: fetchErr } = await query;
    if (fetchErr) {
      console.error(`[connecteam/retry] DB fetch error (${et}):`, fetchErr);
      continue;
    }
    if (!records || records.length === 0) continue;

    for (const record of records) {
      results.push(await retryOne(supabase, et, record as Record<string, unknown>));
    }
  }

  if (results.length === 0) {
    return NextResponse.json({
      attempted: 0, synced: 0, failed: 0, results: [],
      message: targetId ? "Record not found or not in failed state." : "No failed records found.",
    });
  }

  const synced = results.filter(r => r.status === "synced").length;
  const failed = results.filter(r => r.status === "failed").length;

  return NextResponse.json({ attempted: results.length, synced, failed, results });
}

// ── GET — status counts ───────────────────────────────────────────────────────

export async function GET() {
  const authed = await isAdminAuthedFromHeaders();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const counts: Record<string, { pending: number; failed: number }> = {
    leads:        { pending: 0, failed: 0 },
    appointments: { pending: 0, failed: 0 },
    jobs:         { pending: 0, failed: 0 },
  };

  for (const [label, table] of [["leads","leads"],["appointments","appointments"],["jobs","jobs"]] as const) {
    const { data } = await supabase
      .from(table)
      .select("connecteam_sync_status")
      .in("connecteam_sync_status", ["pending", "failed"]);

    for (const row of data ?? []) {
      if (row.connecteam_sync_status === "pending") counts[label].pending++;
      if (row.connecteam_sync_status === "failed")  counts[label].failed++;
    }
  }

  const totalFailed  = Object.values(counts).reduce((s, c) => s + c.failed,  0);
  const totalPending = Object.values(counts).reduce((s, c) => s + c.pending, 0);

  return NextResponse.json({
    configured:    isConnecteamConfigured(),
    totalFailed,
    totalPending,
    breakdown:     counts,
  });
}
