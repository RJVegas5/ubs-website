"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortalCustomer {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  outstanding_balance: number;
  lifetime_value: number;
}

interface PortalStats {
  upcomingAppointments: number;
  pendingEstimates: number;
  openInvoices: number;
  totalJobs: number;
}

interface Appointment {
  id: string;
  title: string;
  type: string;
  status: string;
  start_datetime: string;
  end_datetime: string | null;
  service: string | null;
  assigned_to: string | null;
  address: string | null;
  notes: string | null;
}

interface Estimate {
  id: string;
  estimate_number: string;
  status: string;
  issue_date: string;
  expiry_date: string | null;
  total: number;
  notes: string | null;
  estimate_items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string | null;
  total: number;
  amount_paid: number;
  balance_due: number;
  notes: string | null;
  invoice_items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

interface Job {
  id: string;
  title: string;
  service: string | null;
  status: string;
  scheduled_date: string | null;
  completed_date: string | null;
  address: string | null;
  notes: string | null;
  completion_notes: string | null;
  created_at: string;
}

interface Message {
  id: string;
  description: string;
  created_at: string;
}

type TabId =
  | "overview"
  | "appointments"
  | "estimates"
  | "invoices"
  | "jobs"
  | "messages";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Status badges ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  scheduled: { bg: "rgba(59,79,200,0.2)", text: "#93A3F8" },
  confirmed: { bg: "rgba(16,185,129,0.2)", text: "#6EE7B7" },
  completed: { bg: "rgba(16,185,129,0.2)", text: "#6EE7B7" },
  in_progress: { bg: "rgba(245,197,24,0.2)", text: "#F5C518" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#FCA5A5" },
  rescheduled: { bg: "rgba(249,115,22,0.2)", text: "#FDB68A" },
  draft: { bg: "rgba(100,116,139,0.2)", text: "#94A3B8" },
  sent: { bg: "rgba(59,79,200,0.2)", text: "#93A3F8" },
  approved: { bg: "rgba(16,185,129,0.2)", text: "#6EE7B7" },
  rejected: { bg: "rgba(239,68,68,0.15)", text: "#FCA5A5" },
  expired: { bg: "rgba(100,116,139,0.2)", text: "#94A3B8" },
  paid: { bg: "rgba(16,185,129,0.2)", text: "#6EE7B7" },
  partial: { bg: "rgba(245,197,24,0.2)", text: "#F5C518" },
  overdue: { bg: "rgba(239,68,68,0.15)", text: "#FCA5A5" },
  assigned: { bg: "rgba(59,79,200,0.2)", text: "#93A3F8" },
};

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || {
    bg: "rgba(100,116,139,0.2)",
    text: "#94A3B8",
  };
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ background: colors.bg, color: colors.text }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "⊞" },
  { id: "appointments", label: "Appointments", icon: "📅" },
  { id: "estimates", label: "Estimates", icon: "📋" },
  { id: "invoices", label: "Invoices", icon: "💰" },
  { id: "jobs", label: "Service History", icon: "🧹" },
  { id: "messages", label: "Messages", icon: "✉️" },
];

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({
  customer,
  stats,
  appointments,
  estimates,
  invoices,
  jobs,
  onTabChange,
}: {
  customer: PortalCustomer;
  stats: PortalStats;
  appointments: Appointment[];
  estimates: Estimate[];
  invoices: Invoice[];
  jobs: Job[];
  onTabChange: (tab: TabId) => void;
}) {
  const upcoming = appointments
    .filter(
      (a) =>
        new Date(a.start_datetime) > new Date() && a.status !== "cancelled"
    )
    .slice(0, 3);
  const pendingEst = estimates.filter((e) => e.status === "sent").slice(0, 3);
  const recentJobs = jobs.filter((j) => j.status === "completed").slice(0, 3);
  const openInvoices = invoices
    .filter((i) => ["sent", "partial", "overdue"].includes(i.status))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "var(--font-display)", color: "#F5C518" }}
        >
          WELCOME BACK
        </h2>
        <p className="text-gray-400">
          {customer.company_name || customer.contact_name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Upcoming Visits",
            value: stats.upcomingAppointments,
            icon: "📅",
            color: "#3B4FC8",
            tab: "appointments" as TabId,
          },
          {
            label: "Pending Estimates",
            value: stats.pendingEstimates,
            icon: "📋",
            color: "#F5C518",
            tab: "estimates" as TabId,
          },
          {
            label: "Open Invoices",
            value: stats.openInvoices,
            icon: "💰",
            color: "#EF4444",
            tab: "invoices" as TabId,
          },
          {
            label: "Outstanding Balance",
            value: fmt$(customer.outstanding_balance),
            icon: "💳",
            color: "#10B981",
            tab: "invoices" as TabId,
            isString: true,
          },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => onTabChange(s.tab)}
            className="text-left p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background: "#0D0F1E",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-xl mb-2">{s.icon}</div>
            <div
              className="text-2xl font-bold"
              style={{ color: s.isString ? s.color : undefined }}
            >
              {s.isString ? s.value : s.value}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-200">Upcoming Visits</h3>
            <button
              onClick={() => onTabChange("appointments")}
              className="text-xs"
              style={{ color: "#F5C518" }}
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "#0D0F1E" }}
              >
                <div>
                  <div className="text-sm font-medium text-white">{a.title}</div>
                  <div className="text-xs text-gray-500">
                    {fmtDateTime(a.start_datetime)}
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending estimates */}
      {pendingEst.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-200">
              Estimates Awaiting Your Approval
            </h3>
            <button
              onClick={() => onTabChange("estimates")}
              className="text-xs"
              style={{ color: "#F5C518" }}
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {pendingEst.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "#0D0F1E" }}
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {e.estimate_number}
                  </div>
                  <div className="text-xs text-gray-500">
                    Issued {fmtDate(e.issue_date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: "#F5C518" }}>
                    {fmt$(e.total)}
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open invoices */}
      {openInvoices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-200">Outstanding Invoices</h3>
            <button
              onClick={() => onTabChange("invoices")}
              className="text-xs"
              style={{ color: "#F5C518" }}
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {openInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "#0D0F1E" }}
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {inv.invoice_number}
                  </div>
                  <div className="text-xs text-gray-500">
                    Due {fmtDate(inv.due_date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-red-400">
                    {fmt$(inv.balance_due)} due
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent completed jobs */}
      {recentJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-200">Recent Service Visits</h3>
            <button
              onClick={() => onTabChange("jobs")}
              className="text-xs"
              style={{ color: "#F5C518" }}
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {recentJobs.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "#0D0F1E" }}
              >
                <div>
                  <div className="text-sm font-medium text-white">{j.title}</div>
                  <div className="text-xs text-gray-500">
                    {j.service} · Completed {fmtDate(j.completed_date)}
                  </div>
                </div>
                <StatusBadge status={j.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick contact */}
      <div
        className="p-5 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,79,200,0.15) 0%, rgba(245,197,24,0.08) 100%)",
          border: "1px solid rgba(59,79,200,0.25)",
        }}
      >
        <div className="text-sm font-semibold text-gray-200 mb-1">
          Need something?
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Request a service, ask a question, or get a quote.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="tel:7027952855"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: "#F5C518",
              color: "#070915",
              fontFamily: "var(--font-display)",
            }}
          >
            📞 CALL (702) 795-2855
          </a>
          <Link
            href="/book"
            className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all text-gray-300"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            Request Service
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Appointments Tab ──────────────────────────────────────────────────────────

