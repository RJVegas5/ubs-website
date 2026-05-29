/**
 * POST /api/admin/connecteam/send
 *
 * Manual "Send to Connecteam" action for use inside the CRM.
 * Creates or re-creates a Connecteam shift for a specific entity
 * regardless of its current connecteam_sync_status.
 *
 * Request body:
 *   {
 *     entityType: "lead" | "appointment" | "job",
 *     entityId:   string   // UUID
 *   }
 *
 * Response:
 *   {
 *     success:    boolean,
 *     externalId: string | null,
 *     entity:     object,        // updated row
 *     error?:     string
 *   }
 *
 * Protected by admin cookie auth (same as the dashboard).
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

type EntityType = "lead" | "appointment" | "job";

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const authed = await isAdminAuthedFromHeaders();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ── Connecteam config guard ───────────────────────────────────────────────
  if (!isConnecteamConfigured()) {
    return NextResponse.json({
      error: "Connecteam is not configured. Set CONNECTEAM_ENABLED=true and ensure CONNECTEAM_API_KEY and CONNECTEAM_SCHEDULER_ID are present.",
    }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  // ── Parse body ────────────────────────────────────────────────────────────
  let entityType: EntityType;
  let entityId: string;

  try {
    const body = await req.json();
    entityType = body.entityType;
    entityId   = body.entityId;
    if (!entityType || !entityId) throw new Error("Missing fields");
    if (!["lead", "appointment", "job"].includes(entityType)) throw new Error("Invalid entityType");
  } catch {
    return NextResponse.json({ error: "Body must be { entityType: 'lead'|'appointment'|'job', entityId: string }" }, { status: 400 });
  }

  // ── Fetch entity ──────────────────────────────────────────────────────────
  const tableMap: Record<EntityType, string> = {
    lead:        "leads",
    appointment: "appointments",
    job:         "jobs",
  };

  const { data: entity, error: fetchErr } = await supabase
    .from(tableMap[entityType])
    .select("*")
    .eq("id", entityId)
    .single();

  if (fetchErr || !entity) {
    return NextResponse.json({ error: `${entityType} not found: ${fetchErr?.message ?? "unknown"}` }, { status: 404 });
  }

  // ── Map payload ───────────────────────────────────────────────────────────
  let payload: ConnecteamBookingPayload;

  if (entityType === "lead") {
    payload = mapLeadToConnecteamPayload(entity);
  } else if (entityType === "appointment") {
    payload = mapAppointmentToConnecteamPayload(entity);
  } else {
    // job — try to resolve customer name
    let customerName: string | null = null;
    if (entity.customer_id) {
      const { data: cust } = await supabase
        .from("customers")
        .select("company_name, contact_name")
        .eq("id", entity.customer_id)
        .single();
      customerName = cust?.company_name ?? cust?.contact_name ?? null;
    }
    payload = mapJobToConnecteamPayload(entity, customerName);
  }

  // ── Send to Connecteam ────────────────────────────────────────────────────
  const syncDate = new Date().toISOString();

  try {
    const result = await createConnecteamJobOrShift(payload);

    // Update entity with sync result
    await supabase.from(tableMap[entityType]).update({
      connecteam_sync_status: "synced",
      connecteam_external_id: result.externalId ?? null,
      connecteam_sync_date:   syncDate,
    }).eq("id", entityId);

    // Activity log
    const actEntityType = entityType === "job" && entity.lead_id ? "lead" : entityType === "appointment" && entity.lead_id ? "lead" : entityType;
    const actEntityId   = (entityType !== "lead" && entity.lead_id) ? entity.lead_id : entityId;

    await supabase.from("activities").insert({
      entity_type: actEntityType,
      entity_id:   actEntityId,
      action:      "connecteam_synced",
      description: `${entityType} manually sent to Connecteam by admin. Shift ID: ${result.externalId ?? "unknown"}`,
      created_by:  "admin",
    });

    console.log(`[connecteam/send] Synced ${entityType} ${entityId} → shift ${result.externalId ?? "?"}`);

    return NextResponse.json({
      success:    true,
      externalId: result.externalId ?? null,
      entity: {
        ...entity,
        connecteam_sync_status: "synced",
        connecteam_external_id: result.externalId ?? null,
        connecteam_sync_date:   syncDate,
      },
    });
  } catch (ctErr) {
    const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
    console.error(`[connecteam/send] Failed for ${entityType} ${entityId}:`, errMsg);

    await supabase.from(tableMap[entityType]).update({ connecteam_sync_status: "failed" }).eq("id", entityId);
    await supabase.from("activities").insert({
      entity_type: entityType === "appointment" || entityType === "job" ? (entity.lead_id ? "lead" : entityType) : entityType,
      entity_id:   (entityType !== "lead" && entity.lead_id) ? entity.lead_id : entityId,
      action:      "connecteam_sync_failed",
      description: `Manual Connecteam send failed for ${entityType} ${entityId}: ${errMsg}`,
      created_by:  "admin",
    });

    return NextResponse.json({
      success: false,
      error:   errMsg,
      entity:  { ...entity, connecteam_sync_status: "failed" },
    }, { status: 502 });
  }
}
