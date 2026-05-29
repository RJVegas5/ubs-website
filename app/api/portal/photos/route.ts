import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getPortalCustomerFromHeaders } from "@/lib/portal-auth";

export async function GET() {
  const customer = await getPortalCustomerFromHeaders();
  if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customerId = customer.id;

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data, error } = await supabase
    .from("job_photos")
    .select("*, jobs(title, service, status)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photos: data ?? [] });
}
