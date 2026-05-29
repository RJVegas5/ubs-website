"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import type { Lead, Notification, Appointment, Customer, Job, Estimate, Invoice } from "@/lib/types";

// ── Constants ─────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { id: "new", label: "New Lead", color: "#F5C518", bg: "rgba(245,197,24,0.15)" },
  { id: "contacted", label: "Contacted", color: "#60A5FA", bg: "rgba(96,165,250,0.15)" },
  { id: "qualified", label: "Qualified", color: "#A78BFA", bg: "rgba(167,139,250,0.15)" },
  { id: "site_visit_scheduled", label: "Site Visit", color: "#FB923C", bg: "rgba(251,146,60,0.15)" },
  { id: "quote_sent", label: "Quote Sent", color: "#F97316", bg: "rgba(249,115,22,0.15)" },
  { id: "negotiating", label: "Negotiating", color: "#EC4899", bg: "rgba(236,72,153,0.15)" },
  { id: "approved", label: "Approved", color: "#34D399", bg: "rgba(52,211,153,0.15)" },
  { id: "won", label: "Won", color: "#6EE7B7", bg: "rgba(110,231,183,0.15)" },
  { id: "lost", label: "Lost", color: "#F87171", bg: "rgba(248,113,113,0.15)" },
];

const STATUS_MAP = Object.fromEntries(PIPELINE_STAGES.map((s) => [s.id, s]));

type AdminView = "dashboard" | "leads" | "pipeline" | "calendar" | "customers" | "jobs" | "estimates" | "invoices" | "notifications" | "settings";

