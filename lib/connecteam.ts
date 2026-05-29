/**
 * Connecteam Integration Helper
 *
 * Base URL:  https://api.connecteam.com
 * Auth:      X-API-KEY request header
 * Docs:      https://developer.connecteam.com
 *
 * Primary endpoint (confirmed via live API test):
 *   POST /scheduler/v1/schedulers/{schedulerId}/shifts
 *
 * Payload notes (confirmed live):
 *   • startTime / endTime   → Unix epoch seconds (integer), NOT ISO strings
 *   • Times are interpreted in the scheduler's timezone (America/Los_Angeles)
 *   • Body must be a JSON array:  [ { startTime, endTime, title, ... } ]
 *   • assignedUserIds        → number[] (not a single "userId")
 *   • Response shape:        { requestId, data: { shifts: [ { id, ... } ] } }
 *
 * Required env vars (server-side only — NEVER use NEXT_PUBLIC_ prefix):
 *   CONNECTEAM_API_KEY          API key from Connecteam → Settings → API Keys
 *   CONNECTEAM_SCHEDULER_ID     Numeric scheduler ID (UBS Maintenance = 4231389)
 *   CONNECTEAM_DEFAULT_USER_ID  Optional numeric employee ID to assign shifts to
 *   CONNECTEAM_ENABLED          Must be "true" to activate (any other value disables)
 */

const CONNECTEAM_BASE = "https://api.connecteam.com";

// ── Sync Status ───────────────────────────────────────────────────────────────

export type ConnecteamSyncStatus = "pending" | "synced" | "failed" | "disabled";

// ── Payload Types ─────────────────────────────────────────────────────────────

/** Canonical shape passed into createConnecteamJobOrShift(). */
export interface ConnecteamBookingPayload {
  customerName: string;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  service: string | null;
  address: string | null;
  preferredDate: string | null;        // YYYY-MM-DD  (used when no exact times)
  preferredTime: string | null;        // "morning" | "afternoon" | "evening"
  exactStartIso: string | null;        // ISO string — used for appointments
  exactEndIso:   string | null;        // ISO string — used for appointments
  notes: string | null;
  sourcePage: string;
  internalBookingId: string | null;
  crmLeadId: string | null;
}

export interface ConnecteamResult {
  success: boolean;
  externalId?: string;
  error?: string;
  raw?: unknown;
}

// ── Guard ─────────────────────────────────────────────────────────────────────

/**
 * Returns true only when ALL required env vars are present AND
 * CONNECTEAM_ENABLED === "true".  Call this before any API attempt.
 */
export function isConnecteamConfigured(): boolean {
  return (
    process.env.CONNECTEAM_ENABLED === "true" &&
    !!process.env.CONNECTEAM_API_KEY &&
    !!process.env.CONNECTEAM_SCHEDULER_ID
  );
}

// ── Timezone helper ───────────────────────────────────────────────────────────

/**
 * Converts a date string + hour-in-PT to a Unix epoch timestamp (seconds).
 *
 * Las Vegas / Pacific Time:
 *   PDT (March – October):  UTC−7
 *   PST (November – February): UTC−8
 *
 * Example: "2025-06-10", 9  →  Unix for 2025-06-10 09:00 PDT (= 16:00 UTC)
 */
function ptHourToUnix(dateStr: string, hourInPT: number): number {
  const base = new Date(`${dateStr}T00:00:00Z`);
  const month = base.getUTCMonth(); // 0-indexed (March=2, October=9)
  const ptOffset = (month >= 2 && month <= 9) ? -7 : -8; // PDT : PST
  const utcHour  = hourInPT - ptOffset;                   // PT → UTC
  return Math.floor(base.getTime() / 1000) + utcHour * 3600;
}

// ── Time windows (Pacific Time) ───────────────────────────────────────────────
const TIME_WINDOWS: Record<string, { startH: number; endH: number }> = {
  morning:   { startH:  9, endH: 12 },
  afternoon: { startH: 13, endH: 17 },
  evening:   { startH: 18, endH: 21 },
};

// ── Core API call ─────────────────────────────────────────────────────────────

/**
 * Creates a shift in the UBS Maintenance Connecteam scheduler.
 *
 * Throws on non-2xx so the caller can catch and record the failure.
 */
