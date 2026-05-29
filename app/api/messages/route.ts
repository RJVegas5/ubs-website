import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customer_id");
  const leadId     = searchParams.get("lead_id");
  const unreadOnly = searchParams.get("unread") === "true";

  let query = supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(100);

  if (customerId) query = query.eq("customer_id", customerId);
  if (leadId)     query = query.eq("lead_id", leadId);
  if (unreadOnly) query = query.eq("is_read", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const { customer_id, lead_id, direction, sender_name, subject, body: msgBody } = body;

  if (!msgBody?.trim()) return NextResponse.json({ error: "body required" }, { status: 400 });

  const { data, error } = await supabase
    .from("messages")
    .insert({
      customer_id: customer_id ?? null,
      lead_id: lead_id ?? null,
      direction: direction ?? "inbound",
      sender_name: sender_name ?? null,
      subject: subject ?? null,
      body: msgBody.trim(),
      is_read: direction === "outbound", // outbound = read by default
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify CRM on inbound
  if (direction !== "outbound") {
    try {
      await supabase.from("notifications").insert({
        type: "new_message",
        title: "New Customer Message",
        body: `${sender_name ?? "Customer"}: ${subject ?? msgBody.slice(0, 80)}`,
        link: customer_id ? `/admin?view=customers&id=${customer_id}` : "/admin?view=leads",
        read: false,
      });
    } catch { /* non-critical */ }
  }

  return NextResponse.json({ message: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const { id, customer_id, is_read } = body;

  if (id) {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
  } else if (customer_id) {
    await supabase.from("messages").update({ is_read: true })
      .eq("customer_id", customer_id).eq("is_read", false);
  }

  return NextResponse.json({ success: true });
}
