import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  isConnecteamConfigured,
  mapAppointmentToConnecteamPayload,
  createConnecteamJobOrShift,
} from "@/lib/connecteam";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("appointments")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // ── Connecteam auto-sync ─────────────────────────────────────────────────
  // Trigger when an appointment is (re-)confirmed as "scheduled" and hasn't
  // already been synced, e.g. an admin confirms a tentative appointment.
  const statusingToScheduled = body.status === "scheduled";
  const alreadySynced = data?.connecteam_sync_status === "synced";

  if (isConnecteamConfigured() && statusingToScheduled && !alreadySynced) {
    try {
      const payload = mapAppointmentToConnecteamPayload(data);
      const result  = await createConnecteamJobOrShift(payload);

      const syncDate = new Date().toISOString();
      await supabase.from("appointments").update({
        connecteam_sync_status: "synced",
        connecteam_external_id: result.externalId ?? null,
        connecteam_sync_date:   syncDate,
      }).eq("id", id);

      if (data.lead_id) {
        await supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   data.lead_id,
          action:      "connecteam_synced",
          description: `Appointment "${data.title}" confirmed & synced to Connecteam. Shift ID: ${result.externalId ?? "unknown"}`,
          created_by:  "system",
        });
      }

      data.connecteam_sync_status = "synced";
      data.connecteam_external_id = result.externalId ?? null;
      data.connecteam_sync_date   = syncDate;

      console.log(`[appointments/${id}] Connecteam sync OK — shift ${result.externalId ?? "?"}`);
    } catch (ctErr) {
      const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
      console.error(`[appointments/${id}] Connecteam sync failed:`, errMsg);

      await supabase.from("appointments").update({ connecteam_sync_status: "failed" }).eq("id", id);
      if (data.lead_id) {
        await supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   data.lead_id,
          action:      "connecteam_sync_failed",
          description: `Connecteam sync failed for appointment "${data.title}": ${errMsg}`,
          created_by:  "system",
        });
      }
      await supabase.from("notifications").insert({
        type:  "system",
        title: "Connecteam Sync Failed",
        body:  `Appointment "${data.title}" (status → scheduled) could not be synced: ${errMsg.slice(0, 200)}`,
        link:  `/api/admin/connecteam/retry`,
        read:  false,
      });

      data.connecteam_sync_status = "failed";
    }
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
