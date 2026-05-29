import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  isConnecteamConfigured,
  mapAppointmentToConnecteamPayload,
  createConnecteamJobOrShift,
} from "@/lib/connecteam";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const month  = searchParams.get("month");  // YYYY-MM
  const status = searchParams.get("status");

  let query = supabase
    .from("appointments")
    .select("*")
    .order("start_datetime", { ascending: true });

  const leadId    = searchParams.get("lead_id");
  const customerId = searchParams.get("customer_id");

  if (month) {
    const start = `${month}-01T00:00:00Z`;
    const [y, m] = month.split("-").map(Number);
    const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
    query = query.gte("start_datetime", start).lt("start_datetime", `${nextMonth}-01T00:00:00Z`);
  }

  if (status)     query = query.eq("status", status);
  if (leadId)     query = query.eq("lead_id", leadId);
  if (customerId) query = query.eq("customer_id", customerId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();
  const appt = {
    ...body,
    status:     body.status ?? "scheduled",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("appointments")
    .insert(appt)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Internal notification
  await supabase.from("notifications").insert({
    type:  "upcoming_appointment",
    title: "New Appointment Scheduled",
    body:  `${appt.title} — ${new Date(appt.start_datetime).toLocaleDateString()}`,
    link:  `/admin?view=calendar`,
    read:  false,
  });

  // ── Connecteam auto-sync ─────────────────────────────────────────────────
  // Every appointment created via this route (i.e. by an admin in the CRM)
  // with status "scheduled" is pushed to Connecteam so the crew sees it.
  // Appointments created inside the booking wizard (via direct DB insert)
  // never hit this code path.
  if (isConnecteamConfigured() && data.status === "scheduled") {
    try {
      const payload = mapAppointmentToConnecteamPayload(data);
      const result  = await createConnecteamJobOrShift(payload);

      const syncDate = new Date().toISOString();
      await supabase.from("appointments").update({
        connecteam_sync_status: "synced",
        connecteam_external_id: result.externalId ?? null,
        connecteam_sync_date:   syncDate,
      }).eq("id", data.id);

      if (data.lead_id) {
        await supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   data.lead_id,
          action:      "connecteam_synced",
          description: `Appointment "${data.title}" synced to Connecteam. Shift ID: ${result.externalId ?? "unknown"}`,
          created_by:  "system",
        });
      }

      data.connecteam_sync_status = "synced";
      data.connecteam_external_id = result.externalId ?? null;
      data.connecteam_sync_date   = syncDate;

      console.log(`[appointments] Connecteam sync OK — shift ${result.externalId ?? "?"} for appt ${data.id}`);
    } catch (ctErr) {
      const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
      console.error(`[appointments] Connecteam sync failed:`, errMsg);

      await supabase.from("appointments").update({ connecteam_sync_status: "failed" }).eq("id", data.id);
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
        body:  `Appointment "${data.title}" could not be synced: ${errMsg.slice(0, 200)}`,
        link:  `/api/admin/connecteam/retry`,
        read:  false,
      });

      data.connecteam_sync_status = "failed";
    }
  }

  return NextResponse.json({ data }, { status: 201 });
}
