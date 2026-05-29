// ── Lead / CRM Types ───────────────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "site_visit_scheduled"
  | "quote_sent"
  | "negotiating"
  | "approved"
  | "won"
  | "lost";

export interface Lead {
  id: string;
  // Contact
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  // Request
  service: string | null;
  building_type: string | null;
  sq_footage: string | null;
  frequency: string | null;
  notes: string | null;
  // CRM
  status: LeadStatus;
  assigned_to: string | null;
  estimated_value: number | null;
  follow_up_date: string | null;
  source: string | null;
  // Meta
  created_at: string;
  updated_at: string | null;
  converted_to_customer: boolean;
  customer_id: string | null;
  // Connecteam
  connecteam_sync_status: ConnecteamSyncStatus | null;
  connecteam_external_id: string | null;
  connecteam_sync_date: string | null;
}

// ── Appointment / Calendar Types ───────────────────────────────────────────

export type AppointmentType =
  | "estimate"
  | "site_visit"
  | "cleaning_service"
  | "maintenance_call"
  | "inspection"
  | "follow_up";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface Appointment {
  id: string;
  title: string;
  type: AppointmentType;
  status: AppointmentStatus;
  lead_id: string | null;
  customer_id: string | null;
  job_id: string | null;
  contact_name: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  service: string | null;
  assigned_to: string | null;
  start_datetime: string;
  end_datetime: string | null;
  notes: string | null;
  recurring: boolean;
  recurrence_rule: string | null;
  created_at: string;
  updated_at: string | null;
  // Connecteam
  connecteam_sync_status: ConnecteamSyncStatus | null;
  connecteam_external_id: string | null;
  connecteam_sync_date: string | null;
}

// ── Customer Types ─────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  building_type: string | null;
  notes: string | null;
  portal_email: string | null;
  portal_password_hash: string | null;
  created_at: string;
  updated_at: string | null;
  lifetime_value: number;
  outstanding_balance: number;
  is_active: boolean;
}

// ── Job Types ──────────────────────────────────────────────────────────────

export type JobStatus =
  | "scheduled"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Job {
  id: string;
  customer_id: string | null;
  lead_id: string | null;
  estimate_id: string | null;
  title: string;
  service: string | null;
  status: JobStatus;
  assigned_to: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  address: string | null;
  notes: string | null;
  completion_notes: string | null;
  created_at: string;
  updated_at: string | null;
  // Connecteam
  connecteam_sync_status: ConnecteamSyncStatus | null;
  connecteam_external_id: string | null;
  connecteam_sync_date: string | null;
}

// ── Estimate Types ─────────────────────────────────────────────────────────

export type EstimateStatus =
  | "draft"
  | "sent"
  | "approved"
  | "rejected"
  | "expired";

export interface EstimateItem {
  id: string;
  estimate_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Estimate {
  id: string;
  estimate_number: string;
  customer_id: string | null;
  lead_id: string | null;
  status: EstimateStatus;
  issue_date: string;
  expiry_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  notes: string | null;
  internal_notes: string | null;
  items: EstimateItem[];
  created_at: string;
  updated_at: string | null;
}

// ── Invoice Types ──────────────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string | null;
  job_id: string | null;
  estimate_id: string | null;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  notes: string | null;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string | null;
}

// ── Notification Types ─────────────────────────────────────────────────────

export type NotificationType =
  | "new_lead"
  | "new_booking"
  | "estimate_approved"
  | "job_assigned"
  | "invoice_paid"
  | "upcoming_appointment"
  | "follow_up_overdue"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

// ── Activity Types ─────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  entity_type: "lead" | "customer" | "job" | "estimate" | "invoice";
  entity_id: string;
  action: string;
  description: string;
  created_by: string | null;
  created_at: string;
}

// ── Booking Types ──────────────────────────────────────────────────────────

export type ConnecteamSyncStatus = "pending" | "synced" | "failed" | "disabled";

export interface Booking {
  id: string;
  service: string | null;
  company_name: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  property_type: string | null;
  facility_size: string | null;
  frequency: string | null;
  date: string | null;
  time_slot: string | null;
  instructions: string | null;
  notes: string | null;
  photos: string[];
  status: string;
  lead_id: string | null;
  // Connecteam sync
  connecteam_sync_status: ConnecteamSyncStatus | null;
  connecteam_external_id: string | null;
  created_at: string;
}

// ── Dashboard Stats ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalLeads: number;
  newLeadsThisWeek: number;
  pipelineValue: number;
  monthlyRevenue: number;
  jobsWon: number;
  conversionRate: number;
  pendingEstimates: number;
  outstandingInvoices: number;
  upcomingAppointments: number;
}
