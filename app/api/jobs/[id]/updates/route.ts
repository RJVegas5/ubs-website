import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data, error } = await supabase
    .from("job_updates")
    .select("*")
    .eq("job_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ updates: data ?? [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const { content, author, customer_id, is_visible_to_customer } = body;

  if (!content?.trim()) return NextResponse.json({ error: "content required" }, { status: 400 });

  const { data, error } = await supabase
    .from("job_updates")
    .insert({
      job_id: id,
      customer_id: customer_id ?? null,
      author: author ?? "UBS Team",
      content: content.trim(),
      is_visible_to_customer: is_visible_to_customer !== false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create notification for CRM
  try {
    await supabase.from("notifications").insert({
      type: "system",
      title: "Job Update Posted",
      body: `${author ?? "UBS Team"}: ${content.slice(0, 100)}`,
      read: false,
    });
  } catch { /* non-critical */ }

  return NextResponse.json({ update: data }, { status: 201 });
}