// ── SVG nav icons ─────────────────────────────────────────────────────────
const NavIcons = {
  dashboard: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  leads:     <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  pipeline:  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12H3"/><path d="M22 6H3"/><path d="M22 18H3"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="13" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="6" cy="18" r="2" fill="currentColor" stroke="none"/></svg>,
  calendar:  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  customers: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  jobs:      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  estimates: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  invoices:  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  notifications: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

const NAV = [
  { id: "dashboard" as AdminView, label: "Dashboard", icon: NavIcons.dashboard },
  { id: "leads" as AdminView, label: "All Leads", icon: NavIcons.leads },
  { id: "pipeline" as AdminView, label: "Pipeline", icon: NavIcons.pipeline },
  { id: "calendar" as AdminView, label: "Calendar", icon: NavIcons.calendar },
  { id: "customers" as AdminView, label: "Customers", icon: NavIcons.customers },
  { id: "jobs" as AdminView, label: "Jobs", icon: NavIcons.jobs },
  { id: "estimates" as AdminView, label: "Estimates", icon: NavIcons.estimates },
  { id: "invoices" as AdminView, label: "Invoices", icon: NavIcons.invoices },
  { id: "notifications" as AdminView, label: "Notifications", icon: NavIcons.notifications },
];

// ── Utility: fetch wrapper ────────────────────────────────────────────────

async function api<T = unknown>(url: string, opts?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ── Main Dashboard ─────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifCount, setNotifCount] = useState(0);
  const [configured, setConfigured] = useState(true);

  // Poll notification count
  useEffect(() => {
    const fetchCount = async () => {
      const res = await api<{ data: Notification[] }>("/api/notifications");
      if (!res) { setConfigured(false); return; }
      setNotifCount((res.data ?? []).filter((n) => !n.read).length);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: "#070915", fontFamily: "'Barlow', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { background: "#0D0F1E", color: "white", border: "1px solid rgba(245,197,24,0.2)" } }} />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ duration: 0.3 }}
            className="w-60 flex-shrink-0 flex flex-col fixed left-0 top-0 bottom-0 z-30"
            style={{ background: "#0D0F1E", borderRight: "1px solid rgba(245,197,24,0.1)" }}>
            <div className="p-5 border-b" style={{ borderColor: "rgba(245,197,24,0.1)" }}>
              <div className="font-display text-2xl text-[#F5C518]">UBS CRM</div>
              <div className="text-white/30 text-xs mt-0.5 font-cond tracking-wider">Management System</div>
            </div>

            <nav className="flex-1 p-3 overflow-y-auto">
              {NAV.map((item) => (
                <button key={item.id} onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left mb-0.5 transition-all duration-200 ${view === item.id ? "text-[#F5C518]" : "text-white/40 hover:text-white/80"}`}
                  style={{ background: view === item.id ? "rgba(245,197,24,0.08)" : "transparent" }}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-cond text-xs tracking-wider uppercase flex-1">{item.label}</span>
                  {item.id === "notifications" && notifCount > 0 && (
                    <span className="bg-[#F5C518] text-[#0D0F1E] text-[9px] font-bold px-1.5 py-0.5 rounded-full">{notifCount}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <Link href="/" className="block text-white/30 text-xs font-cond tracking-wider hover:text-white transition-colors mb-3">
                ← Back to Website
              </Link>
              <button
                onClick={async () => {
                  await fetch("/api/admin/logout", { method: "POST" });
                  router.push("/admin/login");
                }}
                className="flex items-center gap-2 text-red-400/50 text-xs font-cond tracking-wider hover:text-red-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-0"}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-4 px-6 py-3 border-b" style={{ background: "rgba(7,9,21,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors w-7 h-7 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="font-cond font-bold text-xs tracking-[0.2em] uppercase text-white/40">
            UBS CRM&ensp;/&ensp;{NAV.find(n => n.id === view)?.label}
          </div>
          {!configured && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 text-xs font-cond" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#FB923C" }}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Supabase not configured — database features unavailable
            </div>
          )}
          <button onClick={() => setView("notifications")} className={`${configured ? "ml-auto" : ""} relative text-white/40 hover:text-white transition-colors flex-shrink-0 w-8 h-8 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#F5C518] text-[#0D0F1E] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{notifCount}</span>}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {view === "dashboard" && <DashboardView onNavigate={setView} />}
              {view === "leads" && <LeadsView />}
              {view === "pipeline" && <PipelineView />}
              {view === "calendar" && <CalendarView />}
              {view === "customers" && <CustomersView />}
              {view === "jobs" && <JobsView />}
              {view === "estimates" && <EstimatesView />}
              {view === "invoices" && <InvoicesView />}
              {view === "notifications" && <NotificationsView onRead={() => setNotifCount(0)} />}
              {view === "settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard View ─────────────────────────────────────────────────────────

function DashboardView({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [stats, setStats] = useState<{
    totalLeads: number; newLeadsThisWeek: number; pipelineValue: number;
    monthlyRevenue: number; jobsWon: number; conversionRate: number;
    pendingEstimates: number; outstandingInvoices: number; upcomingAppointments: number;
  } | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentActivities, setRecentActivities] = useState<{ id: string; action: string; description: string; created_at: string; entity_type: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api<{ stats: typeof stats; recentLeads: Lead[]; recentActivities: typeof recentActivities }>("/api/dashboard");
      if (res) {
        setStats(res.stats);
        setRecentLeads(res.recentLeads ?? []);
        setRecentActivities(res.recentActivities ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard..." />;

  const statCards = [
    { label: "Total Leads", value: stats?.totalLeads ?? 0, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: "#60A5FA", action: () => onNavigate("leads") },
    { label: "New This Week", value: stats?.newLeadsThisWeek ?? 0, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, color: "#F5C518", action: () => onNavigate("leads") },
    { label: "Jobs Won", value: stats?.jobsWon ?? 0, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, color: "#34D399", action: () => onNavigate("jobs") },
    { label: "Monthly Revenue", value: `$${(stats?.monthlyRevenue ?? 0).toLocaleString()}`, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: "#A78BFA", action: () => onNavigate("invoices") },
    { label: "Conversion Rate", value: `${stats?.conversionRate ?? 0}%`, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, color: "#FB923C", action: () => onNavigate("leads") },
    { label: "Pipeline Value", value: `$${(stats?.pipelineValue ?? 0).toLocaleString()}`, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, color: "#F472B6", action: () => onNavigate("pipeline") },
    { label: "Pending Estimates", value: stats?.pendingEstimates ?? 0, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>, color: "#FBBF24", action: () => onNavigate("estimates") },
    { label: "Outstanding AR", value: `$${(stats?.outstandingInvoices ?? 0).toLocaleString()}`, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, color: "#F87171", action: () => onNavigate("invoices") },
    { label: "Upcoming Appts", value: stats?.upcomingAppointments ?? 0, icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, color: "#2DD4BF", action: () => onNavigate("calendar") },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white mb-1">DASHBOARD</h1>
          <p className="text-white/40 text-sm">Business overview · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <button onClick={() => onNavigate("leads")} className="font-cond font-bold text-xs tracking-widest uppercase px-5 py-2.5 bg-[#F5C518] text-[#0D0F1E] hover:bg-white transition-colors">
          + New Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <button key={s.label} onClick={s.action}
            className="p-5 text-left transition-all duration-200 hover:scale-[1.01] group relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px" }}>
            <div className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-500" style={{ background: s.color }} />
            <div className="mb-3 opacity-60" style={{ color: s.color }}>{s.icon}</div>
            <div className="font-display text-3xl mb-1 leading-none" style={{ color: s.color }}>
              {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
            </div>
            <div className="font-cond text-[10px] tracking-widest uppercase text-white/35">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cond font-bold text-sm tracking-widest uppercase text-white/60">Recent Leads</h2>
            <button onClick={() => onNavigate("leads")} className="font-cond text-xs tracking-wider uppercase text-[#F5C518] hover:text-white transition-colors">View All →</button>
          </div>
          {recentLeads.length === 0 ? (
            <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} label="No leads yet" sub="Quote and booking submissions will appear here" />
          ) : (
            <MiniLeadTable leads={recentLeads} />
          )}
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="font-cond font-bold text-sm tracking-widest uppercase text-white/60 mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {recentActivities.length === 0 ? (
              <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>} label="No activity yet" sub="Actions will log here automatically" />
            ) : (
              recentActivities.map((a) => (
                <div key={a.id} className="flex gap-3 p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-2 h-2 rounded-full bg-[#F5C518] mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-white/70 text-xs font-light">{a.description}</div>
                    <div className="text-white/25 text-xs mt-0.5">{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-8 p-6" style={{ background: "rgba(59,79,200,0.06)", border: "1px solid rgba(59,79,200,0.2)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded" style={{ background: "rgba(59,79,200,0.3)", color: "#93A3F8" }}>
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          </div>
          <div>
            <div className="font-cond font-bold text-sm tracking-widest uppercase text-white">AI Insights</div>
            <div className="text-white/30 text-xs">Rule-based analysis from live data</div>
          </div>
        </div>
        <AIInsights stats={stats} recentLeads={recentLeads} />
      </div>
    </div>
  );
}

function AIInsights({ stats, recentLeads }: { stats: Parameters<typeof DashboardView>[0]["onNavigate"] extends unknown ? unknown : unknown; recentLeads: Lead[] }) {
  const s = stats as { pendingEstimates?: number; outstandingInvoices?: number; conversionRate?: number; newLeadsThisWeek?: number } | null;
  const insights: { icon: React.ReactNode; text: string; type: "warning" | "info" | "success" }[] = [];

  // eslint-disable-next-line react-hooks/purity -- dashboard staleness check is intentionally non-pure
  const nowMs = Date.now();
  const staleLeads = recentLeads.filter((l) => {
    if (!l.created_at) return false;
    const age = nowMs - new Date(l.created_at).getTime();
    return age > 48 * 60 * 60 * 1000 && l.status === "new";
  });

  const warnIcon = <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  const docIcon  = <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
  const cashIcon = <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
  const upIcon   = <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>;
  const okIcon   = <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;

  if (staleLeads.length > 0) insights.push({ icon: warnIcon, text: `${staleLeads.length} new lead${staleLeads.length > 1 ? "s" : ""} not contacted in 48+ hours`, type: "warning" });
  if (s?.pendingEstimates && s.pendingEstimates > 0) insights.push({ icon: docIcon, text: `${s.pendingEstimates} estimate${s.pendingEstimates > 1 ? "s are" : " is"} pending customer approval — follow up to close`, type: "info" });
  if (s?.outstandingInvoices && s.outstandingInvoices > 500) insights.push({ icon: cashIcon, text: `$${Number(s.outstandingInvoices).toLocaleString()} in outstanding invoices — consider sending reminders`, type: "warning" });
  if (s?.conversionRate !== undefined && s.conversionRate > 40) insights.push({ icon: upIcon, text: `Conversion rate is ${s.conversionRate}% — above average. Keep up the fast follow-up!`, type: "success" });
  if (s?.newLeadsThisWeek && s.newLeadsThisWeek > 3) insights.push({ icon: upIcon, text: `${s.newLeadsThisWeek} new leads this week — strong demand, ensure response capacity`, type: "info" });
  if (insights.length === 0) insights.push({ icon: okIcon, text: "No urgent action items. Your pipeline looks healthy!", type: "success" });

  const typeColors = { warning: "#FB923C", info: "#60A5FA", success: "#34D399" };

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {insights.map((ins, i) => (
        <div key={i} className="flex gap-3 p-3" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${typeColors[ins.type]}33` }}>
          <span style={{ color: typeColors[ins.type], marginTop: "1px" }}>{ins.icon}</span>
          <span className="text-white/70 text-sm font-light">{ins.text}</span>
        </div>
      ))}
    </div>
  );
}

// ── Leads View ─────────────────────────────────────────────────────────────

function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLeads = useCallback(async (q = search, status = filterStatus) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (status && status !== "all") params.set("status", status);
    const res = await api<{ data: Lead[] }>(`/api/leads?${params}`);
    setLeads(res?.data ?? []);
    setLoading(false);
  }, [search, filterStatus]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchLeads(val, filterStatus), 400);
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const res = await api<{ data: Lead }>(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res?.data) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...res.data } : l)));
      if (selected?.id === id) setSelected({ ...selected, ...res.data });
      toast.success("Lead updated");
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    await api(`/api/leads/${id}`, { method: "DELETE" });
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("Lead deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white mb-1">ALL LEADS</h1>
          <p className="text-white/40 text-sm">{leads.length} leads found</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="font-cond font-bold text-xs tracking-widest uppercase px-5 py-2.5 bg-[#F5C518] text-[#0D0F1E] hover:bg-white transition-colors">
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search leads..."
          className="px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", width: "240px" }} />
        <div className="flex gap-2 flex-wrap">
          {[{ id: "all", label: "All" }, ...PIPELINE_STAGES.slice(0, 6)].map((s) => (
            <button key={s.id} onClick={() => { setFilterStatus(s.id); fetchLeads(search, s.id); }}
              className="font-cond text-xs tracking-wider uppercase px-3 py-1.5 transition-all"
              style={{
                background: filterStatus === s.id ? (s.id === "all" ? "rgba(245,197,24,0.15)" : STATUS_MAP[s.id]?.bg ?? "rgba(245,197,24,0.15)") : "rgba(255,255,255,0.03)",
                border: `1px solid ${filterStatus === s.id ? (s.id === "all" ? "rgba(245,197,24,0.4)" : (STATUS_MAP[s.id]?.color ?? "#F5C518") + "55") : "rgba(255,255,255,0.08)"}`,
                color: filterStatus === s.id ? (s.id === "all" ? "#F5C518" : STATUS_MAP[s.id]?.color ?? "#F5C518") : "rgba(255,255,255,0.5)",
              }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingState label="Loading leads..." /> : (
        leads.length === 0 ? (
          <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} label="No leads found" sub="Leads from quote forms and booking wizard appear here automatically" />
        ) : (
          <LeadsTable leads={leads} onSelect={setSelected} />
        )
      )}

      {/* Lead Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <LeadDrawer lead={selected} onClose={() => setSelected(null)} onUpdate={updateLead} onDelete={deleteLead} />
        )}
      </AnimatePresence>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {addOpen && <AddLeadModal onClose={() => setAddOpen(false)} onAdd={() => { setAddOpen(false); fetchLeads(); }} />}
      </AnimatePresence>
    </div>
  );
}

function LeadsTable({ leads, onSelect }: { leads: Lead[]; onSelect: (l: Lead) => void }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
      <div className="grid grid-cols-6 gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {["Company / Contact", "Service", "Date", "Value", "Source", "Status"].map((h) => (
          <div key={h} className="font-cond text-[10px] tracking-widest uppercase text-white/25">{h}</div>
        ))}
      </div>
      {leads.map((lead) => {
        const status = STATUS_MAP[lead.status] ?? PIPELINE_STAGES[0];
        return (
          <div key={lead.id} onClick={() => onSelect(lead)}
            className="grid grid-cols-6 gap-3 px-4 py-4 cursor-pointer border-b transition-colors hover:bg-white/[0.02]"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <div>
              <div className="text-white text-sm font-light truncate">{lead.company_name ?? "—"}</div>
              <div className="text-white/30 text-xs truncate">{[lead.first_name, lead.last_name].filter(Boolean).join(" ") || "—"}</div>
            </div>
            <div className="text-white/60 text-sm font-light truncate self-center">{lead.service ?? "—"}</div>
            <div className="text-white/60 text-sm font-light self-center">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}</div>
            <div className="self-center">
              {lead.estimated_value ? (
                <span className="font-cond font-bold text-sm" style={{ color: "#34D399" }}>${lead.estimated_value.toLocaleString()}/mo</span>
              ) : <span className="text-white/20 text-sm">—</span>}
            </div>
            <div className="text-white/40 text-xs self-center font-cond tracking-wider uppercase">{lead.source ?? "web"}</div>
            <div className="self-center">
              <span className="font-cond text-[10px] tracking-wider uppercase px-2 py-1 rounded-sm"
                style={{ background: status.bg, color: status.color }}>{status.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeadDrawer({ lead, onClose, onUpdate, onDelete }: { lead: Lead; onClose: () => void; onUpdate: (id: string, u: Partial<Lead>) => void; onDelete: (id: string) => void }) {
  const status = STATUS_MAP[lead.status] ?? PIPELINE_STAGES[0];
  const [editNotes, setEditNotes] = useState(lead.notes ?? "");
  const [editValue, setEditValue] = useState(String(lead.estimated_value ?? ""));

  const saveField = (field: keyof Lead, value: unknown) => onUpdate(lead.id, { [field]: value } as Partial<Lead>);

  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 h-full w-[420px] max-w-full overflow-y-auto z-50 shadow-2xl"
      style={{ background: "#0D0F1E", borderLeft: "1px solid rgba(245,197,24,0.15)" }}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="font-display text-2xl text-white">{lead.company_name ?? [lead.first_name, lead.last_name].filter(Boolean).join(" ") ?? "Lead"}</div>
            <div className="text-white/40 text-sm">{[lead.first_name, lead.last_name].filter(Boolean).join(" ")}</div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">×</button>
        </div>

        <span className="font-cond text-xs tracking-widest uppercase px-3 py-1.5 rounded-sm" style={{ background: status.bg, color: status.color }}>{status.label}</span>

        <div className="mt-6 space-y-3">
          {[
            { label: "Service", value: lead.service },
            { label: "Phone", value: lead.phone ? <a href={`tel:${lead.phone}`} className="text-[#F5C518]">{lead.phone}</a> : null },
            { label: "Email", value: lead.email ? <a href={`mailto:${lead.email}`} className="text-[#60A5FA] break-all">{lead.email}</a> : null },
            { label: "Address", value: lead.address },
            { label: "Building Type", value: lead.building_type },
            { label: "Sq Footage", value: lead.sq_footage },
            { label: "Frequency", value: lead.frequency },
            { label: "Source", value: lead.source },
            { label: "Created", value: lead.created_at ? new Date(lead.created_at).toLocaleString() : null },
          ].map((item) => item.value ? (
            <div key={item.label} className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
              <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-1">{item.label}</div>
              <div className="text-white text-sm font-light">{item.value}</div>
            </div>
          ) : null)}

          {/* Estimated value */}
          <div className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-1">Estimated Value ($/mo)</div>
            <input value={editValue} onChange={e => setEditValue(e.target.value)}
              onBlur={() => saveField("estimated_value", parseFloat(editValue) || null)}
              placeholder="0" className="w-full bg-transparent text-[#34D399] text-sm font-cond font-bold focus:outline-none" />
          </div>

          {/* Notes */}
          <div className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-1">Notes</div>
            <textarea rows={3} value={editNotes} onChange={e => setEditNotes(e.target.value)}
              onBlur={() => saveField("notes", editNotes)}
              placeholder="Add notes..." className="w-full bg-transparent text-white/70 text-sm font-light resize-none focus:outline-none" />
          </div>
        </div>

        {/* Status update */}
        <div className="mt-6">
          <div className="font-cond text-xs tracking-widest uppercase text-white/30 mb-3">Move to Stage</div>
          <div className="grid grid-cols-2 gap-2">
            {PIPELINE_STAGES.map((s) => (
              <button key={s.id} onClick={() => saveField("status", s.id)}
                className="py-2 font-cond text-[10px] tracking-widest uppercase transition-all"
                style={{
                  background: lead.status === s.id ? s.bg : "rgba(255,255,255,0.03)",
                  border: `1px solid ${lead.status === s.id ? s.color + "50" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "2px",
                  color: lead.status === s.id ? s.color : "rgba(255,255,255,0.4)",
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {lead.phone && <a href={`tel:${lead.phone}`} className="flex-1 py-3 text-center font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] flex items-center justify-center gap-2"><svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</a>}
          {lead.email && <a href={`mailto:${lead.email}`} className="flex-1 py-3 text-center font-cond font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2" style={{ background: "rgba(59,79,200,0.3)", color: "white", border: "1px solid rgba(59,79,200,0.4)" }}><svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Email</a>}
        </div>
        <button onClick={() => onDelete(lead.id)} className="w-full mt-3 py-2.5 font-cond text-xs tracking-widest uppercase text-red-400/60 hover:text-red-400 transition-colors" style={{ border: "1px solid rgba(248,113,113,0.2)" }}>
          Delete Lead
        </button>
      </div>
    </motion.div>
  );
}

function AddLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [form, setForm] = useState({ company_name: "", first_name: "", last_name: "", email: "", phone: "", service: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, source: "admin" }) });
    setLoading(false);
    if (res) { toast.success("Lead added"); onAdd(); } else toast.error("Failed to add lead");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="w-full max-w-lg p-8" style={{ background: "#0D0F1E", border: "1px solid rgba(245,197,24,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl text-white">ADD LEAD</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[{ k: "company_name", l: "Company Name", p: "Acme Corp" }, { k: "service", l: "Service Needed", p: "Commercial Janitorial" }].map(f => (
              <div key={f.k} className="col-span-2 sm:col-span-1">
                <label className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">{f.l}</label>
                <input value={form[f.k as keyof typeof form]} onChange={e => setForm(d => ({ ...d, [f.k]: e.target.value }))} placeholder={f.p}
                  className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
            ))}
            {[{ k: "first_name", l: "First Name", p: "John" }, { k: "last_name", l: "Last Name", p: "Smith" }, { k: "email", l: "Email", p: "john@co.com" }, { k: "phone", l: "Phone", p: "(702) 000-0000" }].map(f => (
              <div key={f.k}>
                <label className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">{f.l}</label>
                <input value={form[f.k as keyof typeof form]} onChange={e => setForm(d => ({ ...d, [f.k]: e.target.value }))} placeholder={f.p}
                  className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
            ))}
          </div>
          <div>
            <label className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(d => ({ ...d, notes: e.target.value }))} placeholder="Initial notes..."
              className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-cond font-semibold text-xs tracking-widest uppercase text-white/60 border border-white/20">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] disabled:opacity-60">
              {loading ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Pipeline View ──────────────────────────────────────────────────────────

function PipelineView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    api<{ data: Lead[] }>("/api/leads?limit=200").then((res) => {
      setLeads(res?.data ?? []);
      setLoading(false);
    });
  }, []);

  const handleDrop = async (targetStatus: string) => {
    if (!dragId) return;
    const lead = leads.find((l) => l.id === dragId);
    if (!lead || lead.status === targetStatus) return;

    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === dragId ? { ...l, status: targetStatus as Lead["status"] } : l)));

    const res = await api<{ data: Lead }>(`/api/leads/${dragId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: targetStatus }),
    });
    if (!res) toast.error("Failed to update stage");
    else toast.success(`Moved to ${PIPELINE_STAGES.find((s) => s.id === targetStatus)?.label}`);
    setDragId(null);
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const res = await api<{ data: Lead }>(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    if (res?.data) { setLeads((prev) => prev.map((l) => l.id === id ? { ...l, ...res.data } : l)); if (selected?.id === id) setSelected({ ...selected, ...res.data }); }
  };

  if (loading) return <LoadingState label="Loading pipeline..." />;

  return (
    <div>
      <h1 className="font-display text-4xl text-white mb-1">PIPELINE</h1>
      <p className="text-white/40 text-sm mb-6">Drag cards between stages to update status · {leads.length} total leads</p>

      <div className="flex gap-4 overflow-x-auto pb-6">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          const stageValue = stageLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0);
          return (
            <div key={stage.id} className="flex-shrink-0 w-52"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-cond text-xs tracking-widest uppercase" style={{ color: stage.color }}>{stage.label}</span>
                <span className="font-cond text-xs text-white/30 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>{stageLeads.length}</span>
              </div>
              {stageValue > 0 && (
                <div className="px-1 mb-2 font-cond text-[10px] tracking-wider text-white/30">${stageValue.toLocaleString()}/mo</div>
              )}
              <div className="space-y-2 min-h-[150px] p-2 rounded transition-colors"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                {stageLeads.map((lead) => (
                  <motion.div key={lead.id} draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => setDragId(null)}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelected(lead)}
                    className="p-3 cursor-pointer rounded select-none"
                    style={{ background: dragId === lead.id ? stage.bg : "rgba(255,255,255,0.04)", border: `1px solid ${stage.color}25`, opacity: dragId === lead.id ? 0.5 : 1 }}>
                    <div className="font-cond font-bold text-xs text-white mb-0.5 truncate">{lead.company_name ?? [lead.first_name, lead.last_name].filter(Boolean).join(" ") ?? "—"}</div>
                    <div className="text-white/40 text-xs truncate">{lead.service ?? "—"}</div>
                    {lead.estimated_value && <div className="text-xs mt-2 font-cond font-bold" style={{ color: stage.color }}>${lead.estimated_value.toLocaleString()}/mo</div>}
                  </motion.div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="h-24 flex items-center justify-center text-white/15 text-xs font-cond tracking-widest uppercase">Drop here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && <LeadDrawer lead={selected} onClose={() => setSelected(null)} onUpdate={updateLead} onDelete={async (id) => { await api(`/api/leads/${id}`, { method: "DELETE" }); setLeads(p => p.filter(l => l.id !== id)); setSelected(null); }} />}
      </AnimatePresence>
    </div>
  );
}

// ── Calendar View ──────────────────────────────────────────────────────────

const APPT_COLORS: Record<string, string> = {
  estimate: "#F5C518",
  site_visit: "#3B4FC8",
  cleaning_service: "#34D399",
  maintenance_call: "#FB923C",
  inspection: "#A78BFA",
  follow_up: "#60A5FA",
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function CalendarView() {
  const [calMonth, setCalMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const fetchAppts = useCallback(() => {
    const m = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}`;
    api<{ data: Appointment[] }>(`/api/appointments?month=${m}`).then((res) => {
      setAppointments(res?.data ?? []);
      setLoading(false);
    });
  }, [calMonth]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setLoading(true); fetchAppts(); }, [fetchAppts]);

  const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();

  const getApptsByDay = (day: number) => {
    const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter((a) => a.start_datetime?.startsWith(dateStr));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white mb-1">CALENDAR</h1>
          <p className="text-white/40 text-sm">{appointments.length} appointments this month</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="font-cond font-bold text-xs tracking-widest uppercase px-5 py-2.5 bg-[#F5C518] text-[#0D0F1E]">
          + New Appointment
        </button>
      </div>

      {/* Month nav */}
      <div className="flex items-center gap-4 mb-5">
        <button onClick={() => { const d = new Date(calMonth); d.setMonth(d.getMonth() - 1); setCalMonth(d); }}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">‹</button>
        <span className="font-cond font-bold text-white text-base tracking-widest">{MONTH_NAMES[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
        <button onClick={() => { const d = new Date(calMonth); d.setMonth(d.getMonth() + 1); setCalMonth(d); }}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">›</button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(APPT_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="font-cond text-[10px] tracking-wider uppercase text-white/40">{type.replace("_", " ")}</span>
          </div>
        ))}
      </div>

      {loading ? <LoadingState label="Loading calendar..." /> : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map((d) => <div key={d} className="text-center font-cond text-[10px] tracking-wider uppercase text-white/30 py-1.5">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayAppts = getApptsByDay(day);
              const today = new Date();
              const isToday = today.getDate() === day && today.getMonth() === calMonth.getMonth() && today.getFullYear() === calMonth.getFullYear();
              return (
                <div key={day} className="min-h-[80px] p-1.5 rounded transition-colors hover:bg-white/[0.03]"
                  style={{ background: "rgba(255,255,255,0.02)", border: isToday ? "1px solid rgba(245,197,24,0.4)" : "1px solid rgba(255,255,255,0.04)" }}>
                  <div className={`font-cond text-xs mb-1 ${isToday ? "text-[#F5C518] font-bold" : "text-white/30"}`}>{day}</div>
                  {dayAppts.map((a) => (
                    <div key={a.id} onClick={() => setSelectedAppt(a)}
                      className="text-[9px] font-cond p-1 rounded mb-0.5 truncate cursor-pointer"
                      style={{ background: `${APPT_COLORS[a.type] ?? "#F5C518"}25`, color: APPT_COLORS[a.type] ?? "#F5C518" }}>
                      {a.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Appointment detail modal */}
      <AnimatePresence>
        {selectedAppt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)" }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md p-8" style={{ background: "#0D0F1E", border: "1px solid rgba(245,197,24,0.2)" }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-display text-2xl text-white">{selectedAppt.title}</h3>
                <button onClick={() => setSelectedAppt(null)} className="text-white/40 hover:text-white text-2xl">×</button>
              </div>
              <div className="space-y-3">
                {[
                  { l: "Type", v: selectedAppt.type?.replace("_", " ") },
                  { l: "Status", v: selectedAppt.status },
                  { l: "Date & Time", v: selectedAppt.start_datetime ? new Date(selectedAppt.start_datetime).toLocaleString() : null },
                  { l: "Contact", v: selectedAppt.contact_name },
                  { l: "Company", v: selectedAppt.company_name },
                  { l: "Phone", v: selectedAppt.phone },
                  { l: "Address", v: selectedAppt.address },
                  { l: "Service", v: selectedAppt.service },
                  { l: "Assigned To", v: selectedAppt.assigned_to },
                  { l: "Notes", v: selectedAppt.notes },
                ].filter(i => i.v).map(item => (
                  <div key={item.l} className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-0.5">{item.l}</div>
                    <div className="text-white text-sm font-light">{item.v}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={async () => { await api(`/api/appointments/${selectedAppt.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "completed" }) }); setSelectedAppt(null); fetchAppts(); toast.success("Marked completed"); }}
                  className="flex-1 py-2.5 font-cond font-bold text-xs tracking-widest uppercase bg-[#34D399] text-[#0D0F1E]">Mark Completed</button>
                <button onClick={async () => { await api(`/api/appointments/${selectedAppt.id}`, { method: "DELETE" }); setSelectedAppt(null); fetchAppts(); toast.success("Deleted"); }}
                  className="py-2.5 px-4 font-cond text-xs tracking-widest uppercase text-red-400/60 hover:text-red-400 border border-red-400/20">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add appointment modal */}
      <AnimatePresence>
        {addOpen && <AddAppointmentModal onClose={() => setAddOpen(false)} onAdd={() => { setAddOpen(false); fetchAppts(); }} />}
      </AnimatePresence>
    </div>
  );
}

function AddAppointmentModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [form, setForm] = useState({ title: "", type: "estimate", start_datetime: "", contact_name: "", company_name: "", phone: "", address: "", service: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.start_datetime) return toast.error("Title and date/time required");
    setLoading(true);
    const res = await api("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res) { toast.success("Appointment scheduled"); onAdd(); } else toast.error("Failed to schedule");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="w-full max-w-lg p-8 overflow-y-auto max-h-[90vh]" style={{ background: "#0D0F1E", border: "1px solid rgba(245,197,24,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl text-white">NEW APPOINTMENT</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ k: "title", l: "Title *", p: "Estimate — Acme Corp" }, { k: "contact_name", l: "Contact Name", p: "John Smith" }, { k: "company_name", l: "Company", p: "Acme Corp" }, { k: "phone", l: "Phone", p: "(702) 000-0000" }, { k: "address", l: "Address", p: "123 Main St, Las Vegas" }, { k: "service", l: "Service", p: "Commercial Janitorial" }, { k: "notes", l: "Notes", p: "Any special instructions..." }].map(f => (
            <div key={f.k}>
              <label className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">{f.l}</label>
              <input value={form[f.k as keyof typeof form]} onChange={e => setForm(d => ({ ...d, [f.k]: e.target.value }))} placeholder={f.p}
                className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          ))}
          <div>
            <label className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">Type</label>
            <select value={form.type} onChange={e => setForm(d => ({ ...d, type: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm text-white focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {Object.keys(APPT_COLORS).map(t => <option key={t} value={t} className="bg-[#0D0F1E]">{t.replace("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">Date & Time *</label>
            <input type="datetime-local" value={form.start_datetime} onChange={e => setForm(d => ({ ...d, start_datetime: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm text-white focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", colorScheme: "dark" }} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-cond font-semibold text-xs tracking-widest uppercase text-white/60 border border-white/20">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] disabled:opacity-60">
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Customers View ─────────────────────────────────────────────────────────

function CustomersView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async (q = search) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    const res = await api<{ data: Customer[] }>(`/api/customers?${params}`);
    setCustomers(res?.data ?? []);
    setLoading(false);
  }, [search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white mb-1">CUSTOMERS</h1>
          <p className="text-white/40 text-sm">{customers.length} customers</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="font-cond font-bold text-xs tracking-widest uppercase px-5 py-2.5 bg-[#F5C518] text-[#0D0F1E]">
          + Add Customer
        </button>
      </div>

      <input value={search} onChange={e => { setSearch(e.target.value); fetchCustomers(e.target.value); }} placeholder="Search customers..."
        className="px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none mb-5"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", width: "280px" }} />

      {loading ? <LoadingState label="Loading customers..." /> : customers.length === 0 ? (
        <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} label="No customers yet" sub="Convert leads to customers to see them here" />
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
          <div className="grid grid-cols-5 gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {["Company", "Contact", "Phone", "Lifetime Value", "Balance Due"].map(h => (
              <div key={h} className="font-cond text-[10px] tracking-widest uppercase text-white/25">{h}</div>
            ))}
          </div>
          {customers.map(c => (
            <div key={c.id} onClick={() => setSelected(c)}
              className="grid grid-cols-5 gap-3 px-4 py-4 cursor-pointer border-b transition-colors hover:bg-white/[0.02]"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div className="text-white text-sm font-light truncate">{c.company_name ?? "—"}</div>
              <div className="text-white/60 text-sm font-light truncate self-center">{c.contact_name ?? "—"}</div>
              <div className="text-white/60 text-sm font-light self-center">{c.phone ?? "—"}</div>
              <div className="font-cond font-bold text-sm self-center" style={{ color: "#34D399" }}>${(c.lifetime_value ?? 0).toLocaleString()}</div>
              <div className="font-cond font-bold text-sm self-center" style={{ color: (c.outstanding_balance ?? 0) > 0 ? "#F87171" : "#34D399" }}>
                ${(c.outstanding_balance ?? 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-[420px] max-w-full overflow-y-auto z-50 shadow-2xl"
            style={{ background: "#0D0F1E", borderLeft: "1px solid rgba(245,197,24,0.15)" }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-display text-2xl text-white">{selected.company_name ?? "Customer"}</div>
                  <div className="text-white/40 text-sm">{selected.contact_name}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-2xl">×</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 text-center" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                  <div className="font-display text-3xl text-[#34D399]">${(selected.lifetime_value ?? 0).toLocaleString()}</div>
                  <div className="font-cond text-[10px] tracking-widest uppercase text-white/40 mt-1">Lifetime Value</div>
                </div>
                <div className="p-4 text-center" style={{ background: (selected.outstanding_balance ?? 0) > 0 ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.05)", border: `1px solid ${(selected.outstanding_balance ?? 0) > 0 ? "rgba(248,113,113,0.2)" : "rgba(52,211,153,0.1)"}` }}>
                  <div className="font-display text-3xl" style={{ color: (selected.outstanding_balance ?? 0) > 0 ? "#F87171" : "#34D399" }}>${(selected.outstanding_balance ?? 0).toLocaleString()}</div>
                  <div className="font-cond text-[10px] tracking-widest uppercase text-white/40 mt-1">Outstanding Balance</div>
                </div>
              </div>
              {[{ l: "Email", v: selected.email }, { l: "Phone", v: selected.phone }, { l: "Address", v: [selected.address, selected.city, selected.state].filter(Boolean).join(", ") }, { l: "Building Type", v: selected.building_type }, { l: "Customer Since", v: selected.created_at ? new Date(selected.created_at).toLocaleDateString() : null }, { l: "Notes", v: selected.notes }].filter(i => i.v).map(item => (
                <div key={item.l} className="p-3 mb-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-1">{item.l}</div>
                  <div className="text-white text-sm font-light">{item.v}</div>
                </div>
              ))}
              <div className="flex gap-3 mt-6">
                {selected.phone && <a href={`tel:${selected.phone}`} className="flex-1 py-3 text-center font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] flex items-center justify-center gap-2"><svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</a>}
                {selected.email && <a href={`mailto:${selected.email}`} className="flex-1 py-3 text-center font-cond font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2" style={{ background: "rgba(59,79,200,0.3)", color: "white", border: "1px solid rgba(59,79,200,0.4)" }}><svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Email</a>}
              </div>

              {/* Portal access section */}
              <PortalAccessSection customer={selected} onUpdate={(updates) => setSelected({ ...selected, ...updates })} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addOpen && <AddCustomerModal onClose={() => setAddOpen(false)} onAdd={() => { setAddOpen(false); fetchCustomers(); }} />}
      </AnimatePresence>
    </div>
  );
}

// ── Portal Access Section (inside customer drawer) ────────────────────────────

function PortalAccessSection({ customer, onUpdate }: { customer: Customer; onUpdate: (updates: Partial<Customer>) => void }) {
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(customer.portal_email ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!email.trim()) { toast.error("Portal email required"); return; }
    setSaving(true);
    const body: Record<string, string> = { portal_email: email.trim() };
    if (password) body.portal_password_hash = password;
    const res = await api(`/api/customers/${customer.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res) {
      onUpdate({ portal_email: email.trim(), portal_password_hash: password || customer.portal_password_hash });
      setPassword("");
      setEditing(false);
      toast.success("Portal access updated");
    } else {
      toast.error("Failed to update");
    }
  }

  async function handleRevoke() {
    if (!confirm("Remove portal access for this customer?")) return;
    setSaving(true);
    await api(`/api/customers/${customer.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ portal_email: null, portal_password_hash: null }) });
    setSaving(false);
    onUpdate({ portal_email: null, portal_password_hash: null });
    setEmail("");
    setPassword("");
    setEditing(false);
    toast.success("Portal access revoked");
  }

  const hasAccess = !!(customer.portal_email && customer.portal_password_hash);

  return (
    <div className="mt-5 p-4" style={{ background: "rgba(59,79,200,0.07)", border: "1px solid rgba(59,79,200,0.2)", borderRadius: "4px" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-cond text-[10px] tracking-widest uppercase" style={{ color: "#93A3F8" }}>Customer Portal Access</div>
        <div className="flex gap-2">
          {hasAccess && !editing && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(52,211,153,0.15)", color: "#34D399" }}>Active</span>
          )}
          {!hasAccess && !editing && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#6B7280" }}>Not Set</span>
          )}
        </div>
      </div>

      {!editing ? (
        <div>
          {customer.portal_email && (
            <div className="text-white/60 text-sm mb-3">{customer.portal_email}</div>
          )}
          {!customer.portal_email && (
            <p className="text-white/40 text-xs mb-3">No portal access. Set an email and password to grant this customer portal access.</p>
          )}
          <div className="flex gap-2">
            <button onClick={() => { setEmail(customer.portal_email ?? ""); setEditing(true); }}
              className="text-xs px-3 py-1.5 font-cond font-bold tracking-wide uppercase" style={{ background: "rgba(59,79,200,0.3)", color: "white", border: "1px solid rgba(59,79,200,0.4)" }}>
              {hasAccess ? "Edit" : "Set Access"}
            </button>
            {hasAccess && (
              <button onClick={handleRevoke} disabled={saving}
                className="text-xs px-3 py-1.5 font-cond font-bold tracking-wide uppercase" style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                Revoke
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="font-cond text-[10px] tracking-widest uppercase text-white/30 block mb-1">Portal Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@company.com"
              className="w-full px-3 py-2 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
          <div>
            <label className="font-cond text-[10px] tracking-widest uppercase text-white/30 block mb-1">
              {hasAccess ? "New Password (leave blank to keep current)" : "Password"}
            </label>
            <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder={hasAccess ? "Leave blank to keep" : "Set a password"}
              className="w-full px-3 py-2 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2 font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E]">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 font-cond text-xs text-white/40">Cancel</button>
          </div>
          <p className="text-xs text-white/25">
            Portal URL: <a href="/portal/login" target="_blank" className="text-[#93A3F8]">/portal/login</a>
          </p>
        </div>
      )}
    </div>
  );
}

function AddCustomerModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [form, setForm] = useState({ company_name: "", contact_name: "", email: "", phone: "", address: "", city: "Las Vegas", state: "NV", building_type: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res) { toast.success("Customer added"); onAdd(); } else toast.error("Failed to add");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto" style={{ background: "#0D0F1E", border: "1px solid rgba(245,197,24,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl text-white">ADD CUSTOMER</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ k: "company_name", l: "Company Name", p: "Acme Corp" }, { k: "contact_name", l: "Contact Name", p: "John Smith" }, { k: "email", l: "Email", p: "john@acme.com" }, { k: "phone", l: "Phone", p: "(702) 000-0000" }, { k: "address", l: "Street Address", p: "123 Main St" }, { k: "city", l: "City", p: "Las Vegas" }, { k: "building_type", l: "Building Type", p: "Office Building" }].map(f => (
            <div key={f.k}>
              <label className="font-cond text-[10px] tracking-widest uppercase text-white/40 mb-1.5 block">{f.l}</label>
              <input value={form[f.k as keyof typeof form]} onChange={e => setForm(d => ({ ...d, [f.k]: e.target.value }))} placeholder={f.p}
                className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-cond font-semibold text-xs tracking-widest uppercase text-white/60 border border-white/20">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] disabled:opacity-60">
              {loading ? "Adding..." : "Add Customer"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Jobs View ──────────────────────────────────────────────────────────────

const JOB_STATUSES = [
  { id: "scheduled", label: "Scheduled", color: "#60A5FA" },
  { id: "assigned", label: "Assigned", color: "#A78BFA" },
  { id: "in_progress", label: "In Progress", color: "#FB923C" },
  { id: "completed", label: "Completed", color: "#34D399" },
  { id: "cancelled", label: "Cancelled", color: "#F87171" },
];

function JobsView() {
  const [jobs, setJobs] = useState<(Job & { customers?: { company_name: string; contact_name: string; phone: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const params = filterStatus !== "all" ? `?status=${filterStatus}` : "";
    api<{ data: typeof jobs }>(`/api/jobs${params}`).then(res => { setJobs(res?.data ?? []); setLoading(false); });
  }, [filterStatus]);

  if (loading) return <LoadingState label="Loading jobs..." />;

  return (
    <div>
      <h1 className="font-display text-4xl text-white mb-1">JOBS</h1>
      <p className="text-white/40 text-sm mb-6">{jobs.length} jobs</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ id: "all", label: "All", color: "#F5C518" }, ...JOB_STATUSES].map(s => (
          <button key={s.id} onClick={() => setFilterStatus(s.id)}
            className="font-cond text-xs tracking-wider uppercase px-3 py-1.5 transition-all"
            style={{ background: filterStatus === s.id ? `${s.color}20` : "rgba(255,255,255,0.03)", border: `1px solid ${filterStatus === s.id ? s.color + "55" : "rgba(255,255,255,0.08)"}`, color: filterStatus === s.id ? s.color : "rgba(255,255,255,0.5)" }}>
            {s.label}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>} label="No jobs found" sub="Jobs are created from approved estimates" />
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
          <div className="grid grid-cols-5 gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {["Title", "Customer", "Service", "Scheduled Date", "Status"].map(h => (
              <div key={h} className="font-cond text-[10px] tracking-widest uppercase text-white/25">{h}</div>
            ))}
          </div>
          {jobs.map(job => {
            const st = JOB_STATUSES.find(s => s.id === job.status) ?? JOB_STATUSES[0];
            return (
              <div key={job.id} className="grid grid-cols-5 gap-3 px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="text-white text-sm font-light truncate">{job.title}</div>
                <div className="text-white/60 text-sm font-light truncate self-center">{job.customers?.company_name ?? "—"}</div>
                <div className="text-white/60 text-sm font-light truncate self-center">{job.service ?? "—"}</div>
                <div className="text-white/60 text-sm font-light self-center">{job.scheduled_date ?? "—"}</div>
                <div className="self-center">
                  <select value={job.status} onChange={async e => {
                    const newStatus = e.target.value;
                    await api(`/api/jobs/${job.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
                    setJobs(p => p.map(j => j.id === job.id ? { ...j, status: newStatus as Job["status"] } : j));
                    toast.success("Job status updated");
                  }}
                    className="font-cond text-[10px] tracking-wider uppercase px-2 py-1 focus:outline-none cursor-pointer"
                    style={{ background: `${st.color}20`, border: `1px solid ${st.color}55`, color: st.color, borderRadius: "2px" }}>
                    {JOB_STATUSES.map(s => <option key={s.id} value={s.id} className="bg-[#0D0F1E]">{s.label}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Estimates View ─────────────────────────────────────────────────────────

function EstimatesView() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: Estimate[] }>("/api/estimates").then(res => { setEstimates(res?.data ?? []); setLoading(false); });
  }, []);

  if (loading) return <LoadingState label="Loading estimates..." />;

  const EST_COLORS: Record<string, string> = { draft: "#60A5FA", sent: "#FB923C", approved: "#34D399", rejected: "#F87171", expired: "#F87171" };

  return (
    <div>
      <h1 className="font-display text-4xl text-white mb-1">ESTIMATES</h1>
      <p className="text-white/40 text-sm mb-6">{estimates.length} estimates · Total value: ${estimates.reduce((s, e) => s + (e.total ?? 0), 0).toLocaleString()}</p>

      {estimates.length === 0 ? (
        <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} label="No estimates yet" sub="Create estimates from customer profiles or leads" />
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
          <div className="grid grid-cols-5 gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {["Estimate #", "Issue Date", "Expiry", "Total", "Status"].map(h => (
              <div key={h} className="font-cond text-[10px] tracking-widest uppercase text-white/25">{h}</div>
            ))}
          </div>
          {estimates.map(est => (
            <div key={est.id} className="grid grid-cols-5 gap-3 px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div className="text-[#F5C518] font-cond font-bold text-sm">{est.estimate_number}</div>
              <div className="text-white/60 text-sm self-center">{est.issue_date}</div>
              <div className="text-white/60 text-sm self-center">{est.expiry_date ?? "—"}</div>
              <div className="font-cond font-bold text-sm text-white self-center">${(est.total ?? 0).toLocaleString()}</div>
              <div className="self-center flex items-center gap-2">
                <span className="font-cond text-[10px] tracking-wider uppercase px-2 py-1"
                  style={{ background: `${EST_COLORS[est.status] ?? "#60A5FA"}20`, color: EST_COLORS[est.status] ?? "#60A5FA", border: `1px solid ${EST_COLORS[est.status] ?? "#60A5FA"}40` }}>
                  {est.status}
                </span>
                {est.status === "sent" && (
                  <button onClick={async () => {
                    await api(`/api/estimates/${est.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved" }) });
                    setEstimates(p => p.map(e => e.id === est.id ? { ...e, status: "approved" as Estimate["status"] } : e));
                    toast.success("Estimate approved — job created");
                  }} className="font-cond text-[9px] tracking-wider uppercase px-2 py-1 bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30">
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Invoices View ──────────────────────────────────────────────────────────

function InvoicesView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: Invoice[] }>("/api/invoices").then(res => { setInvoices(res?.data ?? []); setLoading(false); });
  }, []);

  if (loading) return <LoadingState label="Loading invoices..." />;

  const INV_COLORS: Record<string, string> = { draft: "#60A5FA", sent: "#FB923C", partial: "#FBBF24", paid: "#34D399", overdue: "#F87171", cancelled: "#6B7280" };

  return (
    <div>
      <h1 className="font-display text-4xl text-white mb-1">INVOICES</h1>
      <p className="text-white/40 text-sm mb-1">{invoices.length} invoices</p>
      <div className="flex gap-6 mb-6 text-sm">
        <div><span className="text-white/30">Outstanding: </span><span className="text-[#F87171] font-cond font-bold">${invoices.filter(i => i.status !== "paid").reduce((s, i) => s + (i.balance_due ?? 0), 0).toLocaleString()}</span></div>
        <div><span className="text-white/30">Paid: </span><span className="text-[#34D399] font-cond font-bold">${invoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.total ?? 0), 0).toLocaleString()}</span></div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} label="No invoices yet" sub="Invoices are generated from completed jobs" />
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
          <div className="grid grid-cols-6 gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {["Invoice #", "Issue Date", "Due Date", "Total", "Balance Due", "Status"].map(h => (
              <div key={h} className="font-cond text-[10px] tracking-widest uppercase text-white/25">{h}</div>
            ))}
          </div>
          {invoices.map(inv => (
            <div key={inv.id} className="grid grid-cols-6 gap-3 px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div className="text-[#F5C518] font-cond font-bold text-sm">{inv.invoice_number}</div>
              <div className="text-white/60 text-sm self-center">{inv.issue_date}</div>
              <div className="text-white/60 text-sm self-center">{inv.due_date ?? "—"}</div>
              <div className="text-white font-cond font-bold text-sm self-center">${(inv.total ?? 0).toLocaleString()}</div>
              <div className="font-cond font-bold text-sm self-center" style={{ color: (inv.balance_due ?? 0) > 0 ? "#F87171" : "#34D399" }}>
                ${(inv.balance_due ?? 0).toLocaleString()}
              </div>
              <div className="self-center flex items-center gap-2">
                <span className="font-cond text-[10px] tracking-wider uppercase px-2 py-1"
                  style={{ background: `${INV_COLORS[inv.status] ?? "#60A5FA"}20`, color: INV_COLORS[inv.status] ?? "#60A5FA", border: `1px solid ${INV_COLORS[inv.status] ?? "#60A5FA"}40` }}>
                  {inv.status}
                </span>
                {inv.status !== "paid" && (
                  <button onClick={async () => {
                    const res = await api<{ data: Invoice }>(`/api/invoices/${inv.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount_paid: inv.total, status: "paid" }) });
                    if (res?.data) { setInvoices(p => p.map(i => i.id === inv.id ? { ...i, ...res.data } : i)); toast.success("Invoice marked paid"); }
                  }} className="font-cond text-[9px] tracking-wider uppercase px-2 py-1 bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30">
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Notifications View ─────────────────────────────────────────────────────

function NotificationsView({ onRead }: { onRead: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: Notification[] }>("/api/notifications").then(res => { setNotifications(res?.data ?? []); setLoading(false); });
  }, []);

  const markAllRead = async () => {
    await api("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setNotifications(p => p.map(n => ({ ...n, read: true })));
    onRead();
    toast.success("All notifications marked as read");
  };

  const NOTIF_ICONS: Record<string, React.ReactNode> = {
    new_lead: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    new_booking: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    estimate_approved: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    job_assigned: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    invoice_paid: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    upcoming_appointment: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    follow_up_overdue: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    system: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  };

  if (loading) return <LoadingState label="Loading notifications..." />;

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white mb-1">NOTIFICATIONS</h1>
          <p className="text-white/40 text-sm">{unread} unread · {notifications.length} total</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="font-cond text-xs tracking-widest uppercase px-4 py-2 text-white/50 border border-white/15 hover:text-white transition-colors">
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} label="No notifications" sub="New leads, bookings, and events will appear here" />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="flex gap-4 p-4 transition-all duration-200"
              style={{ background: n.read ? "rgba(255,255,255,0.02)" : "rgba(245,197,24,0.06)", border: n.read ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(245,197,24,0.15)" }}>
              <div className="flex-shrink-0 mt-0.5 text-white/50">{NOTIF_ICONS[n.type] ?? NOTIF_ICONS.system}</div>
              <div className="flex-1 min-w-0">
                <div className="font-cond font-bold text-sm text-white">{n.title}</div>
                <div className="text-white/60 text-sm font-light mt-0.5">{n.body}</div>
                <div className="text-white/25 text-xs mt-1">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {!n.read && (
                <button onClick={async () => {
                  await api("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) });
                  setNotifications(p => p.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                  onRead();
                }} className="text-white/20 hover:text-[#F5C518] transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Settings View ──────────────────────────────────────────────────────────

function SettingsView() {
  return (
    <div>
      <h1 className="font-display text-4xl text-white mb-6">SETTINGS</h1>
      <div className="space-y-4 max-w-2xl">
        <div className="p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="font-cond font-bold text-sm tracking-widest uppercase text-white mb-3">Environment Configuration</div>
          <div className="space-y-3 text-sm">
            {[
              { k: "NEXT_PUBLIC_SUPABASE_URL", l: "Supabase URL" },
              { k: "NEXT_PUBLIC_SUPABASE_ANON_KEY", l: "Supabase Anon Key" },
              { k: "SUPABASE_SERVICE_KEY", l: "Supabase Service Role Key" },
              { k: "RESEND_API_KEY", l: "Resend Email API Key" },
            ].map(item => (
              <div key={item.k} className="flex items-center gap-4 p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="font-cond text-xs text-white/50 w-48 flex-shrink-0">{item.l}</div>
                <div className="font-cond text-xs text-white/30">{item.k}</div>
              </div>
            ))}
            <div className="p-4 text-sm" style={{ background: "rgba(59,79,200,0.08)", border: "1px solid rgba(59,79,200,0.2)" }}>
              <div className="text-white/60">Configure these in your <code className="text-[#F5C518]">.env.local</code> file or Vercel environment variables. See <code className="text-[#F5C518]">.env.local.example</code> in the project root for a template.</div>
            </div>
          </div>
        </div>

        <div className="p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="font-cond font-bold text-sm tracking-widest uppercase text-white mb-3">Database</div>
          <div className="text-white/50 text-sm font-light mb-4">Run the schema SQL file in your Supabase SQL Editor to create all required tables.</div>
          <Link href="/" className="font-cond text-xs tracking-widest uppercase text-[#F5C518]">View supabase-schema.sql in project root →</Link>
        </div>

        <div className="p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="font-cond font-bold text-sm tracking-widest uppercase text-white mb-3">Company Info</div>
          <div className="space-y-2 text-sm">
            {[
              { l: "Business Name", v: "Ultimate Building Services, Inc." },
              { l: "Phone", v: "(702) 795-2855" },
              { l: "Email", v: "ultimate@prosharedservices.com" },
              { l: "Address", v: "2645 Sorrel St., Las Vegas, NV 89146" },
              { l: "License", v: "NV Lic #91170" },
            ].map(item => (
              <div key={item.l} className="flex gap-4 p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 w-32 flex-shrink-0 self-center">{item.l}</div>
                <div className="text-white/70 text-sm">{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mini lead table (for dashboard) ───────────────────────────────────────

function MiniLeadTable({ leads }: { leads: Lead[] }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
      {leads.map((l) => {
        const st = STATUS_MAP[l.status] ?? PIPELINE_STAGES[0];
        return (
          <div key={l.id} className="flex items-center gap-3 px-4 py-3 border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-light truncate">{l.company_name ?? [l.first_name, l.last_name].filter(Boolean).join(" ") ?? "—"}</div>
              <div className="text-white/30 text-xs truncate">{l.service ?? "—"}</div>
            </div>
            <span className="font-cond text-[10px] tracking-wider uppercase px-2 py-1 flex-shrink-0" style={{ background: st.bg, color: st.color }}>{st.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Shared UI Components ───────────────────────────────────────────────────

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-[#F5C518]/20 border-t-[#F5C518] rounded-full" />
      <div className="font-cond text-xs tracking-widest uppercase text-white/30">{label}</div>
    </div>
  );
}

function EmptyState({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.08)" }}>
      <div className="text-white/20 w-12 h-12 flex items-center justify-center">{icon}</div>
      <div className="font-cond font-bold text-sm tracking-widest uppercase text-white/40">{label}</div>
      {sub && <div className="text-white/20 text-xs font-light text-center max-w-xs">{sub}</div>}
    </div>
  );
}
