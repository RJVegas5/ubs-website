import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const now        = new Date();
  const weekAgo    = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const in7Days    = new Date(now.getTime() + 7  * 24 * 60 * 60 * 1000).toISOString();

  const [
    leadsRes,
    newLeadsRes,
    wonLeadsRes,
    invoicesRes,
    customersRes,
    openJobsRes,
    apptCountRes,
    recentLeadsRes,
    activitiesRes,
    staleLeadsRes,
    followUpsRes,
    upcomingApptsRes,
  ] = await Promise.all([
    supabase.from("leads").select("id, estimated_value, status, created_at"),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("leads").select("id, estimated_value").in("status", ["won", "approved"]),
    supabase.from("invoices").select("id, total, balance_due, status"),
    supabase.from("customers").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("jobs").select("id", { count: "exact", head: true }).in("status", ["scheduled", "in_progress", "assigned"]),
    supabase.from("appointments").select("id", { count: "exact", head: true })
      .gte("start_datetime", now.toISOString()).lte("start_datetime", in7Days),
    supabase.from("leads")
      .select("id, company_name, first_name, last_name, service, status, estimated_value, source, created_at, email, phone")
      .order("created_at", { ascending: false }).limit(8),
    supabase.from("activities")
      .select("id, action, description, entity_type, created_at")
      .order("created_at", { ascending: false }).limit(15),
    supabase.from("leads")
      .select("id, company_name, first_name, last_name, service, status, created_at, phone, email")
      .eq("status", "new").lt("created_at", twoDaysAgo)
      .order("created_at", { ascending: false }).limit(10),
    supabase.from("leads")
      .select("id, company_name, first_name, last_name, service, status, follow_up_date, phone, email")
      .not("follow_up_date", "is", null)
      .lte("follow_up_date", in7Days)
      .neq("status", "won").neq("status", "lost")
      .order("follow_up_date", { ascending: true }).limit(10),
    supabase.from("appointments")
      .select("id, title, type, status, contact_name, company_name, start_datetime")
      .gte("start_datetime", now.toISOString()).lte("start_datetime", in7Days)
      .order("start_datetime", { ascending: true }).limit(8),
  ]);

  const allLeads            = leadsRes.data ?? [];
  const wonLeads            = wonLeadsRes.data ?? [];
  const allInvoices         = invoicesRes.data ?? [];
  const outstandingInvoices = allInvoices.filter(i => i.status !== "paid" && i.status !== "cancelled");

  // Revenue by month (last 6 months)
  const { data: revenueData } = await supabase
    .from("invoices")
    .select("total, updated_at")
    .eq("status", "paid")
    .gte("updated_at", new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString());

  const revenueByMonthMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    revenueByMonthMap[key] = 0;
  }
  (revenueData ?? []).forEach(inv => {
    if (!inv.updated_at) return;
    const d   = new Date(inv.updated_at);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    if (key in revenueByMonthMap) revenueByMonthMap[key] += inv.total ?? 0;
  });

  // Monthly revenue this month
  const { data: paidThisMonth } = await supabase
    .from("invoices").select("total").eq("status", "paid")
    .gte("updated_at", monthStart).lte("updated_at", monthEnd);
  const monthlyRevenue = (paidThisMonth ?? []).reduce((s, i) => s + (i.total ?? 0), 0);

  // Lead by status
  const statusCount: Record<string, number> = {};
  allLeads.forEach(l => { statusCount[l.status] = (statusCount[l.status] ?? 0) + 1; });

  // Lead by source
  const { data: sourceRows } = await supabase.from("leads").select("source").not("source", "is", null);
  const sourceCount: Record<string, number> = {};
  (sourceRows ?? []).forEach(l => { sourceCount[l.source!] = (sourceCount[l.source!] ?? 0) + 1; });

  const pipelineValue  = allLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0);
  const conversionRate = allLeads.length > 0 ? Math.round((wonLeads.length / allLeads.length) * 100) : 0;
  const outstandingAR  = outstandingInvoices.reduce((s, i) => s + (i.balance_due ?? 0), 0);

  // Flat shape that DashboardView reads directly
  return NextResponse.json({
    // KPI numbers
    totalLeads:           allLeads.length,
    newLeadsThisWeek:     newLeadsRes.count ?? 0,
    pipelineValue,
    conversionRate,
    activeCustomers:      customersRes.count ?? 0,
    openJobs:             openJobsRes.count ?? 0,
    outstandingInvoices:  outstandingAR,
    upcomingAppointments: apptCountRes.count ?? 0,
    // Charts
    revenueByMonth: Object.entries(revenueByMonthMap).map(([month, revenue]) => ({ month, revenue })),
    leadsByStatus:  Object.entries(statusCount).map(([status, count]) => ({ status, count })),
    leadsBySource:  Object.entries(sourceCount).map(([source, count]) => ({ source, count })),
    // Lists
    recentLeads:    recentLeadsRes.data ?? [],
    recentActivity: activitiesRes.data ?? [],
    staleLeads:     staleLeadsRes.data ?? [],
    followUps:      followUpsRes.data ?? [],
    upcomingAppts:  upcomingApptsRes.data ?? [],
    // Legacy compat for old admin page
    stats: {
      totalLeads: allLeads.length,
      newLeadsThisWeek: newLeadsRes.count ?? 0,
      pipelineValue,
      monthlyRevenue,
      jobsWon: wonLeads.length,
      conversionRate,
      pendingEstimates: 0,
      outstandingInvoices: outstandingAR,
      upcomingAppointments: apptCountRes.count ?? 0,
    },
    recentActivities: activitiesRes.data ?? [],
    sourcesBreakdown: sourceCount,
    servicesBreakdown: {},
  });
}