function AppointmentsTab({
  appointments,
  loading,
}: {
  appointments: Appointment[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  const upcoming = appointments.filter(
    (a) => new Date(a.start_datetime) >= new Date()
  );
  const past = appointments.filter(
    (a) => new Date(a.start_datetime) < new Date()
  );

  function ApptCard({ a }: { a: Appointment }) {
    return (
      <div
        className="p-4 rounded-xl"
        style={{
          background: "#0D0F1E",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">{a.title}</span>
              <StatusBadge status={a.status} />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {fmtDateTime(a.start_datetime)}
              {a.end_datetime && ` — ${fmtDateTime(a.end_datetime)}`}
            </div>
            {a.service && (
              <div className="text-xs text-gray-500 mt-0.5">
                Service: {a.service}
              </div>
            )}
            {a.assigned_to && (
              <div className="text-xs text-gray-500">
                Technician: {a.assigned_to}
              </div>
            )}
            {a.address && (
              <div className="text-xs text-gray-500">{a.address}</div>
            )}
            {a.notes && (
              <div className="text-xs text-gray-500 mt-1 italic">{a.notes}</div>
            )}
          </div>
          <div
            className="text-xs capitalize px-2 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.05)", color: "#94A3B8" }}
          >
            {a.type.replace(/_/g, " ")}
          </div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="No appointments yet"
        body="Your scheduled service visits will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Upcoming ({upcoming.length})
          </h3>
          <div className="space-y-3">
            {upcoming.map((a) => (
              <ApptCard key={a.id} a={a} />
            ))}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Past ({past.length})
          </h3>
          <div className="space-y-3">
            {past.map((a) => (
              <ApptCard key={a.id} a={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Estimates Tab ─────────────────────────────────────────────────────────────

function EstimatesTab({
  estimates,
  loading,
  onAction,
}: {
  estimates: Estimate[];
  loading: boolean;
  onAction: (id: string, action: "approve" | "reject") => Promise<void>;
}) {
  const [actioning, setActioning] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleAction(id: string, action: "approve" | "reject") {
    setActioning(`${id}-${action}`);
    await onAction(id, action);
    setActioning(null);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (estimates.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No estimates yet"
        body="Estimates we prepare for your projects will appear here for your review and approval."
      />
    );
  }

  return (
    <div className="space-y-3">
      {estimates.map((e) => (
        <div
          key={e.id}
          className="rounded-xl overflow-hidden"
          style={{
            background: "#0D0F1E",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">
                    {e.estimate_number}
                  </span>
                  <StatusBadge status={e.status} />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Issued {fmtDate(e.issue_date)}
                  {e.expiry_date && ` · Expires ${fmtDate(e.expiry_date)}`}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-lg font-bold"
                  style={{ color: "#F5C518" }}
                >
                  {fmt$(e.total)}
                </div>
                <button
                  onClick={() =>
                    setExpanded(expanded === e.id ? null : e.id)
                  }
                  className="text-xs text-gray-500 hover:text-gray-300 mt-1"
                >
                  {expanded === e.id ? "Hide details ▲" : "View details ▼"}
                </button>
              </div>
            </div>

            {/* Action buttons for sent estimates */}
            {e.status === "sent" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAction(e.id, "approve")}
                  disabled={!!actioning}
                  className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background:
                      actioning === `${e.id}-approve` ? "#0D9E6E" : "#10B981",
                    color: "white",
                    opacity: actioning ? 0.7 : 1,
                  }}
                >
                  {actioning === `${e.id}-approve`
                    ? "Approving..."
                    : "✓ Approve Estimate"}
                </button>
                <button
                  onClick={() => handleAction(e.id, "reject")}
                  disabled={!!actioning}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all"
                  style={{
                    borderColor: "rgba(239,68,68,0.4)",
                    color: "#FCA5A5",
                    opacity: actioning ? 0.7 : 1,
                  }}
                >
                  {actioning === `${e.id}-reject` ? "..." : "Reject"}
                </button>
              </div>
            )}
          </div>

          {/* Line items */}
          {expanded === e.id && e.estimate_items.length > 0 && (
            <div
              className="px-4 pb-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="mt-3 space-y-1">
                {e.estimate_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1.5 text-sm"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="text-gray-300">{item.description}</div>
                    <div className="flex items-center gap-4 text-right text-xs text-gray-400">
                      <span>
                        {item.quantity} × {fmt$(item.unit_price)}
                      </span>
                      <span className="font-semibold text-white w-20 text-right">
                        {fmt$(item.total)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <div
                    className="text-sm font-bold"
                    style={{ color: "#F5C518" }}
                  >
                    Total: {fmt$(e.total)}
                  </div>
                </div>
              </div>
              {e.notes && (
                <p className="text-xs text-gray-500 mt-2 italic">{e.notes}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Invoices Tab ──────────────────────────────────────────────────────────────

function InvoicesTab({
  invoices,
  loading,
}: {
  invoices: Invoice[];
  loading: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  const outstanding = invoices
    .filter((i) => ["sent", "partial", "overdue"].includes(i.status))
    .reduce((acc, inv) => acc + Number(inv.balance_due), 0);

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon="💰"
        title="No invoices yet"
        body="Your invoices will appear here. You can view line items and payment status."
      />
    );
  }

  return (
    <div className="space-y-4">
      {outstanding > 0 && (
        <div
          className="p-4 rounded-xl flex items-center justify-between"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div>
            <div className="text-sm font-semibold text-red-400">
              Outstanding Balance
            </div>
            <div className="text-xs text-gray-400">
              To pay, call (702) 795-2855
            </div>
          </div>
          <div className="text-xl font-bold text-red-400">{fmt$(outstanding)}</div>
        </div>
      )}

      <div className="space-y-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="rounded-xl overflow-hidden"
            style={{
              background: "#0D0F1E",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">
                      {inv.invoice_number}
                    </span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Issued {fmtDate(inv.issue_date)}
                    {inv.due_date && ` · Due ${fmtDate(inv.due_date)}`}
                  </div>
                  {inv.amount_paid > 0 && (
                    <div className="text-xs text-green-400 mt-0.5">
                      {fmt$(inv.amount_paid)} paid
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#F5C518" }}
                  >
                    {fmt$(inv.total)}
                  </div>
                  {inv.balance_due > 0 && (
                    <div className="text-xs text-red-400 font-semibold">
                      {fmt$(inv.balance_due)} due
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setExpanded(expanded === inv.id ? null : inv.id)
                    }
                    className="text-xs text-gray-500 hover:text-gray-300 mt-1 block"
                  >
                    {expanded === inv.id ? "Hide ▲" : "Details ▼"}
                  </button>
                </div>
              </div>

              {["sent", "partial", "overdue"].includes(inv.status) && (
                <a
                  href="tel:7027952855"
                  className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all w-full"
                  style={{ background: "#F5C518", color: "#070915" }}
                >
                  📞 Call to Pay
                </a>
              )}
            </div>

            {expanded === inv.id && inv.invoice_items.length > 0 && (
              <div
                className="px-4 pb-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="mt-3 space-y-1">
                  {inv.invoice_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1.5 text-sm"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="text-gray-300">{item.description}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>
                          {item.quantity} × {fmt$(item.unit_price)}
                        </span>
                        <span className="font-semibold text-white w-20 text-right">
                          {fmt$(item.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Jobs Tab ──────────────────────────────────────────────────────────────────

function JobsTab({ jobs, loading }: { jobs: Job[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon="🧹"
        title="No service history yet"
        body="Your completed and scheduled service visits will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <div
          key={j.id}
          className="p-4 rounded-xl"
          style={{
            background: "#0D0F1E",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm">{j.title}</span>
                <StatusBadge status={j.status} />
              </div>
              {j.service && (
                <div className="text-xs text-gray-400 mt-1">{j.service}</div>
              )}
              {j.scheduled_date && (
                <div className="text-xs text-gray-500">
                  Scheduled: {fmtDate(j.scheduled_date)}
                </div>
              )}
              {j.completed_date && (
                <div className="text-xs text-green-400">
                  Completed: {fmtDate(j.completed_date)}
                </div>
              )}
              {j.address && (
                <div className="text-xs text-gray-500 mt-1">{j.address}</div>
              )}
              {j.completion_notes && (
                <div
                  className="text-xs text-gray-400 mt-2 p-2 rounded"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-gray-500">Notes: </span>
                  {j.completion_notes}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 shrink-0">
              {fmtDate(j.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Messages Tab ──────────────────────────────────────────────────────────────

function MessagesTab({
  messages,
  loading,
  onSend,
}: {
  messages: Message[];
  loading: boolean;
  onSend: (subject: string, message: string) => Promise<void>;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    await onSend(subject, body);
    setSubject("");
    setBody("");
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const inputStyle = {
    background: "#151729",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    width: "100%",
    fontSize: "0.9rem",
  };

  return (
    <div className="space-y-6">
      {/* Compose */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: "#0D0F1E",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h3 className="font-semibold text-gray-200 mb-4">
          Send a Message to UBS
        </h3>
        <form onSubmit={handleSend} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Schedule a deep clean, Question about invoice..."
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="How can we help you?"
              rows={4}
              required
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
          {sent && (
            <div
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#6EE7B7",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              ✓ Message sent! We&apos;ll follow up within 1 business day.
            </div>
          )}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 rounded-lg font-bold text-sm transition-all"
            style={{
              background: sending ? "#2A3A9E" : "#F5C518",
              color: "#070915",
              opacity: sending ? 0.7 : 1,
              fontFamily: "var(--font-display)",
            }}
          >
            {sending ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>
      </div>

      {/* Message history */}
      {!loading && messages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Sent Messages
          </h3>
          <div className="space-y-2">
            {messages.map((m) => {
              // Extract subject and body from description "[Portal Message] Subject: body"
              const raw = m.description.replace("[Portal Message] ", "");
              const colonIdx = raw.indexOf(": ");
              const msgSubject =
                colonIdx > -1 ? raw.slice(0, colonIdx) : "Message";
              const msgBody =
                colonIdx > -1 ? raw.slice(colonIdx + 2) : raw;

              return (
                <div
                  key={m.id}
                  className="p-3 rounded-lg"
                  style={{
                    background: "#151729",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-sm font-medium text-gray-200">
                      {msgSubject}
                    </div>
                    <div className="text-xs text-gray-500 shrink-0">
                      {fmtDate(m.created_at)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{msgBody}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Direct contact */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: "rgba(59,79,200,0.08)",
          border: "1px solid rgba(59,79,200,0.2)",
        }}
      >
        <div className="text-sm text-gray-300 font-semibold mb-1">
          Need immediate assistance?
        </div>
        <p className="text-xs text-gray-500 mb-2">
          For urgent requests, please call us directly.
        </p>
        <a
          href="tel:7027952855"
          className="text-sm font-bold"
          style={{ color: "#F5C518" }}
        >
          📞 (702) 795-2855
        </a>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-semibold text-gray-300 mb-1">{title}</div>
      <div className="text-sm text-gray-500">{body}</div>
    </div>
  );
}

// ── Main Portal Page ──────────────────────────────────────────────────────────

export default function PortalPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<PortalCustomer | null>(null);
  const [stats, setStats] = useState<PortalStats>({
    upcomingAppointments: 0,
    pendingEstimates: 0,
    openInvoices: 0,
    totalJobs: 0,
  });
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data per tab
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dataLoading, setDataLoading] = useState<Record<TabId, boolean>>({
    overview: false,
    appointments: false,
    estimates: false,
    invoices: false,
    jobs: false,
    messages: false,
  });
  const [dataLoaded, setDataLoaded] = useState<Record<TabId, boolean>>({
    overview: false,
    appointments: false,
    estimates: false,
    invoices: false,
    jobs: false,
    messages: false,
  });

  const loadTabData = useCallback(
    async (tab: TabId) => {
      if (dataLoaded[tab] || dataLoading[tab]) return;
      setDataLoading((prev) => ({ ...prev, [tab]: true }));

      try {
        if (tab === "overview" || tab === "appointments") {
          const r = await fetch("/api/portal/appointments");
          const d = await r.json();
          setAppointments(d.appointments || []);
          setDataLoaded((p) => ({ ...p, appointments: true }));
        }
        if (tab === "overview" || tab === "estimates") {
          const r = await fetch("/api/portal/estimates");
          const d = await r.json();
          setEstimates(d.estimates || []);
          setDataLoaded((p) => ({ ...p, estimates: true }));
        }
        if (tab === "overview" || tab === "invoices") {
          const r = await fetch("/api/portal/invoices");
          const d = await r.json();
          setInvoices(d.invoices || []);
          setDataLoaded((p) => ({ ...p, invoices: true }));
        }
        if (tab === "overview" || tab === "jobs") {
          const r = await fetch("/api/portal/jobs");
          const d = await r.json();
          setJobs(d.jobs || []);
          setDataLoaded((p) => ({ ...p, jobs: true }));
        }
        if (tab === "messages") {
          const r = await fetch("/api/portal/message");
          const d = await r.json();
          setMessages(d.messages || []);
          setDataLoaded((p) => ({ ...p, messages: true }));
        }
        if (tab === "overview") {
          setDataLoaded((p) => ({ ...p, overview: true }));
        }
      } finally {
        setDataLoading((prev) => ({ ...prev, [tab]: false }));
      }
    },
    [dataLoaded, dataLoading]
  );

  // Load customer on mount
  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => {
        if (r.status === 401) {
          router.push("/portal/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setCustomer(data.customer);
          setStats(data.stats);
          // Pre-load overview data
          loadTabData("overview");
        }
      })
      .finally(() => setAuthLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    loadTabData(tab);
  }

  async function handleLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal/login");
  }

  async function handleEstimateAction(
    id: string,
    action: "approve" | "reject"
  ) {
    const res = await fetch(`/api/portal/estimates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      // Refresh estimates and stats
      const r = await fetch("/api/portal/estimates");
      const d = await r.json();
      setEstimates(d.estimates || []);
      // Refresh stats
      const me = await fetch("/api/portal/me");
      const meData = await me.json();
      if (meData.stats) setStats(meData.stats);
    }
  }

  async function handleSendMessage(subject: string, message: string) {
    await fetch("/api/portal/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    // Refresh messages
    const r = await fetch("/api/portal/message");
    const d = await r.json();
    setMessages(d.messages || []);
  }

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#070915" }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg mx-auto mb-4 animate-pulse"
            style={{ background: "#F5C518", color: "#070915" }}
          >
            U
          </div>
          <div className="text-gray-400 text-sm">Loading portal…</div>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const isDataLoading = dataLoading[activeTab];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#070915" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6 py-3"
        style={{
          background: "rgba(7,9,21,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-400"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: "#F5C518", color: "#070915" }}
            >
              U
            </div>
            <span
              className="text-sm font-bold hidden sm:block"
              style={{ color: "#F5C518", fontFamily: "var(--font-display)" }}
            >
              UBS
            </span>
          </Link>
          <span
            className="text-xs text-gray-500 hidden sm:block"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}
          >
            &nbsp;Customer Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-gray-200">
              {customer.company_name || customer.contact_name}
            </div>
            <div className="text-xs text-gray-500">{customer.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "#94A3B8",
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar navigation (desktop) */}
        <aside
          className="hidden lg:flex flex-col w-56 shrink-0 py-6 px-3"
          style={{
            background: "#0D0F1E",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Customer info */}
          <div className="px-3 mb-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold mb-2"
              style={{ background: "#3B4FC8", color: "white" }}
            >
              {(customer.company_name || customer.contact_name || "?")[0].toUpperCase()}
            </div>
            <div className="text-sm font-semibold text-gray-200 truncate">
              {customer.company_name || customer.contact_name}
            </div>
            {customer.outstanding_balance > 0 && (
              <div className="text-xs text-red-400 mt-0.5">
                {fmt$(customer.outstanding_balance)} outstanding
              </div>
            )}
          </div>

          <nav className="space-y-1 flex-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left"
                style={{
                  background:
                    activeTab === tab.id
                      ? "rgba(59,79,200,0.2)"
                      : "transparent",
                  color:
                    activeTab === tab.id ? "#93A3F8" : "#6B7280",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {/* Badge for pending estimates */}
                {tab.id === "estimates" && stats.pendingEstimates > 0 && (
                  <span
                    className="ml-auto text-xs rounded-full px-1.5 py-0.5 font-bold"
                    style={{ background: "#F5C518", color: "#070915" }}
                  >
                    {stats.pendingEstimates}
                  </span>
                )}
                {/* Badge for open invoices */}
                {tab.id === "invoices" && stats.openInvoices > 0 && (
                  <span
                    className="ml-auto text-xs rounded-full px-1.5 py-0.5 font-bold"
                    style={{
                      background: "#EF4444",
                      color: "white",
                    }}
                  >
                    {stats.openInvoices}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <a
              href="tel:7027952855"
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              📞 <span>(702) 795-2855</span>
            </a>
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30"
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <div
              className="w-64 h-full py-6 px-3 flex flex-col"
              style={{ background: "#0D0F1E" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold mb-2"
                  style={{ background: "#3B4FC8", color: "white" }}
                >
                  {(customer.company_name || customer.contact_name || "?")[0].toUpperCase()}
                </div>
                <div className="text-sm font-semibold text-gray-200 truncate">
                  {customer.company_name || customer.contact_name}
                </div>
              </div>
              <nav className="space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left"
                    style={{
                      background:
                        activeTab === tab.id
                          ? "rgba(59,79,200,0.2)"
                          : "transparent",
                      color: activeTab === tab.id ? "#93A3F8" : "#6B7280",
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {/* Mobile tab bar */}
            <div className="lg:hidden flex gap-1 mb-6 overflow-x-auto pb-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                  style={{
                    background:
                      activeTab === tab.id
                        ? "rgba(59,79,200,0.25)"
                        : "rgba(255,255,255,0.04)",
                    color: activeTab === tab.id ? "#93A3F8" : "#6B7280",
                    border: activeTab === tab.id
                      ? "1px solid rgba(59,79,200,0.4)"
                      : "1px solid transparent",
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "overview" && (
              <OverviewTab
                customer={customer}
                stats={stats}
                appointments={appointments}
                estimates={estimates}
                invoices={invoices}
                jobs={jobs}
                onTabChange={handleTabChange}
              />
            )}
            {activeTab === "appointments" && (
              <AppointmentsTab
                appointments={appointments}
                loading={isDataLoading && !dataLoaded.appointments}
              />
            )}
            {activeTab === "estimates" && (
              <EstimatesTab
                estimates={estimates}
                loading={isDataLoading && !dataLoaded.estimates}
                onAction={handleEstimateAction}
              />
            )}
            {activeTab === "invoices" && (
              <InvoicesTab
                invoices={invoices}
                loading={isDataLoading && !dataLoaded.invoices}
              />
            )}
            {activeTab === "jobs" && (
              <JobsTab
                jobs={jobs}
                loading={isDataLoading && !dataLoaded.jobs}
              />
            )}
            {activeTab === "messages" && (
              <MessagesTab
                messages={messages}
                loading={isDataLoading && !dataLoaded.messages}
                onSend={handleSendMessage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
