import { NextRequest, NextResponse } from "next/server";
import { getPortalCustomerFromRequest } from "@/lib/portal-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const customer = await getPortalCustomerFromRequest(req);
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin()!;

  const { data: estimates, error } = await supabase
    .from("estimates")
    .select("*, estimate_items(*)")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ estimates: estimates ?? [] });
}
