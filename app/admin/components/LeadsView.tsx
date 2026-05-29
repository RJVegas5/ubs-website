"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  StatusBadge, SlideOver, TabBar,
  fmt$, fmtDate, fmtDateTime, fmtRelative,
  EmptyState, SectionHeader,
} from "./shared";
import type { Lead, Appointment, Activity } from "@/lib/types";

// ── Local types ───────────────────────────────────────────────────────────────

interface Message {
  id: string;
  direction: "inbound" | "outbound";
  sender_name: string | null;
  subject: string | null;
  body: string;
  is_read: boolean;
  created_at: string;
}

// ── Pipeline config ───────────────────────────────────────────────────────────

const STAGES = [
  { id: "new",        label: "New",        color: "#F5C518", bg: "rgba(245,197,24,0.12)" },
  { id: "contacted",  label: "Contacted",  color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  { id: "qualified",  label: "Qualified",  color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  { id: "site_visit", label: "Site Visit", color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  { id: "site_visit_scheduled", label: "Site Visit", color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  { id: "quote_sent", label: "Quote Sent", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  { id: "negotiating",label: "Negotiating",color: "#EC4899", bg: "rgba(236,72,153,0.12)" },
  { id: "approved",   label: "Approved",   color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  { id: "won",        label: "Won",        color: "#6EE7B7", bg: "rgba(110,231,183,0.12)" },
  { id: "lost",       label: "Lost",       color: "#F87171", bg: "rgba(248,113,113,0.12)" },
];

const STAGE_IDS_UNIQUE = [
  "new","contacted","qualified","site_visit_scheduled","quote_sent",
  "negotiating","approved","won","lost",
];

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function api<T = unknown>(url: string, opts?: RequestInit): Promise<T | null> {
  try {
    const r = await fetch(url, opts);
    if (!r.ok) return null;
    return r.json() as Promise<T>;
  } catch { return null; }
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

const IC = {
  phone:    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  email:    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  calendar: <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  doc:      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  user:     <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  msg:      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  check:    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12"/></svg>,
  star:     <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  edit:     <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  photo:    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  send:     <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  activity: <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  building: <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  dollar:   <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  search:   <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter:   <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  sort:     <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>,
  convert:  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
};

// ── displayName helper ────────────────────────────────────────────────────────

function displayName(lead: Lead): string {
  return lead.company_name ?? [lead.first_name, lead.last_name].filter(Boolean).join(" ") ?? "Unknown";
}

function contactName(lead: Lead): string {
  return [lead.first_name, lead.last_name].filter(Boolean).join(" ");
}

// ── LeadsView ─────────────────────────────────────────────────────────────────

export default function LeadsView() {
  const [leads, setLeads]         = useState<Lead[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [selected, setSelected]   = useState<Lead | null>(null);
  const [addOpen, setAddOpen]     = useState(false);
  const [sortBy, setSortBy]       = useState<"created_at" | "estimated_value" | "company_name">("created_at");
  const searchTimer               = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLeads = useCallback(async (q = search, status = filterStatus) => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q)                  p.set("search", q);
    if (status !== "all")   p.set("status", status);
    const res = await api<{ data: Lead[] }>(`/api/leads?${p}`);
    setLeads(res?.data ?? []);
    setLoading(false);
  }, [search, filterStatus]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchLeads(val, filterStatus), 350);
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const res = await api<{ data: Lead }>(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res?.data) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...res.data } : l));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...res.data } : prev);
      toast.success("Lead updated");
      return true;
    }
    toast.error("Update failed");
    return false;
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    await api(`/api/leads/${id}`, { method: "DELETE" });
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelected(null);
    toast.success("Lead deleted");
  };

  // Sorted display
  const sortedLeads = [...leads].sort((a, b) => {
    if (sortBy === "estimated_value") return (b.estimated_value ?? 0) - (a.estimated_value ?? 0);
    if (sortBy === "company_name")    return (a.company_name ?? "").localeCompare(b.company_name ?? "");
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}>ALL LEADS</h1>
          <p className="text-white/40 text-sm">{leads.length} leads{filterStatus !== "all" ? ` · filtered by ${filterStatus}` : ""}</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 font-bold text-xs tracking-widest uppercase px-5 py-2.5 bg-[#F5C518] text-[#0D0F1E] hover:bg-white transition-colors"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Lead
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30">{IC.search}</span>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search company, contact, email…"
            className="pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "6px", width: "270px" }}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 text-white/30">{IC.sort}</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs font-medium text-white/60 focus:outline-none cursor-pointer"
            style={{ background: "transparent", border: "none" }}
          >
            <option value="created_at"      className="bg-[#0D0F1E]">Newest first</option>
            <option value="estimated_value" className="bg-[#0D0F1E]">Highest value</option>
            <option value="company_name"    className="bg-[#0D0F1E]">A → Z</option>
          </select>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1.5 flex-wrap ml-auto">
          {([{ id: "all", label: "All", color: "#F5C518", bg: "rgba(245,197,24,0.12)" } as typeof STAGES[0], ...STAGES.filter(s => STAGE_IDS_UNIQUE.includes(s.id))]).map(s => (
            <button
              key={s.id}
              onClick={() => { setFilter(s.id); fetchLeads(search, s.id); }}
              className="font-medium text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full transition-all"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: filterStatus === s.id ? `${s.color}20` : "rgba(255,255,255,0.04)",
                border: `1px solid ${filterStatus === s.id ? `${s.color}50` : "rgba(255,255,255,0.07)"}`,
                color: filterStatus === s.id ? s.color : "rgba(255,255,255,0.4)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LeadsTableSkeleton />
      ) : sortedLeads.length === 0 ? (
        <EmptyState
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label={search ? "No leads match your search" : "No leads yet"}
          sub="Quote submissions and bookings appear here automatically"
        />
      ) : (
        <LeadsTable leads={sortedLeads} onSelect={setSelected} />
      )}

      {/* Lead slide-over */}
      {selected && (
        <LeadSlideOver
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateLead}
          onDelete={deleteLead}
          onRefresh={() => fetchLeads()}
        />
      )}

      {/* Add lead modal */}
      {addOpen && (
        <AddLeadModal
          onClose={() => setAddOpen(false)}
          onAdd={() => { setAddOpen(false); fetchLeads(); }}
        />
      )}
    </div>
  );
}

