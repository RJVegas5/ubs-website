import { NextRequest, NextResponse } from "next/server";
import { getPortalCustomerFromRequest } from "@/lib/portal-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const customer = await getPortalCustomerFromRequest(req);
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin()!;

  // Fetch summary counts
  const [
    { count: appointmentsCount },
    { count: estimatesCount },
    { count: invoicesCount },
    { count: jobsCount },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", customer.id)
      .gte("start_datetime", new Date().toISOString())
      .neq("status", "cancelled"),
    supabase
      .from("estimates")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", customer.id)
      .eq("status", "sent"),
    supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", customer.id)
      .in("status", ["sent", "partial", "overdue"]),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", customer.id),
  ]);

  return NextResponse.json({
    customer: {
      id: customer.id,
      company_name: customer.company_name,
      contact_name: customer.contact_name,
      email: customer.portal_email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zip: customer.zip,
      outstanding_balance: customer.outstanding_balance,
      lifetime_value: customer.lifetime_value,
    },
    stats: {
      upcomingAppointments: appointmentsCount ?? 0,
      pendingEstimates: estimatesCount ?? 0,
      openInvoices: invoicesCount ?? 0,
      totalJobs: jobsCount ?? 0,
    },
  });
}
