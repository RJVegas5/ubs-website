import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  isConnecteamConfigured,
  mapBookingToConnecteamPayload,
  createConnecteamJobOrShift,
} from "@/lib/connecteam";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const supabase = getSupabaseAdmin();
  let bookingId: string | null = null;
  let leadId: string | null = null;

  // ── 1. Save booking ─────────────────────────────────────────────────────────
  if (supabase) {
    try {
      const { data: bookingRow } = await supabase
        .from("bookings")
        .insert({
          service:        data.service        ?? null,
          company_name:   data.companyName    ?? null,
          contact_name:   data.contactName    ?? null,
          phone:          data.phone          ?? null,
          email:          data.email          ?? null,
          address:        data.address        ?? null,
          property_type:  data.propertyType   ?? null,
          facility_size:  data.facilitySize   ?? null,
          frequency:      data.frequency      ?? null,
          date:           data.date           ?? null,
          time_slot:      data.timeSlot       ?? null,
          instructions:   data.instructions   ?? null,
          notes:          data.notes          ?? null,
          photos:         data.photos         ?? [],
          status:         "new",
          // Connecteam sync will run after all other steps
          connecteam_sync_status: isConnecteamConfigured() ? "pending" : "disabled",
          connecteam_external_id: null,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      bookingId = bookingRow?.id ?? null;
    } catch (e) {
      console.error("[booking] Booking insert:", e);
    }

    // ── 2. Create CRM lead ────────────────────────────────────────────────────
    try {
      const { data: leadRow } = await supabase
        .from("leads")
        .insert({
          first_name:             null,
          last_name:              data.contactName    ?? null,
          company_name:           data.companyName    ?? null,
          email:                  data.email          ?? null,
          phone:                  data.phone          ?? null,
          address:                data.address        ?? null,
          service:                data.service        ?? null,
          building_type:          data.propertyType   ?? null,
          sq_footage:             data.facilitySize   ?? null,
          frequency:              data.frequency      ?? null,
          notes: [data.instructions, data.notes].filter(Boolean).join("\n") || null,
          status:                 "new",
          source:                 "booking_wizard",
          created_at:             new Date().toISOString(),
          updated_at:             new Date().toISOString(),
          converted_to_customer:  false,
        })
        .select("id")
        .single();

      leadId = leadRow?.id ?? null;

      // Link booking → lead
      if (bookingId && leadId) {
        await supabase
          .from("bookings")
          .update({ lead_id: leadId })
          .eq("id", bookingId);
      }
    } catch (e) {
      console.error("[booking] Lead create:", e);
    }

    // ── 3. Create calendar appointment (only when a date was provided) ────────
    if (data.date) {
      try {
        const timeMap: Record<string, string> = {
          morning:   "09:00:00",
          afternoon: "13:00:00",
          evening:   "18:00:00",
        };
        const startTime = timeMap[data.timeSlot as string] ?? "09:00:00";

        await supabase.from("appointments").insert({
          title: `${data.service ?? "Service Request"} — ${data.companyName ?? data.contactName ?? "New Client"}`,
          type:          "estimate",
          status:        "scheduled",
          lead_id:       leadId,
          contact_name:  data.contactName ?? null,
          company_name:  data.companyName ?? null,
          phone:         data.phone       ?? null,
          email:         data.email       ?? null,
          address:       data.address     ?? null,
          service:       data.service     ?? null,
          start_datetime: `${data.date}T${startTime}Z`,
          notes:         data.notes       ?? null,
          created_at:    new Date().toISOString(),
        });
      } catch (e) {
        console.error("[booking] Appointment create:", e);
      }
    }

    // ── 4. Internal notification ──────────────────────────────────────────────
    try {
      await supabase.from("notifications").insert({
        type:  "new_booking",
        title: "New Booking Request",
        body:  `${data.companyName ?? data.contactName ?? "New client"} booked ${data.service ?? "a service"}${data.date ? ` for ${data.date}` : ""}`,
        link:  leadId ? `/admin?view=leads&id=${leadId}` : "/admin?view=leads",
        read:  false,
      });
    } catch (e) {
      console.error("[booking] Notification:", e);
    }

    // ── 5. Activity log ───────────────────────────────────────────────────────
    if (leadId) {
      try {
        await supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   leadId,
          action:      "created",
          description: "Lead created via booking wizard",
          created_by:  "system",
        });
      } catch (e) {
        console.error("[booking] Activity:", e);
      }
    }
  }

  // ── 6. Email notification (Resend) ──────────────────────────────────────────
  try {
    const emailKey = process.env.RESEND_API_KEY;
    if (emailKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${emailKey}` },
        body: JSON.stringify({
          from:    "UBS Bookings <noreply@ultimatebuildingservices.com>",
          to:      ["ultimate@prosharedservices.com"],
          subject: `New Booking: ${data.service} — ${data.companyName}`,
          text:    `NEW BOOKING REQUEST\n\nService: ${data.service}\nCompany: ${data.companyName}\nContact: ${data.contactName}\nPhone: ${data.phone}\nEmail: ${data.email}\nAddress: ${data.address}\nProperty: ${data.propertyType}\nSize: ${data.facilitySize}\nFrequency: ${data.frequency}\nDate: ${data.date}\nTime: ${data.timeSlot}\nNotes: ${data.notes}\n\nBooking ID: ${bookingId}\nCRM Lead ID: ${leadId}`,
        }),
      });

      // Auto-confirm to customer
      if (data.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${emailKey}` },
          body: JSON.stringify({
            from:    "Ultimate Building Services <noreply@ultimatebuildingservices.com>",
            to:      [data.email],
            subject: "Booking Request Received — Ultimate Building Services",
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0D0F1E;color:white;padding:40px;border-top:3px solid #F5C518;">
  <img src="https://ultimatebuildingservices.com/logo.png" alt="UBS" style="height:60px;margin-bottom:24px;" />
  <h1 style="color:white;font-size:28px;">Booking Request Received!</h1>
  <p style="color:rgba(255,255,255,0.7);line-height:1.6;">Thank you, <strong style="color:#F5C518">${data.contactName ?? data.companyName}</strong>! We received your booking request for <strong style="color:#F5C518">${data.service}</strong>.</p>
  <p style="color:rgba(255,255,255,0.7);">Our team will contact you within <strong style="color:#F5C518">2 business hours</strong> to confirm your appointment and provide a custom quote.</p>
  ${data.date ? `<p style="color:rgba(255,255,255,0.7);">Requested date: <strong style="color:white">${data.date}</strong> (${data.timeSlot ?? "flexible"})</p>` : ""}
  <p style="color:rgba(255,255,255,0.5);font-size:14px;margin-top:32px;">Questions? Call us at <a href="tel:7027952855" style="color:#F5C518;">(702) 795-2855</a></p>
  <p style="color:rgba(255,255,255,0.3);font-size:12px;">Ultimate Building Services, Inc. · 2645 Sorrel St., Las Vegas NV 89146 · NV Lic #91170</p>
</div>`,
          }),
        });
      }
    }
  } catch (e) {
    console.error("[booking] Email:", e);
  }

  // ── 7. Connecteam sync ───────────────────────────────────────────────────────
  // Always runs AFTER the booking is safely stored locally.
  // A Connecteam failure NEVER fails the overall booking response.
  if (isConnecteamConfigured() && supabase && bookingId) {
    try {
      const ctPayload = mapBookingToConnecteamPayload({
        service:      data.service      ?? null,
        companyName:  data.companyName  ?? null,
        contactName:  data.contactName  ?? null,
        phone:        data.phone        ?? null,
        email:        data.email        ?? null,
        address:      data.address      ?? null,
        date:         data.date         ?? null,
        timeSlot:     data.timeSlot     ?? null,
        notes:        data.notes        ?? null,
        instructions: data.instructions ?? null,
        bookingId,
        leadId,
      });

      const result = await createConnecteamJobOrShift(ctPayload);

      // Mark synced + store external shift ID
      await supabase
        .from("bookings")
        .update({
          connecteam_sync_status: "synced",
          connecteam_external_id: result.externalId ?? null,
        })
        .eq("id", bookingId);

      // Activity: success
      if (leadId) {
        await Promise.resolve(supabase.from("activities").insert({
          entity_type: "lead",
          entity_id:   leadId,
          action:      "connecteam_synced",
          description: `Booking synced to Connecteam. Shift ID: ${result.externalId ?? "unknown"}`,
          created_by:  "system",
        })).catch(() => {});
      }

      console.log(`[booking] Connecteam sync OK — shift ${result.externalId ?? "?"} for booking ${bookingId}`);
    } catch (ctErr) {
      const errMsg = ctErr instanceof Error ? ctErr.message : String(ctErr);
      console.error("[booking] Connecteam sync failed:", errMsg);

      // Mark failed — booking is still saved; admin can retry
      await Promise.resolve(
        supabase.from("bookings").update({ connecteam_sync_status: "failed" }).eq("id", bookingId)
      ).catch(() => {});

      // Activity: failure (attached to lead if available)
      const actTarget = leadId ?? bookingId;
      await Promise.resolve(supabase.from("activities").insert({
        entity_type: "lead",
        entity_id:   actTarget,
        action:      "connecteam_sync_failed",
        description: `Connecteam sync failed for booking ${bookingId}: ${errMsg}`,
        created_by:  "system",
      })).catch(() => {});

      // Notification: surface this in the admin dashboard
      await Promise.resolve(supabase.from("notifications").insert({
        type:  "system",
        title: "Connecteam Sync Failed",
        body:  `Booking ${bookingId} (${data.companyName ?? data.contactName ?? "new client"}) could not be synced to Connecteam: ${errMsg.slice(0, 200)}`,
        link:  `/api/admin/connecteam/retry`,
        read:  false,
      })).catch(() => {});
    }
  } else if (!isConnecteamConfigured() && supabase && bookingId) {
    // CONNECTEAM_ENABLED is false/missing — already marked "disabled" on insert,
    // but log it clearly so it's obvious in dev.
    console.log("[booking] Connecteam disabled — booking saved locally only.");
  }

  return NextResponse.json({ success: true, leadId, bookingId });
}
