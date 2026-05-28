import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Save to Supabase
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (url && key) {
      await fetch(`${url}/rest/v1/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": key, "Authorization": `Bearer ${key}`, "Prefer": "return=minimal" },
        body: JSON.stringify({ ...data, status: "new", created_at: new Date().toISOString() }),
      });
    }
  } catch (e) { console.error("Supabase:", e); }

  // Email notification
  try {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({
          from: "UBS Bookings <noreply@ultimatebuildingservices.com>",
          to: ["ultimate@prosharedservices.com"],
          subject: `🗓️ New Booking: ${data.service} — ${data.companyName}`,
          text: `NEW BOOKING REQUEST\n\nService: ${data.service}\nCompany: ${data.companyName}\nContact: ${data.contactName}\nPhone: ${data.phone}\nEmail: ${data.email}\nAddress: ${data.address}\nProperty: ${data.propertyType}\nSize: ${data.facilitySize}\nFrequency: ${data.frequency}\nDate: ${data.date}\nTime: ${data.timeSlot}\nPhotos: ${data.photos?.length || 0}\nNotes: ${data.notes}`,
        }),
      });
    }
  } catch (e) { console.error("Email:", e); }

  return NextResponse.json({ success: true });
}
