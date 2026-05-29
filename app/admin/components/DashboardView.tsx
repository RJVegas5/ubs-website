"use client";

import { useEffect, useState } from "react";
import { KpiCard, SectionHeader, StatusBadge, fmtDate, fmtRelative, fmt$, Skeleton } from "./shared";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalLeads: number;
  newLeadsThisWeek: number;
  pipelineValue: number;
  conversionRate: number;
  activeCustomers: number;
  openJobs: number;
  outstandingInvoices: number;
  upcomingAppointments: number;
  revenueByMonth: { month: string; revenue: number }[];
  leadsByStatus: { status: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  recentActivity: { id: string; action: string; description: string; entity_type: string; created_at: string }[];
  recentLeads: { id: string; company_name: string | null; first_name: string | null; last_name: string | null; service: string | null; status: string; created_at: string }[];
  staleLeads: { id: string; company_name: string | null; first_name: string | null; status: string; created_at: string }[];
  followUps: { id: string; company_name: string | null; first_name: string | null; follow_up_date: string; status: string }[];
  upcomingAppts: { id: string; title: string; start_datetime: string; status: string; contact_name: string | null }[];
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const I = {
  users:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  spark:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  dollar:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  percent:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  briefcase:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  wrench:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  invoice:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  warn:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  clock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ── Mini bar chart ────────────────────────────────────────────────────────────

function BarChart({ data, color = "#3B4FC8" }: { data: { label: string; value: number }[]; color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map(d => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full rounded-t transition-all duration-500"
            style={{ height: `${Math.max((d.value / max) * 72, 3)}px`, background: color, opacity: 0.7 }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[9px] text-white/30 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Funnel ────────────────────────────────────────────────────────────────────

const FUNNEL_ORDER = ["new", "contacted", "qualified", "site_visit", "quote_sent", "negotiating", "approved", "won"];
const FUNNEL_COLORS: Record<string, string> = {
  new: "#3B4FC8", contacted: "#6366F1", qualified: "#8B5CF6",
  site_visit: "#F59E0B", quote_sent: "#F97316", negotiating: "#EF4444",
  approved: "#10B981", won: "#10B981",
};

function FunnelChart({ data }: { data: { status: string; count: number }[] }) {
  const map = Object.fromEntries(data.map(d => [d.status, d.count]));
  const total = Math.max(map["new"] ?? 0, 1);
  return (
    <div className="space-y-1.5">
      {FUNNEL_ORDER.map(status => {
        const count = map[status] ?? 0;
        const pct = Math.round((count / total) * 100);
        const color = FUNNEL_COLORS[status] ?? "#64748B";
        return (
          <div key={status} className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider w-20 flex-shrink-0 text-right" style={{ color: "#475569" }}>
              {status.replace(/_/g, " ")}
            </span>
            <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="h-full rounded transition-all duration-700" style={{ width: `${pct}%`, background: color, opacity: 0.8 }} />
            </div>
            <span className="text-xs font-semibold w-6 text-right" style={{ color }}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Source donut-like bars ────────────────────────────────────────────────────

function SourceChart({ data }: { data: { source: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const COLORS = ["#F5C518", "#3B4FC8", "#10B981", "#F97316", "#8B5CF6", "#EF4444"];
  return (
    <div className="space-y-2">
      {data.slice(0, 6).map((d, i) => {
        const pct = Math.round((d.count / total) * 100);
        return (
          <div key={d.source} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs flex-1 capitalize" style={{ color: "#94A3B8" }}>{d.source?.replace(/_/g, " ") ?? "unknown"}</span>
            <div className="w-24 h-1.5 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
            </div>
            <span className="text-xs font-semibold w-5 text-right" style={{ color: "#64748B" }}>{d.count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Activity icon ─────────────────────────────────────────────────────────────

const ACTION_ICONS: Record<string, React.ReactNode> = {
  created:               I.spark,
  status_changed:        I.trending,
  connecteam_synced:     I.calendar,
  connecteam_sync_failed: I.warn,
  portal_message:        I.activity,
  default:               I.activity,
};

function activityIcon(action: string) {
  return ACTION_ICONS[action] ?? ACTION_ICONS.default;
}

const ACTION_COLORS: Record<string, string> = {
  created: "#3B4FC8",
  status_changed: "#F5C518",
  connecteam_synced: "#10B981",
  connecteam_sync_failed: "#EF4444",
  portal_message: "#8B5CF6",
  default: "#64748B",
};

// ── Main DashboardView ────────────────────────────────────────────────────────

export default function DashboardView({
  onNavigate,
}: {
  onNavigate: (view: string, id?: string) => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/40 text-sm">Unable to load dashboard. Check database connection.</p>
      </div>
    );
  }

  const revenueData = (stats.revenueByMonth ?? []).map(r => ({ label: r.month, value: r.revenue }));

  return (
    <div className="space-y-8">

      {/* ── Row 1: KPI cards ── */}
      <div>
        <SectionHeader title="Overview" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <KpiCard label="Total Leads"          value={stats.totalLeads}          icon={I.users}    accent="#3B4FC8"  onClick={() => onNavigate("leads")} />
          <KpiCard label="New This Week"         value={stats.newLeadsThisWeek}    icon={I.spark}    accent="#F5C518"  onClick={() => onNavigate("leads")} />
          <KpiCard label="Pipeline Value"        value={fmt$(stats.pipelineValue)} icon={I.dollar}   accent="#10B981"  onClick={() => onNavigate("leads")} />
          <KpiCard label="Conversion Rate"       value={`${stats.conversionRate}%`} icon={I.percent} accent="#8B5CF6" />
          <KpiCard label="Active Customers"      value={stats.activeCustomers}     icon={I.briefcase} accent="#F97316" onClick={() => onNavigate("customers")} />
          <KpiCard label="Open Jobs"             value={stats.openJobs}            icon={I.wrench}   accent="#3B4FC8"  onClick={() => onNavigate("jobs")} />
          <KpiCard label="Outstanding Invoices"  value={stats.outstandingInvoices} icon={I.invoice}  accent="#EF4444"  onClick={() => onNavigate("invoices")} />
          <KpiCard label="Upcoming Appointments" value={stats.upcomingAppointments} icon={I.calendar} accent="#10B981" onClick={() => onNavigate("calendar")} />
        </div>
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Revenue */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="Revenue (Last 6 Months)" />
          {revenueData.length > 0
            ? <BarChart data={revenueData} color="#F5C518" />
            : <p className="text-xs text-white/20 text-center py-8">No revenue data yet</p>}
        </div>

        {/* Lead Funnel */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="Lead Funnel" />
          {stats.leadsByStatus.length > 0
            ? <FunnelChart data={stats.leadsByStatus} />
            : <p className="text-xs text-white/20 text-center py-8">No leads yet</p>}
        </div>

        {/* Lead Sources */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="Lead Sources" />
          {stats.leadsBySource.length > 0
            ? <SourceChart data={stats.leadsBySource} />
            : <p className="text-xs text-white/20 text-center py-8">No source data yet</p>}
        </div>

        {/* Upcoming appointments */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="Upcoming Appointments"
            action={<button onClick={() => onNavigate("calendar")} className="text-xs" style={{ color: "#F5C518" }}>View all →</button>} />
          {stats.upcomingAppts.length === 0
            ? <p className="text-xs text-white/20 text-center py-8">No upcoming appointments</p>
            : (
              <div className="space-y-2">
                {stats.upcomingAppts.slice(0, 5).map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#3B4FC8" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{a.title}</div>
                      <div className="text-[11px]" style={{ color: "#475569" }}>{a.contact_name} · {fmtDate(a.start_datetime)}</div>
                    </div>
                    <StatusBadge status={a.status} size="xs" />
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* ── Row 3: New leads + Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* New leads */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="New Leads"
            action={<button onClick={() => onNavigate("leads")} className="text-xs" style={{ color: "#F5C518" }}>View all →</button>} />
          {stats.recentLeads.length === 0
            ? <p className="text-xs text-white/20 text-center py-8">No leads yet</p>
            : (
              <div className="space-y-2">
                {stats.recentLeads.slice(0, 6).map(l => {
                  const name = l.company_name || [l.first_name, l.last_name].filter(Boolean).join(" ") || "Unknown";
                  return (
                    <button key={l.id} onClick={() => onNavigate("leads", l.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.03]">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(59,79,200,0.2)", color: "#93A3F8" }}>
                        {name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{name}</div>
                        <div className="text-[11px]" style={{ color: "#475569" }}>{l.service} · {fmtRelative(l.created_at)}</div>
                      </div>
                      <StatusBadge status={l.status} size="xs" />
                    </button>
                  );
                })}
              </div>
            )}
        </div>

        {/* Recent Activity */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="Recent Activity" />
          {stats.recentActivity.length === 0
            ? <p className="text-xs text-white/20 text-center py-8">No activity yet</p>
            : (
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 8).map(a => (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${ACTION_COLORS[a.action] ?? "#64748B"}20`, color: ACTION_COLORS[a.action] ?? "#64748B" }}>
                      <div className="w-3 h-3">{activityIcon(a.action)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 leading-snug truncate">{a.description}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#475569" }}>{fmtRelative(a.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* ── Row 4: Insights ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Follow-ups needed */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="Follow-Ups Due"
            action={stats.followUps.length > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,197,24,0.15)", color: "#F5C518" }}>
                {stats.followUps.length}
              </span>
            ) : undefined} />
          {stats.followUps.length === 0
            ? <p className="text-xs text-white/20 text-center py-6">All caught up!</p>
            : (
              <div className="space-y-2">
                {stats.followUps.slice(0, 5).map(l => {
                  const name = l.company_name || l.first_name || "Lead";
                  const overdue = new Date(l.follow_up_date) < new Date();
                  return (
                    <button key={l.id} onClick={() => onNavigate("leads", l.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.03]">
                      <div className="w-5 h-5 flex-shrink-0" style={{ color: overdue ? "#EF4444" : "#F5C518" }}>{I.clock}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{name}</div>
                        <div className="text-[11px]" style={{ color: overdue ? "#FCA5A5" : "#475569" }}>
                          {overdue ? "Overdue — " : ""}{fmtDate(l.follow_up_date)}
                        </div>
                      </div>
                      <StatusBadge status={l.status} size="xs" />
                    </button>
                  );
                })}
              </div>
            )}
        </div>

        {/* Stale Leads */}
        <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader title="Stale Leads (48h+)"
            action={stats.staleLeads.length > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5" }}>
                {stats.staleLeads.length}
              </span>
            ) : undefined} />
          {stats.staleLeads.length === 0
            ? <p className="text-xs text-white/20 text-center py-6">No stale leads</p>
            : (
              <div className="space-y-2">
                {stats.staleLeads.slice(0, 5).map(l => {
                  const name = l.company_name || l.first_name || "Lead";
                  return (
                    <button key={l.id} onClick={() => onNavigate("leads", l.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.03]">
                      <div className="w-5 h-5 flex-shrink-0" style={{ color: "#EF4444" }}>{I.warn}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{name}</div>
                        <div className="text-[11px]" style={{ color: "#475569" }}>No contact since {fmtRelative(l.created_at)}</div>
                      </div>
                      <StatusBadge status={l.status} size="xs" />
                    </button>
                  );
                })}
              </div>
            )}
        </div>
      </div>

    </div>
  );
}
