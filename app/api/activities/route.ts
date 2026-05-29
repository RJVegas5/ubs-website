import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entity_type");
  const entityId   = searchParams.get("entity_id");
  const limit      = parseInt(searchParams.get("limit") ?? "50", 10);

  let query = supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (entityType) query = query.eq("entity_type", entityType);
  if (entityId)   query = query.eq("entity_id", entityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const { entity_type, entity_id, action, description, created_by } = body;

  if (!entity_type || !entity_id || !action) {
    return NextResponse.json({ error: "entity_type, entity_id, action required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("activities")
    .insert({ entity_type, entity_id, action, description: description ?? action, created_by: created_by ?? "admin" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
