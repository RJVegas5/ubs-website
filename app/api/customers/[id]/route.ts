import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const [customerRes, jobsRes, estimatesRes, invoicesRes, activitiesRes] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).single(),
    supabase.from("jobs").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("estimates").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("invoices").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("activities").select("*").eq("entity_type", "customer").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  if (customerRes.error) return NextResponse.json({ error: customerRes.error.message }, { status: 404 });

  return NextResponse.json({
    data: {
      ...customerRes.data,
      jobs: jobsRes.data ?? [],
      estimates: estimatesRes.data ?? [],
      invoices: invoicesRes.data ?? [],
      activities: activitiesRes.data ?? [],
    },
  });
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
    .from("customers")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