// ── Leads table ───────────────────────────────────────────────────────────────

function LeadsTableSkeleton() {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b animate-pulse" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 rounded w-40" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-2.5 rounded w-24" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="h-2.5 rounded w-20" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-5 rounded-full w-16" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>
      ))}
    </div>
  );
}

function LeadsTable({ leads, onSelect }: { leads: Lead[]; onSelect: (l: Lead) => void }) {
  const cols = ["Company / Contact", "Service", "Value", "Source", "Created", "Status"];
  return (
    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
      {/* Header */}
      <div className="hidden md:grid px-5 py-3 border-b" style={{ gridTemplateColumns: "2fr 1.5fr 0.8fr 0.8fr 0.8fr 1fr", borderColor: "rgba(255,255,255,0.06)" }}>
        {cols.map(h => (
          <div key={h} className="font-bold text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#475569" }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      {leads.map((lead, idx) => {
        const stage = STAGES.find(s => s.id === lead.status) ?? STAGES[0];
        const initials = [lead.first_name?.[0], lead.last_name?.[0]].filter(Boolean).join("") || displayName(lead).slice(0, 2).toUpperCase();
        return (
          <div
            key={lead.id}
            onClick={() => onSelect(lead)}
            className="grid md:px-5 px-4 py-4 border-b cursor-pointer transition-colors hover:bg-white/[0.025] group"
            style={{ gridTemplateColumns: "2fr 1.5fr 0.8fr 0.8fr 0.8fr 1fr", borderColor: idx === leads.length - 1 ? "transparent" : "rgba(255,255,255,0.04)" }}
          >
            {/* Company + Contact */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: `${stage.color}20`, color: stage.color, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate group-hover:text-[#F5C518] transition-colors">{displayName(lead)}</div>
                {contactName(lead) && <div className="text-white/35 text-xs truncate">{contactName(lead)}</div>}
              </div>
            </div>

            {/* Service */}
            <div className="text-white/50 text-sm self-center truncate">{lead.service ?? "—"}</div>

            {/* Value */}
            <div className="self-center">
              {lead.estimated_value ? (
                <span className="text-sm font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#34D399" }}>{fmt$(lead.estimated_value)}<span className="text-xs font-normal text-white/30">/mo</span></span>
              ) : <span className="text-white/20 text-sm">—</span>}
            </div>

            {/* Source */}
            <div className="text-white/35 text-xs self-center font-bold tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{lead.source ?? "web"}</div>

            {/* Created */}
            <div className="text-white/35 text-xs self-center">{fmtDate(lead.created_at)}</div>

            {/* Status */}
            <div className="self-center"><StatusBadge status={lead.status} size="xs" /></div>
          </div>
        );
      })}
    </div>
  );
}

// ── Lead Slide-Over ───────────────────────────────────────────────────────────

type SlideTab = "overview" | "activity" | "messages" | "appointments" | "photos" | "documents";

function LeadSlideOver({ lead, onClose, onUpdate, onDelete, onRefresh }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, u: Partial<Lead>) => Promise<boolean>;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [tab, setTab]               = useState<SlideTab>("overview");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [msgBody, setMsgBody]       = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);

  useEffect(() => {
    api<{ data: Activity[] }>(`/api/activities?entity_type=lead&entity_id=${lead.id}&limit=30`)
      .then(r => setActivities(r?.data ?? []));
    api<{ messages: Message[] }>(`/api/messages?lead_id=${lead.id}`)
      .then(r => setMessages(r?.messages ?? []));
    api<{ data: Appointment[] }>(`/api/appointments?lead_id=${lead.id}`)
      .then(r => setAppointments(r?.data ?? []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  const fetchMessages = useCallback(async () => {
    const r = await api<{ messages: Message[] }>(`/api/messages?lead_id=${lead.id}`);
    setMessages(r?.messages ?? []);
  }, [lead.id]);

  const fetchAppointments = useCallback(async () => {
    const r = await api<{ data: Appointment[] }>(`/api/appointments?lead_id=${lead.id}`);
    setAppointments(r?.data ?? []);
  }, [lead.id]);

  const sendMessage = async () => {
    if (!msgBody.trim()) return;
    setSendingMsg(true);
    const res = await api("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id: lead.id,
        direction: "outbound",
        sender_name: "UBS Team",
        body: msgBody.trim(),
      }),
    });
    setSendingMsg(false);
    if (res) {
      setMsgBody("");
      fetchMessages();
      toast.success("Message sent");
    } else toast.error("Failed to send");
  };

  const handleConvertToCustomer = async () => {
    if (!confirm("Convert this lead to a customer? This creates a new customer record.")) return;
    const res = await api<{ data: { customer_id: string } }>(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "won", converted_to_customer: true }),
    });
    if (res) {
      toast.success("Converted to customer");
      onRefresh();
      onClose();
    } else toast.error("Conversion failed");
  };

  const tabs: { id: SlideTab; label: string; count?: number }[] = [
    { id: "overview",     label: "Overview" },
    { id: "activity",     label: "Activity",     count: activities.length },
    { id: "messages",     label: "Messages",     count: messages.filter(m => !m.is_read && m.direction === "inbound").length || undefined },
    { id: "appointments", label: "Appointments", count: appointments.length },
    { id: "photos",       label: "Photos" },
    { id: "documents",    label: "Docs" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }} onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-2xl flex flex-col h-full shadow-2xl"
        style={{ background: "#0A0C1B", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white truncate">{displayName(lead)}</h2>
              {contactName(lead) && (
                <p className="text-sm mt-0.5 truncate" style={{ color: "#64748B" }}>{contactName(lead)}</p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StatusBadge status={lead.status} />
                {lead.estimated_value && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(52,211,153,0.12)", color: "#34D399", fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {fmt$(lead.estimated_value)}/mo
                  </span>
                )}
                {lead.source && (
                  <span className="text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "#64748B", fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {lead.source}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors text-white/40 hover:text-white hover:bg-white/5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Quick action bar */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {lead.phone && (
              <a href={`tel:${lead.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(245,197,24,0.12)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.25)", letterSpacing: "0.08em" }}>
                <span className="w-3.5 h-3.5">{IC.phone}</span> CALL
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(59,79,200,0.12)", color: "#93A3F8", border: "1px solid rgba(59,79,200,0.25)", letterSpacing: "0.08em" }}>
                <span className="w-3.5 h-3.5">{IC.email}</span> EMAIL
              </a>
            )}
            <button
              onClick={() => { setTab("appointments"); setOpenSchedule(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(251,146,60,0.12)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.25)", letterSpacing: "0.08em" }}>
              <span className="w-3.5 h-3.5">{IC.calendar}</span> SCHEDULE
            </button>
            <button
              onClick={() => setTab("messages")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(167,139,250,0.12)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.25)", letterSpacing: "0.08em" }}>
              <span className="w-3.5 h-3.5">{IC.msg}</span> MESSAGE
            </button>
            {!lead.converted_to_customer && (
              <button
                onClick={handleConvertToCustomer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-auto"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.25)", letterSpacing: "0.08em" }}>
                <span className="w-3.5 h-3.5">{IC.convert}</span> CONVERT
              </button>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex-shrink-0">
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {tab === "overview" && (
            <OverviewTab lead={lead} onUpdate={onUpdate} onDelete={onDelete} />
          )}
          {tab === "activity" && (
            <ActivityTab activities={activities} lead={lead} onRefresh={() =>
              api<{ data: Activity[] }>(`/api/activities?entity_type=lead&entity_id=${lead.id}&limit=30`)
                .then(r => setActivities(r?.data ?? []))
            } />
          )}
          {tab === "messages" && (
            <MessagesTab
              messages={messages}
              msgBody={msgBody}
              sending={sendingMsg}
              onChange={setMsgBody}
              onSend={sendMessage}
            />
          )}
          {tab === "appointments" && (
            <AppointmentsTab
              lead={lead}
              appointments={appointments}
              openOnMount={openSchedule}
              onRefresh={fetchAppointments}
            />
          )}
          {tab === "photos" && <PhotosTab lead={lead} />}
          {tab === "documents" && <DocumentsTab />}
        </div>
      </div>
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────

function OverviewTab({ lead, onUpdate, onDelete }: {
  lead: Lead;
  onUpdate: (id: string, u: Partial<Lead>) => Promise<boolean>;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes]   = useState(lead.notes ?? "");
  const [value, setValue]   = useState(String(lead.estimated_value ?? ""));
  const [fDate, setFDate]   = useState(lead.follow_up_date?.split("T")[0] ?? "");

  const save = (field: keyof Lead, v: unknown) => onUpdate(lead.id, { [field]: v } as Partial<Lead>);

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#475569" }}>{label}</div>
      <div className="text-sm text-white/80">{children}</div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Contact info */}
      <section>
        <SectionHeader title="Contact Information" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          {lead.email && <Field label="Email"><a href={`mailto:${lead.email}`} className="text-[#93A3F8] hover:underline truncate block">{lead.email}</a></Field>}
          {lead.phone && <Field label="Phone"><a href={`tel:${lead.phone}`} className="text-[#F5C518]">{lead.phone}</a></Field>}
          {lead.company_name && <Field label="Company">{lead.company_name}</Field>}
          {(lead.first_name || lead.last_name) && <Field label="Contact">{[lead.first_name, lead.last_name].filter(Boolean).join(" ")}</Field>}
          {lead.address && <Field label="Address" ><span className="text-white/60">{lead.address}</span></Field>}
          {lead.source && <Field label="Lead Source"><span className="uppercase tracking-wider text-xs font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#64748B" }}>{lead.source}</span></Field>}
        </div>
      </section>

      {/* Service details */}
      <section>
        <SectionHeader title="Service Details" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
          {lead.service && <Field label="Service">{lead.service}</Field>}
          {lead.building_type && <Field label="Building Type">{lead.building_type}</Field>}
          {lead.sq_footage && <Field label="Sq Footage">{lead.sq_footage} sq ft</Field>}
          {lead.frequency && <Field label="Frequency">{lead.frequency}</Field>}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#475569" }}>Est. Monthly Value</div>
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              onBlur={() => save("estimated_value", parseFloat(value) || null)}
              placeholder="0"
              className="text-sm font-bold focus:outline-none bg-transparent w-full"
              style={{ color: "#34D399", fontFamily: "'Barlow Condensed', sans-serif" }}
            />
          </div>
        </div>
      </section>

      {/* Pipeline stage */}
      <section>
        <SectionHeader title="Pipeline Stage" />
        <div className="grid grid-cols-3 gap-2">
          {STAGES.filter(s => STAGE_IDS_UNIQUE.includes(s.id)).map(s => (
            <button
              key={s.id}
              onClick={() => save("status", s.id)}
              className="py-2.5 px-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: lead.status === s.id ? s.bg : "rgba(255,255,255,0.03)",
                border: `1px solid ${lead.status === s.id ? s.color + "60" : "rgba(255,255,255,0.07)"}`,
                color: lead.status === s.id ? s.color : "rgba(255,255,255,0.3)",
              }}
            >
              {lead.status === s.id && <span className="mr-1">✓</span>}{s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Follow-up */}
      <section>
        <SectionHeader title="Follow-up Date" />
        <input
          type="date"
          value={fDate}
          onChange={e => setFDate(e.target.value)}
          onBlur={() => save("follow_up_date", fDate || null)}
          className="text-sm text-white focus:outline-none px-3 py-2 rounded-lg w-full"
          style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
        />
      </section>

      {/* Notes */}
      <section>
        <SectionHeader title="Internal Notes" />
        <textarea
          rows={4}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={() => save("notes", notes)}
          placeholder="Add internal notes…"
          className="w-full text-sm text-white/70 focus:outline-none resize-none px-4 py-3 rounded-xl"
          style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.07)" }}
        />
      </section>

      {/* Meta */}
      <section className="text-xs space-y-1 pb-2" style={{ color: "#475569" }}>
        <div>Created: {fmtDateTime(lead.created_at)}</div>
        {lead.updated_at && <div>Updated: {fmtRelative(lead.updated_at)}</div>}
        {lead.connecteam_sync_status && (
          <div>Connecteam: <span style={{ color: lead.connecteam_sync_status === "synced" ? "#34D399" : "#F87171" }}>{lead.connecteam_sync_status}</span></div>
        )}
      </section>

      {/* Danger zone */}
      <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <button
          onClick={() => onDelete(lead.id)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "rgba(248,113,113,0.5)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#F87171")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.5)")}
        >
          <span className="w-3.5 h-3.5">{IC.trash}</span> Delete Lead
        </button>
      </div>
    </div>
  );
}

// ── Activity tab ──────────────────────────────────────────────────────────────

function ActivityTab({ activities, lead, onRefresh }: { activities: Activity[]; lead: Lead; onRefresh: () => void }) {
  const [note, setNote]     = useState("");
  const [saving, setSaving] = useState(false);

  const logNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    await api("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity_type: "lead", entity_id: lead.id, action: "note", description: note.trim(), created_by: "admin" }),
    });
    setSaving(false);
    setNote("");
    onRefresh();
    toast.success("Note logged");
  };

  const actionColor = (action: string) => {
    if (action.includes("created") || action.includes("new"))  return "#F5C518";
    if (action.includes("status") || action.includes("moved")) return "#3B4FC8";
    if (action.includes("message"))  return "#A78BFA";
    if (action.includes("appt") || action.includes("schedule")) return "#FB923C";
    if (action.includes("synced"))   return "#34D399";
    if (action.includes("failed"))   return "#F87171";
    return "#64748B";
  };

  const actionIcon = (action: string) => {
    if (action.includes("message"))  return IC.msg;
    if (action.includes("appt") || action.includes("schedule")) return IC.calendar;
    if (action.includes("synced"))   return IC.check;
    if (action.includes("note"))     return IC.edit;
    return IC.activity;
  };

  return (
    <div className="p-6 space-y-5">
      {/* Log a note */}
      <div className="p-4 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#475569" }}>Log a Note</div>
        <textarea
          rows={2}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Type a note or activity…"
          className="w-full text-sm text-white/70 focus:outline-none resize-none bg-transparent mb-3"
        />
        <button
          onClick={logNote}
          disabled={saving || !note.trim()}
          className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(245,197,24,0.15)", color: "#F5C518", borderRadius: "6px" }}
        >
          {saving ? "Saving…" : "Log Note"}
        </button>
      </div>

      {/* Timeline */}
      {activities.length === 0 ? (
        <EmptyState icon={IC.activity} label="No activity yet" sub="Status changes, notes, and messages will appear here" />
      ) : (
        <div className="space-y-0">
          {activities.map((a, i) => (
            <div key={a.id} className="flex gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${actionColor(a.action)}20`, color: actionColor(a.action), border: `1px solid ${actionColor(a.action)}40` }}>
                  <div className="w-3 h-3">{actionIcon(a.action)}</div>
                </div>
                {i < activities.length - 1 && <div className="w-px flex-1 mt-1 mb-0" style={{ background: "rgba(255,255,255,0.05)", minHeight: "20px" }} />}
              </div>
              <div className={`${i < activities.length - 1 ? "pb-5" : "pb-2"} flex-1 min-w-0`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm text-white/75 font-medium leading-snug">{a.description}</span>
                  <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: "#475569" }}>{fmtRelative(a.created_at)}</span>
                </div>
                <div className="text-[10px] mt-0.5 uppercase tracking-wider font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#374151" }}>{a.action}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Messages tab ──────────────────────────────────────────────────────────────

function MessagesTab({ messages, msgBody, sending, onChange, onSend }: {
  messages: Message[];
  msgBody: string;
  sending: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Message thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <EmptyState icon={IC.msg} label="No messages yet" sub="Outbound messages and customer replies appear here" />
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] px-4 py-3 rounded-xl"
                style={{
                  background: m.direction === "outbound" ? "rgba(59,79,200,0.25)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${m.direction === "outbound" ? "rgba(59,79,200,0.3)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {m.subject && <div className="text-xs font-bold mb-1" style={{ color: "#93A3F8" }}>{m.subject}</div>}
                <div className="text-sm text-white/80 leading-relaxed">{m.body}</div>
                <div className="text-[10px] mt-1.5 text-right" style={{ color: "#475569" }}>
                  {m.sender_name ?? (m.direction === "outbound" ? "UBS Team" : "Customer")} · {fmtRelative(m.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose */}
      <div className="flex-shrink-0 border-t p-4" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex gap-2 items-end">
          <textarea
            rows={2}
            value={msgBody}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder="Type a message… (Enter to send)"
            className="flex-1 text-sm text-white/80 placeholder:text-white/25 focus:outline-none resize-none px-3 py-2.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
          />
          <button
            onClick={onSend}
            disabled={sending || !msgBody.trim()}
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40"
            style={{ background: "rgba(245,197,24,0.15)", color: "#F5C518" }}
          >
            <span className="w-4 h-4">{IC.send}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Appointments tab ──────────────────────────────────────────────────────────

function AppointmentsTab({ lead, appointments, openOnMount = false, onRefresh }: {
  lead: Lead;
  appointments: Appointment[];
  openOnMount?: boolean;
  onRefresh: () => void;
}) {
  const [formOpen, setFormOpen] = useState(openOnMount);

  const handleScheduled = () => {
    setFormOpen(false);
    onRefresh();
    toast.success("Appointment scheduled");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader title={`Appointments (${appointments.length})`} />
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(251,146,60,0.12)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.25)" }}
          >
            + Schedule
          </button>
        )}
      </div>

      {appointments.length === 0 && !formOpen && (
        <EmptyState icon={IC.calendar} label="No appointments" sub="Scheduled site visits and estimates appear here" />
      )}

      {appointments.length > 0 && (
        <div className="space-y-2">
          {appointments.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,79,200,0.15)", color: "#93A3F8" }}>
                <span className="w-5 h-5">{IC.calendar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{a.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{fmtDateTime(a.start_datetime)}</div>
              </div>
              <StatusBadge status={a.status} size="xs" />
            </div>
          ))}
        </div>
      )}

      {/* Quick schedule form */}
      {formOpen && (
        <QuickScheduleForm lead={lead} onCancel={() => setFormOpen(false)} onScheduled={handleScheduled} />
      )}
    </div>
  );
}

function QuickScheduleForm({ lead, onCancel, onScheduled }: { lead: Lead; onCancel: () => void; onScheduled: () => void }) {
  const [form, setForm] = useState({
    title: `Site Visit — ${lead.company_name ?? [lead.first_name, lead.last_name].filter(Boolean).join(" ") ?? "Lead"}`,
    type: "site_visit",
    start_datetime: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_datetime) return toast.error("Please select a date/time");
    setSaving(true);
    const res = await api("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lead_id: lead.id, contact_name: [lead.first_name, lead.last_name].filter(Boolean).join(" "), company_name: lead.company_name, phone: lead.phone, address: lead.address }),
    });
    setSaving(false);
    if (res) onScheduled(); else toast.error("Failed to schedule");
  };

  return (
    <form onSubmit={submit} className="p-4 rounded-xl space-y-3" style={{ background: "#0D0F1E", border: "1px solid rgba(251,146,60,0.2)" }}>
      <div className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FB923C" }}>Schedule Appointment</div>
      <input
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="Appointment title"
        className="w-full text-sm text-white focus:outline-none px-3 py-2 rounded-lg"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
      />
      <select
        value={form.type}
        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
        className="w-full text-sm text-white focus:outline-none px-3 py-2 rounded-lg"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
      >
        <option value="site_visit"        className="bg-[#0D0F1E]">Site Visit</option>
        <option value="estimate"          className="bg-[#0D0F1E]">Estimate</option>
        <option value="follow_up"         className="bg-[#0D0F1E]">Follow-up</option>
        <option value="cleaning_service"  className="bg-[#0D0F1E]">Cleaning Service</option>
      </select>
      <input
        type="datetime-local"
        value={form.start_datetime}
        onChange={e => setForm(f => ({ ...f, start_datetime: e.target.value }))}
        className="w-full text-sm text-white focus:outline-none px-3 py-2 rounded-lg"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", colorScheme: "dark" }}
      />
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}>Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg disabled:opacity-40" style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(251,146,60,0.2)", color: "#FB923C" }}>{saving ? "Scheduling…" : "Schedule"}</button>
      </div>
    </form>
  );
}

