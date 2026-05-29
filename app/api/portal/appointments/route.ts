import { NextRequest, NextResponse } from "next/server";
import { getPortalCustomerFromRequest } from "@/lib/portal-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const customer = await getPortalCustomerFromRequest(req);
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin()!;

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("customer_id", customer.id)
    .order("start_datetime", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ appointments: data ?? [] });
}
