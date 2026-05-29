import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") ?? "100");

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status && status !== "all") query = query.eq("status", status);
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%,service.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();
  const now = new Date().toISOString();

  const lead = {
    first_name: body.first_name ?? body.firstName ?? null,
    last_name: body.last_name ?? body.lastName ?? null,
    company_name: body.company_name ?? body.businessName ?? body.companyName ?? null,
    email: body.email ?? null,
    phone: body.phone ?? null,
    address: body.address ?? null,
    service: body.service ?? null,
    building_type: body.building_type ?? body.buildingType ?? null,
    sq_footage: body.sq_footage ?? body.sqFootage ?? null,
    frequency: body.frequency ?? null,
    notes: body.notes ?? null,
    status: "new",
    source: body.source ?? "website",
    estimated_value: body.estimated_value ?? null,
    created_at: now,
    updated_at: now,
    converted_to_customer: false,
  };

  const { data, error } = await supabase.from("leads").insert(lead).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create notification
  await supabase.from("notifications").insert({
    type: "new_lead",
    title: "New Lead",
    body: `${lead.company_name ?? `${lead.first_name ?? ""} ${lead.last_name ?? ""}`} requested info about ${lead.service ?? "services"}`,
    link: `/admin?view=leads&id=${data.id}`,
    read: false,
  });

  // Log activity
  await supabase.from("activities").insert({
    entity_type: "lead",
    entity_id: data.id,
    action: "created",
    description: `Lead created from ${lead.source}`,
    created_by: "system",
  });

  return NextResponse.json({ data }, { status: 201 });
}
