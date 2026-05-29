import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // YYYY-MM
  const status = searchParams.get("status");

  let query = supabase
    .from("appointments")
    .select("*")
    .order("start_datetime", { ascending: true });

  if (month) {
    const start = `${month}-01T00:00:00Z`;
    const [y, m] = month.split("-").map(Number);
    const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
    const end = `${nextMonth}-01T00:00:00Z`;
    query = query.gte("start_datetime", start).lt("start_datetime", end);
  }

  if (status) query = query.eq("status", status);

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
    status: body.status ?? "scheduled",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("appointments")
    .insert(appt)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notification
  await supabase.from("notifications").insert({
    type: "upcoming_appointment",
    title: "New Appointment Scheduled",
    body: `${appt.title} — ${new Date(appt.start_datetime).toLocaleDateString()}`,
    link: `/admin?view=calendar`,
    read: false,
  });

  return NextResponse.json({ data }, { status: 201 });
}
