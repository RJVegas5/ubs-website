import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Save to Supabase
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("career_applications").insert({
        first_name: data.firstName ?? null,
        last_name: data.lastName ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        position: data.position ?? null,
        transport: data.transport ?? null,
        start_date: data.startDate ?? null,
        skills: data.skills ?? [],
        referred: data.referred ?? null,
        status: "new",
      });
    }
  } catch (e) {
    console.error("Supabase career error:", e);
  }

  // Email notification
  try {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          from: "UBS Careers <noreply@ultimatebuildingservices.com>",
          to: ["ultimate@prosharedservices.com"],
          subject: `👤 New Job Application: ${data.position} — ${data.firstName} ${data.lastName}`,
          text: `NEW JOB APPLICATION\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone}\nPosition: ${data.position}\nTransportation: ${data.transport}\nAvailability: ${data.startDate}\n\nSubmitted: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT`,
        }),
      });
    }
  } catch (e) {
    console.error("Email career error:", e);
  }

  return NextResponse.json({ success: true });
}
