import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const [
    leadsRes,
    newLeadsRes,
    wonLeadsRes,
    estimatesRes,
    invoicesRes,
    appointmentsRes,
    recentLeadsRes,
    recentActivitiesRes,
  ] = await Promise.all([
    supabase.from("leads").select("id, estimated_value, status", { count: "exact", head: false }),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("leads").select("id, estimated_value").in("status", ["won", "approved"]),
    supabase.from("estimates").select("id, total, status").eq("status", "sent"),
    supabase.from("invoices").select("id, total, balance_due, status").neq("status", "paid").neq("status", "cancelled"),
    supabase.from("appointments").select("id", { count: "exact", head: true }).gte("start_datetime", now.toISOString()).lte("start_datetime", new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  const allLeads = leadsRes.data ?? [];
  const wonLeads = wonLeadsRes.data ?? [];
  const pendingEstimates = estimatesRes.data ?? [];
  const outstandingInvoices = invoicesRes.data ?? [];

  // Revenue from paid invoices this month
  const { data: paidInvoices } = await supabase
    .from("invoices")
    .select("total")
    .eq("status", "paid")
    .gte("updated_at", monthStart)
    .lte("updated_at", monthEnd);

  const monthlyRevenue = (paidInvoices ?? []).reduce((sum, inv) => sum + (inv.total ?? 0), 0);
  const pipelineValue = allLeads.reduce((sum, l) => sum + (l.estimated_value ?? 0), 0);
  const conversionRate = allLeads.length > 0
    ? Math.round((wonLeads.length / allLeads.length) * 100)
    : 0;

  // Lead source breakdown
  const { data: sourcesData } = await supabase
    .from("leads")
    .select("source")
    .not("source", "is", null);

  const sourceCount: Record<string, number> = {};
  (sourcesData ?? []).forEach((l) => {
    sourceCount[l.source ?? "unknown"] = (sourceCount[l.source ?? "unknown"] ?? 0) + 1;
  });

  // Service breakdown
  const { data: serviceData } = await supabase
    .from("leads")
    .select("service")
    .not("service", "is", null);

  const serviceCount: Record<string, number> = {};
  (serviceData ?? []).forEach((l) => {
    serviceCount[l.service ?? "unknown"] = (serviceCount[l.service ?? "unknown"] ?? 0) + 1;
  });

  return NextResponse.json({
    stats: {
      totalLeads: leadsRes.count ?? allLeads.length,
      newLeadsThisWeek: newLeadsRes.count ?? 0,
      pipelineValue,
      monthlyRevenue,
      jobsWon: wonLeads.length,
      conversionRate,
      pendingEstimates: pendingEstimates.length,
      outstandingInvoices: outstandingInvoices.reduce((sum, inv) => sum + (inv.balance_due ?? 0), 0),
      upcomingAppointments: appointmentsRes.count ?? 0,
    },
    recentLeads: recentLeadsRes.data ?? [],
    recentActivities: recentActivitiesRes.data ?? [],
    sourcesBreakdown: sourceCount,
    servicesBreakdown: serviceCount,
  });
}
