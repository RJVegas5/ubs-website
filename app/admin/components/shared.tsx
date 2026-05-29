"use client";

// ── Shared primitives used across all CRM views ───────────────────────────────

export function fmt$(n: number | null | undefined) {
  if (n == null) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmtDateTime(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function fmtRelative(d: string | null | undefined) {
  if (!d) return "—";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return fmtDate(d);
}

// ── Status maps ───────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { bg: string; text: string; dot: string }> = {
  new:          { bg: "rgba(59,79,200,0.15)",  text: "#93A3F8", dot: "#3B4FC8" },
  contacted:    { bg: "rgba(245,197,24,0.12)", text: "#F5C518", dot: "#F5C518" },
  qualified:    { bg: "rgba(245,197,24,0.12)", text: "#F5C518", dot: "#F5C518" },
  site_visit:   { bg: "rgba(251,146,60,0.15)", text: "#FDBA74", dot: "#F97316" },
  quote_sent:   { bg: "rgba(168,85,247,0.15)", text: "#D8B4FE", dot: "#A855F7" },
  negotiating:  { bg: "rgba(251,146,60,0.15)", text: "#FDBA74", dot: "#F97316" },
  approved:     { bg: "rgba(16,185,129,0.15)", text: "#6EE7B7", dot: "#10B981" },
  won:          { bg: "rgba(16,185,129,0.15)", text: "#6EE7B7", dot: "#10B981" },
  lost:         { bg: "rgba(239,68,68,0.12)",  text: "#FCA5A5", dot: "#EF4444" },
  scheduled:    { bg: "rgba(59,79,200,0.15)",  text: "#93A3F8", dot: "#3B4FC8" },
  confirmed:    { bg: "rgba(16,185,129,0.15)", text: "#6EE7B7", dot: "#10B981" },
  in_progress:  { bg: "rgba(245,197,24,0.12)", text: "#F5C518", dot: "#F5C518" },
  completed:    { bg: "rgba(16,185,129,0.15)", text: "#6EE7B7", dot: "#10B981" },
  cancelled:    { bg: "rgba(239,68,68,0.12)",  text: "#FCA5A5", dot: "#EF4444" },
  draft:        { bg: "rgba(100,116,139,0.15)",text: "#94A3B8", dot: "#64748B" },
  sent:         { bg: "rgba(59,79,200,0.15)",  text: "#93A3F8", dot: "#3B4FC8" },
  paid:         { bg: "rgba(16,185,129,0.15)", text: "#6EE7B7", dot: "#10B981" },
  overdue:      { bg: "rgba(239,68,68,0.12)",  text: "#FCA5A5", dot: "#EF4444" },
  partial:      { bg: "rgba(245,197,24,0.12)", text: "#F5C518", dot: "#F5C518" },
};

export function StatusBadge({ status, size = "sm" }: { status: string; size?: "xs" | "sm" }) {
  const s = STATUS_MAP[status] ?? { bg: "rgba(100,116,139,0.15)", text: "#94A3B8", dot: "#64748B" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full capitalize ${size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"}`}
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "rgba(255,255,255,0.05)" }} />;
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl" style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}>
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-3 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 mb-4 opacity-30" style={{ color: "#F5C518" }}>{icon}</div>
      <div className="font-semibold text-white/70 text-sm mb-1">{label}</div>
      {sub && <div className="text-white/30 text-xs max-w-xs">{sub}</div>}
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────

export function KpiCard({
  label, value, sub, icon, accent, onClick, trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
  onClick?: () => void;
  trend?: { value: number; label: string };
}) {
  const accentColor = accent ?? "#F5C518";
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl transition-all duration-200 group ${onClick ? "cursor-pointer hover:scale-[1.01]" : "cursor-default"}`}
      style={{ background: "#0D0F1E", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}18`, color: accentColor }}>
          <div className="w-4 h-4">{icon}</div>
        </div>
        {trend && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${trend.value >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
        {value}
      </div>
      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "#64748B" }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "#475569" }}>{sub}</div>}
    </button>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>{title}</h2>
      {action}
    </div>
  );
}

// ── Panel / slide-over wrapper ────────────────────────────────────────────────

export function SlideOver({
  open, onClose, title, subtitle, children, width = "max-w-2xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      {/* Panel */}
      <div className={`relative ml-auto w-full ${width} flex flex-col h-full shadow-2xl`}
        style={{ background: "#0A0C1B", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle && <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-white/40 hover:text-white hover:bg-white/05 flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

export function TabBar<T extends string>({
  tabs, active, onChange,
}: {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex gap-1 border-b px-1" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="relative flex items-center gap-1.5 px-3 py-3 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
          style={{ color: active === t.id ? "#F5C518" : "#475569" }}>
          {t.label}
          {t.count != null && t.count > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: active === t.id ? "rgba(245,197,24,0.2)" : "rgba(255,255,255,0.06)", color: active === t.id ? "#F5C518" : "#64748B" }}>
              {t.count}
            </span>
          )}
          {active === t.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#F5C518" }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Timeline item ─────────────────────────────────────────────────────────────

export function TimelineItem({
  icon, title, sub, time, accent, last,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  time: string;
  accent?: string;
  last?: boolean;
}) {
  const color = accent ?? "#3B4FC8";
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
          <div className="w-3 h-3">{icon}</div>
        </div>
        {!last && <div className="w-px flex-1 mt-1" style={{ background: "rgba(255,255,255,0.06)" }} />}
      </div>
      <div className={`${last ? "pb-0" : "pb-4"} flex-1 min-w-0`}>
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm text-white/80 font-medium leading-snug">{title}</span>
          <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: "#475569" }}>{time}</span>
        </div>
        {sub && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#475569" }}>{sub}</p>}
      </div>
    </div>
  );
}
