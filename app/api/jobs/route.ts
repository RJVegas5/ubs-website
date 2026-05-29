import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  isConnecteamConfigured,
  mapJobToConnecteamPayload,
  createConnecteamJobOrShift,
} from "@/lib/connecteam";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("jobs")
    .select("*, customers(company_name, contact_name, phone)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();
  const job = {
    ...body,
    status:     body.status ?? "scheduled",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("jobs").insert(job).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // ── Connecteam auto-sync ─────────────────────────────────────────────────
  // A job represents committed, approved work — sync it to Connecteam
  // immediately so the crew can see it on their schedule.
  if (isConnecteamConfigured()) {
    try {
      // Fetch the customer name if we have a customer_id
      let customerName: string | null = null;
      if (data.customer_id) {
        const { data: customer } = await supabase
          .from("customers")
          .select("company_name, contact_name")
          .eq("id", data.customer_id)
          .single();
        customerName = customer?.company_name ?? customer?.contact_name ?? null;
      }

      const payload = mapJobToConnecteamPayload(data, customerName);
      const result  = await createConnecteamJobOrShift(payload);

      const syncDate = new Date().toISOString();
      await supabase.from("jobs").update({
        connecteam_sync_status: "synced",
        connecteam_external_id: result.externalId ?? null,
        connecteam_sync_date:   syncDate,
      }).eq("id", data.id);

      // Log against lead if linked; fall back to a job-level activity
      const actEntityType = data.lead_id ? "lead" : "job";
      const actEntityId   = data.lead_id ?? data.id;
      await supabase.from("activities").insert({
        entity_type: actEntityType,
        entity_id:   actEntityId,
        action:      "connecteam_synced",
        description: `Job "${data.title}" synced to Connecteam on creation. Shift ID: ${result.externalId ?? "unknown"}`,
        created_by:  "system",
      });

      data.connecteam_sync_status = "synced";
      data.connecteam_external_id = result.externalId ?? null;
      data.connecteam_sync_date   = syncDate;

      console.log(`[jobs] Connecteam sync OK — shift ${result.externalId ?? "?"} for job ${data.id}`);
    } catch (ctErr) {
      const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
      console.error(`[jobs] Connecteam sync failed:`, errMsg);

      await supabase.from("jobs").update({ connecteam_sync_status: "failed" }).eq("id", data.id);

      const actEntityType = data.lead_id ? "lead" : "job";
      const actEntityId   = data.lead_id ?? data.id;
      await supabase.from("activities").insert({
        entity_type: actEntityType,
        entity_id:   actEntityId,
        action:      "connecteam_sync_failed",
        description: `Connecteam sync failed for job "${data.title}": ${errMsg}`,
        created_by:  "system",
      });
      await supabase.from("notifications").insert({
        type:  "system",
        title: "Connecteam Sync Failed",
        body:  `Job "${data.title}" could not be synced: ${errMsg.slice(0, 200)}`,
        link:  `/api/admin/connecteam/retry`,
        read:  false,
      });

      data.connecteam_sync_status = "failed";
    }
  }

  return NextResponse.json({ data }, { status: 201 });
}
