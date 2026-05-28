import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  // ── Supabase insert ──────────────────────────────────────────────────────
  // To enable: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel
  // Then create table "leads" in Supabase with columns matching the fields below
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          service: data.service || null,
          building_type: data.buildingType || null,
          sq_footage: data.sqFootage || null,
          frequency: data.frequency || null,
          first_name: data.firstName || null,
          last_name: data.lastName || null,
          business_name: data.businessName || null,
          email: data.email || null,
          phone: data.phone || null,
          notes: data.notes || null,
          created_at: new Date().toISOString(),
          status: "new",
        }),
      });
    }
  } catch (e) {
    console.error("Supabase error:", e);
  }

  // ── Email notification via Resend ─────────────────────────────────────────
  // To enable: set RESEND_API_KEY in Vercel env vars
  // Sign up free at resend.com
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const emailBody = `
NEW QUOTE REQUEST - Ultimate Building Services

Service: ${data.service}
Building Type: ${data.buildingType}
Square Footage: ${data.sqFootage}
Frequency: ${data.frequency}

Contact:
Name: ${data.firstName} ${data.lastName}
Business: ${data.businessName}
Email: ${data.email}
Phone: ${data.phone}

Notes: ${data.notes || "None"}

Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT
      `.trim();

      // Notify owner
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: "UBS Website <noreply@ultimatebuildingservices.com>",
          to: ["ultimate@prosharedservices.com"],
          subject: `🔔 New Quote Request: ${data.service} — ${data.firstName} ${data.lastName}`,
          text: emailBody,
        }),
      });

      // Auto-confirm to customer
      if (data.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: "Ultimate Building Services <noreply@ultimatebuildingservices.com>",
            to: [data.email],
            subject: "We received your quote request — Ultimate Building Services",
            html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0D0F1E;color:white;padding:40px;border-top:3px solid #F5C518;">
  <img src="https://ultimatebuildingservices.com/logo.png" alt="UBS" style="height:60px;margin-bottom:24px;" />
  <h1 style="font-size:28px;color:white;margin-bottom:8px;">Thanks, ${data.firstName}!</h1>
  <p style="color:rgba(255,255,255,0.6);font-size:16px;line-height:1.6;">We received your quote request for <strong style="color:#F5C518">${data.service}</strong> and will get back to you within <strong style="color:#F5C518">2 business hours</strong>.</p>
  <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(245,197,24,0.2);padding:20px;margin:24px 0;border-radius:4px;">
    <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:4px;">YOUR REQUEST SUMMARY</p>
    <p style="color:white;margin:4px 0;"><strong>Service:</strong> ${data.service}</p>
    <p style="color:white;margin:4px 0;"><strong>Building Type:</strong> ${data.buildingType || "TBD"}</p>
    <p style="color:white;margin:4px 0;"><strong>Frequency:</strong> ${data.frequency || "TBD"}</p>
  </div>
  <p style="color:rgba(255,255,255,0.5);font-size:14px;">Need to reach us sooner?</p>
  <a href="tel:7027952855" style="color:#F5C518;font-size:22px;font-weight:bold;text-decoration:none;">(702) 795-2855</a>
  <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:32px;">Ultimate Building Services, Inc. · 2645 Sorrel St., Las Vegas NV 89146 · NV Lic #91170</p>
</div>`,
          }),
        });
      }
    }
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ success: true });
}
