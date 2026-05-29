import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  isConnecteamConfigured,
  mapLeadToConnecteamPayload,
  createConnecteamJobOrShift,
} from "@/lib/connecteam";

// Statuses that signal "this lead is approved and ready to be scheduled"
const CONNECTEAM_AUTO_SYNC_STATUSES = ["approved", "won"] as const;

// Next.js 16: params is a Promise — must be awaited
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();
  const updates = { ...body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Activity log for status changes
  if (body.status) {
    await supabase.from("activities").insert({
      entity_type: "lead",
      entity_id:   id,
      action:      "status_changed",
      description: `Status changed to ${body.status}`,
      created_by:  "admin",
    });
  }

  // ── Connecteam auto-sync ─────────────────────────────────────────────────
  // Trigger when status moves to "approved" or "won" AND not already synced.
  // A Connecteam failure never rolls back the lead update.
  const newStatus = body.status as string | undefined;
  const alreadySynced = data?.connecteam_sync_status === "synced";
  const shouldAutoSync =
    isConnecteamConfigured() &&
    newStatus &&
    (CONNECTEAM_AUTO_SYNC_STATUSES as readonly string[]).includes(newStatus) &&
    !alreadySynced;

  let connecteamResult: { synced: boolean; externalId?: string; error?: string } = { synced: false };

  if (shouldAutoSync) {
    try {
      const payload = mapLeadToConnecteamPayload({ ...data, id });
      const result  = await createConnecteamJobOrShift(payload);

      const syncDate = new Date().toISOString();
      await supabase.from("leads").update({
        connecteam_sync_status: "synced",
        connecteam_external_id: result.externalId ?? null,
        connecteam_sync_date:   syncDate,
      }).eq("id", id);

      await supabase.from("activities").insert({
        entity_type: "lead",
        entity_id:   id,
        action:      "connecteam_synced",
        description: `Lead auto-synced to Connecteam on status → ${newStatus}. Shift ID: ${result.externalId ?? "unknown"}`,
        created_by:  "system",
      });

      // Merge sync fields into response so the CRM updates immediately
      data.connecteam_sync_status = "synced";
      data.connecteam_external_id = result.externalId ?? null;
      data.connecteam_sync_date   = syncDate;
      connecteamResult = { synced: true, externalId: result.externalId };

      console.log(`[leads/${id}] Connecteam auto-sync OK — shift ${result.externalId ?? "?"}`);
    } catch (ctErr) {
      const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
      console.error(`[leads/${id}] Connecteam auto-sync failed:`, errMsg);

      await supabase.from("leads").update({ connecteam_sync_status: "failed" }).eq("id", id);
      await supabase.from("activities").insert({
        entity_type: "lead",
        entity_id:   id,
        action:      "connecteam_sync_failed",
        description: `Connecteam auto-sync failed: ${errMsg}`,
        created_by:  "system",
      });
      await supabase.from("notifications").insert({
        type:  "system",
        title: "Connecteam Sync Failed",
        body:  `Lead ${data?.company_name ?? id} could not be synced: ${errMsg.slice(0, 200)}`,
        link:  `/api/admin/connecteam/retry`,
        read:  false,
      });

      data.connecteam_sync_status = "failed";
      connecteamResult = { synced: false, error: errMsg };
    }
  }

  return NextResponse.json({ data, connecteam: connecteamResult });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
