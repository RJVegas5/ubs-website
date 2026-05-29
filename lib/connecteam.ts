/**
 * Connecteam Integration Helper
 *
 * Base URL:  https://api.connecteam.com
 * Auth:      X-API-KEY request header
 * Docs:      https://developer.connecteam.com
 *
 * Primary endpoint:
 *   POST /scheduler/v2/schedulers/{schedulerId}/shifts
 *
 * Required env vars (server-side only — NEVER use NEXT_PUBLIC_ prefix):
 *   CONNECTEAM_API_KEY          API key from Connecteam → Settings → API Keys
 *   CONNECTEAM_SCHEDULER_ID     Scheduler ID from Connecteam → Schedule module
 *   CONNECTEAM_DEFAULT_USER_ID  Default employee ID to assign the shift to
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
  preferredDate: string | null;  // YYYY-MM-DD
  preferredTime: string | null;  // "morning" | "afternoon" | "evening"
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

// ── Payload Mapper ────────────────────────────────────────────────────────────

/**
 * Converts raw booking data (as stored in Supabase / received from the form)
 * into the ConnecteamBookingPayload shape expected by createConnecteamJobOrShift().
 */
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
    booking.notes ? `Notes: ${booking.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n") || null;

  return {
    customerName: booking.contactName ?? booking.companyName ?? "New Client",
    companyName: booking.companyName,
    phone: booking.phone,
    email: booking.email,
    service: booking.service,
    address: booking.address,
    preferredDate: booking.date,
    preferredTime: booking.timeSlot,
    notes: combinedNotes,
    sourcePage: "booking_wizard",
    internalBookingId: booking.bookingId,
    crmLeadId: booking.leadId,
  };
}

// ── API Call ──────────────────────────────────────────────────────────────────

/**
 * Creates a shift in Connecteam Scheduler v2 for the given booking.
 *
 * Preferred time → shift window:
 *   morning   → 09:00 – 12:00 UTC
 *   afternoon → 13:00 – 17:00 UTC
 *   evening   → 18:00 – 21:00 UTC
 *   (no slot) → 09:00 – 12:00 UTC (morning fallback)
 *
 * If no date is supplied the shift is placed on tomorrow as a placeholder
 * so the crew sees it immediately and can adjust.
 *
 * Throws on non-2xx responses so the caller can catch and record the failure.
 */
export async function createConnecteamJobOrShift(
  payload: ConnecteamBookingPayload
): Promise<ConnecteamResult> {
  const apiKey     = process.env.CONNECTEAM_API_KEY!;
  const schedulerId = process.env.CONNECTEAM_SCHEDULER_ID!;
  const rawUserId  = process.env.CONNECTEAM_DEFAULT_USER_ID ?? null;

  // ── Date / time window ────────────────────────────────────────────────────
  const timeWindows: Record<string, { startH: string; endH: string }> = {
    morning:   { startH: "09:00:00", endH: "12:00:00" },
    afternoon: { startH: "13:00:00", endH: "17:00:00" },
    evening:   { startH: "18:00:00", endH: "21:00:00" },
  };

  const win = payload.preferredTime
    ? (timeWindows[payload.preferredTime] ?? timeWindows.morning)
    : timeWindows.morning;

  let baseDate = payload.preferredDate;
  if (!baseDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    baseDate = tomorrow.toISOString().split("T")[0];
  }

  const startTime = `${baseDate}T${win.startH}.000Z`;
  const endTime   = `${baseDate}T${win.endH}.000Z`;

  // ── Title (max 128 chars) ─────────────────────────────────────────────────
  const title = [payload.service, payload.companyName ?? payload.customerName]
    .filter(Boolean)
    .join(" — ")
    .slice(0, 128);

  // ── Note / description ────────────────────────────────────────────────────
  const noteLines: string[] = [
    `Service: ${payload.service ?? "N/A"}`,
    `Customer: ${payload.customerName}`,
    ...(payload.companyName ? [`Company: ${payload.companyName}`] : []),
    ...(payload.phone  ? [`Phone: ${payload.phone}`]           : []),
    ...(payload.email  ? [`Email: ${payload.email}`]           : []),
    ...(payload.address ? [`Address: ${payload.address}`]      : []),
    ...(payload.notes  ? [`\n${payload.notes}`]                : []),
    `\nSource: ${payload.sourcePage}`,
    ...(payload.internalBookingId ? [`Booking ID: ${payload.internalBookingId}`] : []),
    ...(payload.crmLeadId         ? [`CRM Lead:   ${payload.crmLeadId}`]         : []),
  ];
  const note = noteLines.join("\n");

  // ── Shift body ────────────────────────────────────────────────────────────
  // See Connecteam Scheduler v2 docs for the exact field contract.
  // If your account uses different field names (e.g. "notes" vs "note",
  // or "location" vs "address"), update here.
  const userId = rawUserId
    ? isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId)
    : undefined;

  const shiftBody: Record<string, unknown>[] = [
    {
      startTime,
      endTime,
      title,
      note,
      ...(userId !== undefined ? { userId } : {}),
      ...(payload.address ? { address: payload.address } : {}),
    },
  ];

  // ── HTTP call ─────────────────────────────────────────────────────────────
  const response = await fetch(
    `${CONNECTEAM_BASE}/scheduler/v2/schedulers/${schedulerId}/shifts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": apiKey,
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
  const externalId = extractShiftId(raw);

  return { success: true, externalId: externalId ?? undefined, raw };
}