// ── Photos tab ────────────────────────────────────────────────────────────────

function PhotosTab({ lead }: { lead: Lead }) {
  return (
    <div className="p-6">
      <EmptyState
        icon={IC.photo}
        label="No photos yet"
        sub="Photos are linked to jobs. Create a job for this lead to start uploading before/after photos."
      />
    </div>
  );
}

// ── Documents tab ─────────────────────────────────────────────────────────────

function DocumentsTab() {
  return (
    <div className="p-6">
      <EmptyState icon={IC.doc} label="No documents yet" sub="Estimates and contracts will appear here once created" />
    </div>
  );
}

// ── Add Lead Modal ────────────────────────────────────────────────────────────

function AddLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [form, setForm] = useState({
    company_name: "", first_name: "", last_name: "",
    email: "", phone: "", service: "", address: "", notes: "",
    estimated_value: "", source: "admin",
  });
  const [loading, setLoading] = useState(false);

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null,
      status: "new",
    };
    const res = await api("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res) { toast.success("Lead added"); onAdd(); } else toast.error("Failed to add lead");
  };

  const inputCls = "w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none rounded-lg";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" };
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest mb-1.5";
  const labelStyle = { fontFamily: "'Barlow Condensed', sans-serif", color: "#475569" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl" style={{ background: "#0D0F1E", border: "1px solid rgba(245,197,24,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}>ADD LEAD</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls} style={labelStyle}>Company Name</label>
              <input {...field("company_name")} placeholder="Acme Properties LLC" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>First Name</label>
              <input {...field("first_name")} placeholder="John" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Last Name</label>
              <input {...field("last_name")} placeholder="Smith" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Email</label>
              <input type="email" {...field("email")} placeholder="john@company.com" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Phone</label>
              <input type="tel" {...field("phone")} placeholder="(702) 000-0000" className={inputCls} style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label className={labelCls} style={labelStyle}>Service Needed</label>
              <input {...field("service")} placeholder="Commercial Janitorial, Strip & Wax…" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Est. Value ($/mo)</label>
              <input type="number" {...field("estimated_value")} placeholder="1500" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Source</label>
              <select {...field("source")} className={inputCls} style={inputStyle}>
                {["admin","web","referral","phone","google","yelp","direct"].map(s => (
                  <option key={s} value={s} className="bg-[#0D0F1E]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls} style={labelStyle}>Address</label>
              <input {...field("address")} placeholder="123 Main St, Las Vegas, NV" className={inputCls} style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label className={labelCls} style={labelStyle}>Notes</label>
              <textarea rows={2} {...field("notes")} placeholder="Initial notes…"
                className="w-full px-3 py-2.5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none resize-none rounded-lg"
                style={inputStyle} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-60"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", background: "#F5C518", color: "#0D0F1E" }}>
              {loading ? "Adding…" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
