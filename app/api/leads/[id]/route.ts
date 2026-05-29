import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  isConnecteamConfigured,
  mapLeadToConnecteamPayload,
  createConnecteamJobOrShift,
} from "@/lib/connecteam";
import { generateTempPassword, sendPortalWelcomeEmail } from "@/lib/email";

// Statuses that signal "this lead is approved and ready to be scheduled"
const CONNECTEAM_AUTO_SYNC_STATUSES = ["approved", "won"] as const;

// ── GET ───────────────────────────────────────────────────────────────────────

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

// ── PATCH ─────────────────────────────────────────────────────────────────────

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

  // ── Auto-convert to customer on "approved" ────────────────────────────────
  // Runs once per lead — skips if already converted.
  const newStatus        = body.status as string | undefined;
  const alreadyConverted = data?.converted_to_customer === true;

  let customerResult: {
    created: boolean;
    customerId?: string | number;
    emailSent?: boolean;
    emailError?: string;
  } = { created: false };

  if (newStatus === "approved" && !alreadyConverted) {
    try {
      // 1. Build customer record from lead
      const tempPassword = generateTempPassword();
      const portalEmail  = data.email?.toLowerCase().trim() ?? null;

      const customerPayload = {
        company_name:          data.company_name,
        contact_name:          [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
        email:                 data.email,
        phone:                 data.phone,
        address:               data.address,
        building_type:         data.building_type,
        notes:                 data.notes,
        is_active:             true,
        lifetime_value:        0,
        outstanding_balance:   0,
        // Portal credentials (only if they have an email)
        portal_email:          portalEmail,
        portal_password_hash:  portalEmail ? tempPassword : null,
        created_at:            new Date().toISOString(),
      };

      const { data: customer, error: custErr } = await supabase
        .from("customers")
        .insert(customerPayload)
        .select()
        .single();

      if (custErr) throw new Error(`Customer insert failed: ${custErr.message}`);

      // 2. Mark lead as converted
      await supabase.from("leads").update({
        converted_to_customer: true,
        customer_id:           String(customer.id),
        updated_at:            new Date().toISOString(),
      }).eq("id", id);

      // Propagate to the returned data object
      data.converted_to_customer = true;
      data.customer_id           = String(customer.id);

      // 3. Activity log
      await supabase.from("activities").insert({
        entity_type: "lead",
        entity_id:   id,
        action:      "converted_to_customer",
        description: `Lead approved and converted to customer (ID: ${customer.id})${portalEmail ? ". Portal access created." : "."}`,
        created_by:  "system",
      });

      // 4. CRM notification
      await supabase.from("notifications").insert({
        type:  "new_lead",
        title: "Lead Converted to Customer",
        body:  `${data.company_name ?? data.first_name ?? "Lead"} has been approved and converted to a customer.`,
        link:  `/admin?view=customers`,
        read:  false,
      });

      customerResult = { created: true, customerId: customer.id };

      // 5. Send portal welcome email (only if they have an email address)
      if (portalEmail) {
        const emailResult = await sendPortalWelcomeEmail({
          contactName:  customer.contact_name,
          companyName:  customer.company_name,
          portalEmail,
          tempPassword,
        });

        customerResult.emailSent  = emailResult.sent;
        customerResult.emailError = emailResult.error;

        await supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   id,
          action:      emailResult.sent ? "portal_welcome_sent" : "portal_welcome_failed",
          description: emailResult.sent
            ? `Portal welcome email sent to ${portalEmail}`
            : `Portal welcome email failed: ${emailResult.error ?? "unknown"}`,
          created_by: "system",
        });
      }

      console.log(`[leads/${id}] Auto-converted to customer ${customer.id}; email=${customerResult.emailSent}`);
    } catch (convErr) {
      const msg = convErr instanceof Error ? convErr.message : String(convErr);
      console.error(`[leads/${id}] Auto-convert failed:`, msg);

      await supabase.from("activities").insert({
        entity_type: "lead",
        entity_id:   id,
        action:      "conversion_failed",
        description: `Auto-conversion to customer failed: ${msg}`,
        created_by:  "system",
      });

      customerResult = { created: false, emailError: msg };
    }
  }

  // ── Connecteam auto-sync ──────────────────────────────────────────────────
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

  return NextResponse.json({ data, connecteam: connecteamResult, customer: customerResult });
}

// ── DELETE ────────────────────────────────────────────────────────────────────

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