// ── Entity-specific mappers ───────────────────────────────────────────────────

/**
 * Converts a CRM Lead row into ConnecteamBookingPayload.
 * Used when a lead status transitions to "approved" or "won".
 * The shift date defaults to follow_up_date (if set) or tomorrow.
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
  ]
    .filter(Boolean)
    .join("\n") || null;

  return {
    customerName,
    companyName:      lead.company_name,
    phone:            lead.phone,
    email:            lead.email,
    service:          lead.service,
    address:          lead.address,
    preferredDate:    lead.follow_up_date ?? null,
    preferredTime:    null,                 // no time preference on a lead
    notes:            extraNotes,
    sourcePage:       "crm_lead_approved",
    internalBookingId: null,
    crmLeadId:        lead.id,
  };
}

/**
 * Converts an Appointment row into ConnecteamBookingPayload.
 * Uses start_datetime for precise scheduling.
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
  // Extract YYYY-MM-DD and approximate time slot from start_datetime
  const dt    = new Date(appt.start_datetime);
  const date  = dt.toISOString().split("T")[0];
  const hour  = dt.getUTCHours();
  const slot  = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const customerName = appt.contact_name ?? appt.company_name ?? "Client";

  return {
    customerName,
    companyName:       appt.company_name,
    phone:             appt.phone,
    email:             appt.email,
    service:           appt.service,
    address:           appt.address,
    preferredDate:     date,
    preferredTime:     slot,
    notes:             appt.notes,
    sourcePage:        "crm_appointment_scheduled",
    internalBookingId: null,
    crmLeadId:         appt.lead_id,
    // Store end_datetime override for the API call if provided
    _endDatetimeOverride: appt.end_datetime ?? undefined,
    _appointmentId:       appt.id,
  } as ConnecteamBookingPayload & { _endDatetimeOverride?: string; _appointmentId?: string };
}

/**
 * Converts a Job row into ConnecteamBookingPayload.
 * Uses scheduled_date for the shift; defaults to tomorrow if absent.
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
    service:           job.service,
    address:           job.address,
    preferredDate:     job.scheduled_date ?? null,
    preferredTime:     "morning",            // jobs default to morning start
    notes:             job.notes,
    sourcePage:        "crm_job_created",
    internalBookingId: null,
    crmLeadId:         job.lead_id,
    _jobId:            job.id,
  } as ConnecteamBookingPayload & { _jobId?: string };
}

// ── ID extractor ──────────────────────────────────────────────────────────────
// Handles the two common Connecteam response shapes:
//   • Array:            [{ id: "…", … }, …]
//   • Object with list: { shifts: [{ id: "…" }, …] }

function extractShiftId(raw: unknown): string | null {
  if (!raw) return null;

  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0] as Record<string, unknown>;
    return first?.id != null ? String(first.id) : null;
  }

  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (obj.id != null) return String(obj.id);
    if (Array.isArray(obj.shifts) && (obj.shifts as unknown[]).length > 0) {
      const first = (obj.shifts as Record<string, unknown>[])[0];
      return first?.id != null ? String(first.id) : null;
    }
  }

  return null;
}
