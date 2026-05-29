import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("estimates")
    .select("*, estimate_items(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("estimates")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If approved, create a job automatically
  if (body.status === "approved" && data.customer_id) {
    await supabase.from("jobs").insert({
      customer_id: data.customer_id,
      estimate_id: id,
      title: `Job from Estimate ${data.estimate_number}`,
      status: "scheduled",
      created_at: new Date().toISOString(),
    });

    await supabase.from("notifications").insert({
      type: "estimate_approved",
      title: "Estimate Approved",
      body: `Estimate ${data.estimate_number} was approved. A new job has been created.`,
      link: `/admin?view=jobs`,
      read: false,
    });

    await supabase.from("activities").insert({
      entity_type: "estimate",
      entity_id: id,
      action: "approved",
      description: `Estimate ${data.estimate_number} approved — job created automatically`,
      created_by: "system",
    });
  }

  return NextResponse.json({ data });
}
