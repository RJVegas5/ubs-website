"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for demo — in production this pulls from Supabase
const MOCK_LEADS = [
  { id: 1, name: "Sarah Mitchell", company: "Summerlin Medical Center", service: "Commercial Janitorial", date: "2025-06-05", phone: "(702) 555-0101", email: "s.mitchell@smcenter.com", address: "8901 W Sahara Ave, Las Vegas", status: "new", size: "10,000-25,000 sq ft", frequency: "Weekly", value: 2400 },
  { id: 2, name: "James Ortega", company: "Henderson Tech Campus", service: "Electrostatic Disinfection", date: "2025-06-06", phone: "(702) 555-0102", email: "j.ortega@hendtec.com", address: "123 Corporate Park Dr, Henderson", status: "contacted", size: "25,000+ sq ft", frequency: "Bi-weekly", value: 3800 },
  { id: 3, name: "Linda Park", company: "Desert Palms Retail", service: "Pressure Washing", date: "2025-06-04", phone: "(702) 555-0103", email: "lpark@desertpalms.com", address: "4500 Blue Diamond Rd, Las Vegas", status: "scheduled", size: "2,500-10,000 sq ft", frequency: "Monthly", value: 950 },
  { id: 4, name: "Robert Chen", company: "North LV Warehouse Co.", service: "Building Maintenance", date: "2025-06-03", phone: "(702) 555-0104", email: "r.chen@nlvwh.com", address: "7200 Industrial Rd, N Las Vegas", status: "quote_sent", size: "25,000+ sq ft", frequency: "Weekly", value: 5200 },
  { id: 5, name: "Maria Garcia", company: "Summerlin Charter School", service: "Carpet & Floor Care", date: "2025-06-02", phone: "(702) 555-0105", email: "m.garcia@slcharter.edu", address: "3300 N Durango Dr, Las Vegas", status: "approved", size: "10,000-25,000 sq ft", frequency: "Monthly", value: 1800 },
  { id: 6, name: "Tom Bradley", company: "Vegas Valley Restaurant Group", service: "Commercial Janitorial", date: "2025-06-01", phone: "(702) 555-0106", email: "t.bradley@vvrg.com", address: "Multiple Locations, Las Vegas", status: "completed", size: "2,500-10,000 sq ft", frequency: "Weekly", value: 3200 },
];

const STATUSES = [
  { id: "new", label: "New Lead", color: "#F5C518", bg: "rgba(245,197,24,0.15)" },
  { id: "contacted", label: "Contacted", color: "#60A5FA", bg: "rgba(96,165,250,0.15)" },
  { id: "scheduled", label: "Scheduled", color: "#A78BFA", bg: "rgba(167,139,250,0.15)" },
  { id: "quote_sent", label: "Quote Sent", color: "#FB923C", bg: "rgba(251,146,60,0.15)" },
  { id: "approved", label: "Approved", color: "#34D399", bg: "rgba(52,211,153,0.15)" },
  { id: "completed", label: "Completed", color: "#6EE7B7", bg: "rgba(110,231,183,0.15)" },
  { id: "lost", label: "Lost", color: "#F87171", bg: "rgba(248,113,113,0.15)" },
];

type View = "dashboard" | "leads" | "kanban" | "calendar";