export async function createConnecteamJobOrShift(
  payload: ConnecteamBookingPayload
): Promise<ConnecteamResult> {
  const apiKey      = process.env.CONNECTEAM_API_KEY!;
  const schedulerId = process.env.CONNECTEAM_SCHEDULER_ID!;
  const rawUserId   = process.env.CONNECTEAM_DEFAULT_USER_ID ?? null;

  // ── Resolve start / end Unix timestamps ──────────────────────────────────
  let startUnix: number;
  let endUnix:   number;

  if (payload.exactStartIso) {
    // Appointment with precise datetime — convert directly
    startUnix = Math.floor(new Date(payload.exactStartIso).getTime() / 1000);
    endUnix   = payload.exactEndIso
      ? Math.floor(new Date(payload.exactEndIso).getTime() / 1000)
      : startUnix + 3 * 3600;               // fallback: 3-hour window
  } else {
    // Lead / Job — use date + time-slot window in PT
    let dateStr = payload.preferredDate;
    if (!dateStr) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateStr = tomorrow.toISOString().split("T")[0];
    }

    const win = TIME_WINDOWS[payload.preferredTime ?? ""] ?? TIME_WINDOWS.morning;
    startUnix = ptHourToUnix(dateStr, win.startH);
    endUnix   = ptHourToUnix(dateStr, win.endH);
  }

  // ── Title (max 128 chars) ─────────────────────────────────────────────────
  const title = [payload.service, payload.companyName ?? payload.customerName]
    .filter(Boolean)
    .join(" — ")
    .slice(0, 128);

  // ── Note / description ────────────────────────────────────────────────────
  const noteLines: string[] = [
    `Service: ${payload.service ?? "N/A"}`,
    `Customer: ${payload.customerName}`,
    ...(payload.companyName   ? [`Company: ${payload.companyName}`]  : []),
    ...(payload.phone         ? [`Phone: ${payload.phone}`]          : []),
    ...(payload.email         ? [`Email: ${payload.email}`]          : []),
    ...(payload.address       ? [`Address: ${payload.address}`]      : []),
    ...(payload.notes         ? [`\n${payload.notes}`]               : []),
    `\nSource: ${payload.sourcePage}`,
    ...(payload.internalBookingId ? [`Booking ID: ${payload.internalBookingId}`] : []),
    ...(payload.crmLeadId         ? [`CRM Lead: ${payload.crmLeadId}`]           : []),
  ];
  const note = noteLines.join("\n");

  // ── Assigned user ─────────────────────────────────────────────────────────
  const assignedUserIds: number[] = [];
  if (rawUserId) {
    const n = Number(rawUserId);
    if (!isNaN(n)) assignedUserIds.push(n);
  }

  // ── Shift body ────────────────────────────────────────────────────────────
  const shiftBody = [
    {
      startTime: startUnix,
      endTime:   endUnix,
      title,
      note,
      ...(assignedUserIds.length > 0 ? { assignedUserIds } : {}),
      ...(payload.address ? { address: payload.address } : {}),
    },
  ];

  // ── HTTP POST ─────────────────────────────────────────────────────────────
  const response = await fetch(
    `${CONNECTEAM_BASE}/scheduler/v1/schedulers/${schedulerId}/shifts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept:         "application/json",
        "X-API-KEY":    apiKey,
      },
      body: JSON.stringify(shiftBody),
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "(no body)");
    throw new Error(
      `Connecteam API ${response.status} ${response.statusText}: ${errText}`
    );
  }

  const raw: unknown = await response.json().catch(() => null);
  const externalId   = extractShiftId(raw);

  return { success: true, externalId: externalId ?? undefined, raw };
}

// ── Payload Mappers ───────────────────────────────────────────────────────────

/** Booking wizard → payload (not currently wired to Connecteam sync) */
export function mapBookingToConnecteamPayload(booking: {
  service: string | null;
  companyName: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  date: string | null;
  timeSlot: string | null;
  notes: string | null;
  instructions: string | null;
  bookingId: string | null;
  leadId: string | null;
}): ConnecteamBookingPayload {
  const combinedNotes = [
    booking.instructions ? `Instructions: ${booking.instructions}` : null,
    booking.notes        ? `Notes: ${booking.notes}`               : null,
  ].filter(Boolean).join("\n") || null;

  return {
    customerName:      booking.contactName ?? booking.companyName ?? "New Client",
    companyName:       booking.companyName,
    phone:             booking.phone,
    email:             booking.email,
    service:           booking.service,
    address:           booking.address,
    preferredDate:     booking.date,
    preferredTime:     booking.timeSlot,
    exactStartIso:     null,
    exactEndIso:       null,
    notes:             combinedNotes,
    sourcePage:        "booking_wizard",
    internalBookingId: booking.bookingId,
    crmLeadId:         booking.leadId,
  };
}

/**
 * CRM Lead → payload.
 * Triggered when lead status becomes "approved" or "won".
 * Shift date = follow_up_date (or tomorrow if not set).
 */
export function mapLeadToConnecteamPayload(lead: {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  service: string | null;
  building_type: string | null;
  sq_footage: string | null;
  frequency: string | null;
  notes: string | null;
  follow_up_date: string | null;
}): ConnecteamBookingPayload {
  const customerName =
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    lead.company_name ||
    "Unknown Client";

  const extraNotes = [
    lead.building_type ? `Property type: ${lead.building_type}` : null,
    lead.sq_footage    ? `Facility size: ${lead.sq_footage}`    : null,
    lead.frequency     ? `Frequency: ${lead.frequency}`         : null,
    lead.notes         ? `Notes: ${lead.notes}`                 : null,
  ].filter(Boolean).join("\n") || null;

  return {
    customerName,
    companyName:       lead.company_name,
    phone:             lead.phone,
    email:             lead.email,
    service:           lead.service,
    address:           lead.address,
    preferredDate:     lead.follow_up_date ?? null,
    preferredTime:     null,                 // no time preference on a lead
    exactStartIso:     null,
    exactEndIso:       null,
    notes:             extraNotes,
    sourcePage:        "crm_lead_approved",
    internalBookingId: null,
    crmLeadId:         lead.id,
  };
}

/**
 * Appointment → payload.
 * Uses exact start_datetime / end_datetime for precise scheduling.
 */
export function mapAppointmentToConnecteamPayload(appt: {
  id: string;
  title: string;
  service: string | null;
  company_name: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  start_datetime: string;
  end_datetime: string | null;
  lead_id: string | null;
  customer_id: string | null;
}): ConnecteamBookingPayload {
  const customerName = appt.contact_name ?? appt.company_name ?? "Client";

  return {
    customerName,
    companyName:       appt.company_name,
    phone:             appt.phone,
    email:             appt.email,
    service:           appt.service,
    address:           appt.address,
    preferredDate:     null,           // unused — exactStartIso takes over
    preferredTime:     null,
    exactStartIso:     appt.start_datetime,
    exactEndIso:       appt.end_datetime,
    notes:             appt.notes,
    sourcePage:        "crm_appointment_scheduled",
    internalBookingId: null,
    crmLeadId:         appt.lead_id,
  };
}

/**
 * Job → payload.
 * Uses scheduled_date + morning window.
 */
export function mapJobToConnecteamPayload(
  job: {
    id: string;
    title: string;
    service: string | null;
    address: string | null;
    notes: string | null;
    scheduled_date: string | null;
    lead_id: string | null;
    customer_id: string | null;
  },
  customerName?: string | null
): ConnecteamBookingPayload {
  return {
    customerName:      customerName ?? "Client",
    companyName:       customerName ?? null,
    phone:             null,
    email:             null,
    service:           job.service ?? job.title,
    address:           job.address,
    preferredDate:     job.scheduled_date ?? null,
    preferredTime:     "morning",
    exactStartIso:     null,
    exactEndIso:       null,
    notes:             job.notes,
    sourcePage:        "crm_job_created",
    internalBookingId: null,
    crmLeadId:         job.lead_id,
  };
}

// ── Shift ID extractor ────────────────────────────────────────────────────────
// Confirmed Connecteam v1 response shape:
//   { requestId: "...", data: { shifts: [ { id: "...", ... } ] } }

function extractShiftId(raw: unknown): string | null {
  if (!raw) return null;

  // Primary path: { data: { shifts: [{ id }] } }
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;

    const data = obj.data as Record<string, unknown> | undefined;
    if (data) {
      const shifts = data.shifts;
      if (Array.isArray(shifts) && shifts.length > 0) {
        const first = (shifts as Record<string, unknown>[])[0];
        if (first?.id != null) return String(first.id);
      }
    }

    // Fallback: top-level array or { shifts: [...] }
    if (Array.isArray(obj)) {
      const first = (obj as Record<string, unknown>[])[0];
      if (first?.id != null) return String(first.id);
    }
    if (obj.id != null) return String(obj.id);
  }

  if (Array.isArray(raw) && raw.length > 0) {
    const first = (raw as Record<string, unknown>[])[0];
    if (first?.id != null) return String(first.id);
  }

  return null;
}