export default function AdminDashboard() {
  const [view, setView] = useState<View>("dashboard");
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [selected, setSelected] = useState<typeof MOCK_LEADS[0] | null>(null);
  const [search, setSearch] = useState("");

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    approved: leads.filter(l => l.status === "approved" || l.status === "completed").length,
    revenue: leads.filter(l => l.status === "approved" || l.status === "completed").reduce((s, l) => s + l.value, 0),
    conversion: Math.round(leads.filter(l => l.status === "approved" || l.status === "completed").length / leads.length * 100),
  };

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.service.toLowerCase().includes(search.toLowerCase())
  );

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "leads", label: "All Leads", icon: "👥" },
    { id: "kanban", label: "Pipeline", icon: "📋" },
    { id: "calendar", label: "Calendar", icon: "📅" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#070915", fontFamily: "'Barlow', sans-serif" }}>
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 flex flex-col" style={{ background: "#0D0F1E", borderRight: "1px solid rgba(245,197,24,0.1)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(245,197,24,0.1)" }}>
          <div className="font-cond font-bold text-white text-sm tracking-widest uppercase">UBS Admin</div>
          <div className="text-white/30 text-xs mt-0.5">Management Dashboard</div>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm mb-1 transition-all duration-200 ${view === item.id ? "text-[#F5C518]" : "text-white/50 hover:text-white"}`}
              style={{ background: view === item.id ? "rgba(245,197,24,0.1)" : "transparent" }}>
              <span>{item.icon}</span>
              <span className="font-cond text-xs tracking-wider uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <a href="/" className="text-white/30 text-xs font-cond tracking-wider hover:text-white transition-colors">← Back to Site</a>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {/* Dashboard */}
              {view === "dashboard" && (
                <div>
                  <h1 className="font-display text-4xl text-white mb-1">DASHBOARD</h1>
                  <p className="text-white/40 text-sm font-light mb-8">Overview of your leads and business performance</p>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {[
                      { label: "Total Leads", value: stats.total, icon: "👥", color: "#60A5FA" },
                      { label: "New This Week", value: stats.new, icon: "🔔", color: "#F5C518" },
                      { label: "Jobs Won", value: stats.approved, icon: "✅", color: "#34D399" },
                      { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: "💰", color: "#A78BFA" },
                      { label: "Conversion", value: `${stats.conversion}%`, icon: "📈", color: "#FB923C" },
                    ].map(s => (
                      <div key={s.label} className="p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px" }}>
                        <div className="text-2xl mb-3">{s.icon}</div>
                        <div className="font-display text-3xl mb-1" style={{ color: s.color }}>{s.value}</div>
                        <div className="font-cond text-[10px] tracking-widest uppercase text-white/35">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent leads */}
                  <h2 className="font-cond font-bold text-sm tracking-widest uppercase text-white/50 mb-4">Recent Leads</h2>
                  <LeadsTable leads={leads.slice(0,5)} onSelect={setSelected} />
                </div>
              )}

              {/* All Leads */}
              {view === "leads" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="font-display text-4xl text-white mb-1">ALL LEADS</h1>
                      <p className="text-white/40 text-sm">{filtered.length} leads found</p>
                    </div>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
                      className="px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", width: "220px" }} />
                  </div>
                  <LeadsTable leads={filtered} onSelect={setSelected} />
                </div>
              )}

              {/* Kanban */}
              {view === "kanban" && (
                <div>
                  <h1 className="font-display text-4xl text-white mb-1">LEAD PIPELINE</h1>
                  <p className="text-white/40 text-sm mb-8">Drag leads between stages to track progress</p>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {STATUSES.map(status => {
                      const statusLeads = leads.filter(l => l.status === status.id);
                      return (
                        <div key={status.id} className="flex-shrink-0 w-56">
                          <div className="flex items-center justify-between mb-3 px-1">
                            <span className="font-cond text-xs tracking-widest uppercase" style={{ color: status.color }}>{status.label}</span>
                            <span className="font-cond text-xs text-white/30 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>{statusLeads.length}</span>
                          </div>
                          <div className="space-y-2 min-h-[200px] p-2 rounded" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                            {statusLeads.map(lead => (
                              <motion.div key={lead.id} whileHover={{ scale: 1.02 }} onClick={() => setSelected(lead)}
                                className="p-3 cursor-pointer rounded" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${status.color}25` }}>
                                <div className="font-cond font-bold text-xs text-white mb-0.5 truncate">{lead.company}</div>
                                <div className="text-white/40 text-xs truncate">{lead.service}</div>
                                <div className="text-xs mt-2 font-cond font-bold" style={{ color: status.color }}>${lead.value.toLocaleString()}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Calendar */}
              {view === "calendar" && (
                <div>
                  <h1 className="font-display text-4xl text-white mb-1">CALENDAR</h1>
                  <p className="text-white/40 text-sm mb-8">Scheduled appointments and service dates</p>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                      <div key={d} className="text-center font-cond text-xs tracking-wider uppercase text-white/30 py-2">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({length:30}, (_,i) => i+1).map(d => {
                      const dayLeads = leads.filter(l => l.date.endsWith(`-0${d}`) || l.date.endsWith(`-${d}`));
                      return (
                        <div key={d} className="min-h-20 p-2 rounded" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div className="font-cond text-xs text-white/30 mb-1">{d}</div>
                          {dayLeads.map(l => (
                            <div key={l.id} onClick={() => setSelected(l)} className="text-[9px] font-cond p-1 rounded mb-0.5 truncate cursor-pointer"
                              style={{ background: "rgba(245,197,24,0.15)", color: "#F5C518" }}>
                              {l.company}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
            className="fixed top-0 right-0 h-full w-96 overflow-y-auto z-50 shadow-2xl"
            style={{ background: "#0D0F1E", borderLeft: "1px solid rgba(245,197,24,0.15)" }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-display text-2xl text-white">{selected.company}</div>
                  <div className="text-white/40 text-sm">{selected.name}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-xl">×</button>
              </div>

              {/* Status badge */}
              <div className="mb-6">
                {(() => { const s = STATUSES.find(st => st.id === selected.status)!; return (
                  <span className="font-cond text-xs tracking-widest uppercase px-3 py-1.5 rounded-sm" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                ); })()}
              </div>

              <div className="space-y-4">
                {[
                  { label: "Service Requested", value: selected.service },
                  { label: "Phone", value: selected.phone },
                  { label: "Email", value: selected.email },
                  { label: "Address", value: selected.address },
                  { label: "Facility Size", value: selected.size },
                  { label: "Frequency", value: selected.frequency },
                  { label: "Requested Date", value: selected.date },
                  { label: "Estimated Value", value: `$${selected.value.toLocaleString()}/mo` },
                ].map(item => (
                  <div key={item.label} className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    <div className="font-cond text-[10px] tracking-widest uppercase text-white/30 mb-1">{item.label}</div>
                    <div className="text-white text-sm font-light">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="font-cond text-xs tracking-widest uppercase text-white/30 mb-3">Update Status</div>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.slice(0,6).map(s => (
                    <button key={s.id} onClick={() => setLeads(prev => prev.map(l => l.id === selected.id ? {...l, status: s.id} : l))}
                      className="py-2 font-cond text-[10px] tracking-widest uppercase transition-all"
                      style={{ background: selected.status === s.id ? s.bg : "rgba(255,255,255,0.03)", border: `1px solid ${selected.status === s.id ? s.color + "50" : "rgba(255,255,255,0.08)"}`, borderRadius: "2px", color: selected.status === s.id ? s.color : "rgba(255,255,255,0.4)" }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a href={`tel:${selected.phone}`} className="flex-1 py-3 text-center font-cond font-bold text-xs tracking-widest uppercase transition-colors"
                  style={{ background: "#F5C518", color: "#0D0F1E", borderRadius: "2px" }}>📞 Call</a>
                <a href={`mailto:${selected.email}`} className="flex-1 py-3 text-center font-cond font-bold text-xs tracking-widest uppercase transition-colors"
                  style={{ background: "rgba(59,79,200,0.3)", color: "white", border: "1px solid rgba(59,79,200,0.4)", borderRadius: "2px" }}>✉️ Email</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LeadsTable({ leads, onSelect }: { leads: typeof MOCK_LEADS; onSelect: (l: typeof MOCK_LEADS[0]) => void }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
      <div className="grid grid-cols-6 gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {["Company", "Service", "Date", "Phone", "Value", "Status"].map(h => (
          <div key={h} className="font-cond text-[10px] tracking-widest uppercase text-white/25">{h}</div>
        ))}
      </div>
      {leads.map(lead => {
        const status = STATUSES.find(s => s.id === lead.status)!;
        return (
          <motion.div key={lead.id} whileHover={{ background: "rgba(255,255,255,0.04)" }} onClick={() => onSelect(lead)}
            className="grid grid-cols-6 gap-3 px-4 py-4 cursor-pointer border-b transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <div>
              <div className="text-white text-sm font-light truncate">{lead.company}</div>
              <div className="text-white/30 text-xs truncate">{lead.name}</div>
            </div>
            <div className="text-white/60 text-sm font-light truncate self-center">{lead.service}</div>
            <div className="text-white/60 text-sm font-light self-center">{lead.date}</div>
            <div className="text-white/60 text-sm font-light self-center">{lead.phone}</div>
            <div className="font-cond font-bold text-sm self-center" style={{ color: "#34D399" }}>${lead.value.toLocaleString()}</div>
            <div className="self-center">
              <span className="font-cond text-[10px] tracking-wider uppercase px-2 py-1 rounded-sm" style={{ background: status.bg, color: status.color }}>{status.label}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
