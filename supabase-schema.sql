-- ============================================================
-- Ultimate Building Services — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Leads ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Contact
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  -- Request
  service TEXT,
  building_type TEXT,
  sq_footage TEXT,
  frequency TEXT,
  notes TEXT,
  -- CRM fields
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to TEXT,
  estimated_value NUMERIC(10,2),
  follow_up_date DATE,
  source TEXT DEFAULT 'website',
  -- Conversion
  converted_to_customer BOOLEAN DEFAULT FALSE,
  customer_id UUID,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ── Bookings (from booking wizard) ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service TEXT,
  company_name TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  property_type TEXT,
  facility_size TEXT,
  frequency TEXT,
  date DATE,
  time_slot TEXT,
  instructions TEXT,
  notes TEXT,
  photos TEXT[], -- array of filenames
  status TEXT NOT NULL DEFAULT 'new',
  lead_id UUID REFERENCES leads(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- ── Customers ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'NV',
  zip TEXT,
  building_type TEXT,
  notes TEXT,
  portal_email TEXT UNIQUE,
  portal_password_hash TEXT,
  lifetime_value NUMERIC(10,2) DEFAULT 0,
  outstanding_balance NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- ── Appointments / Calendar ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'estimate', -- estimate | site_visit | cleaning_service | maintenance_call | inspection | follow_up
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | confirmed | in_progress | completed | cancelled | rescheduled
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  job_id UUID,
  contact_name TEXT,
  company_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  service TEXT,
  assigned_to TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  notes TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start_datetime);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ── Jobs ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  estimate_id UUID,
  title TEXT NOT NULL,
  service TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | assigned | in_progress | completed | cancelled
  assigned_to TEXT,
  scheduled_date DATE,
  completed_date DATE,
  address TEXT,
  notes TEXT,
  completion_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- ── Estimates ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimate_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | sent | approved | rejected | expired
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  subtotal NUMERIC(10,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 8.375, -- Nevada sales tax
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS estimate_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0
);

-- Auto-increment estimate numbers
CREATE SEQUENCE IF NOT EXISTS estimate_number_seq START 1001;

-- ── Invoices ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | sent | partial | paid | overdue | cancelled
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal NUMERIC(10,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 8.375,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  balance_due NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0
);

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 2001;

-- ── Notifications ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ── Activity Log ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL, -- lead | customer | job | estimate | invoice
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities(entity_type, entity_id);

-- ── Career Applications ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS career_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  position TEXT,
  transport TEXT,
  start_date TEXT,
  skills TEXT[],
  referred TEXT,
  status TEXT DEFAULT 'new', -- new | reviewed | interview | hired | rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  method TEXT DEFAULT 'check', -- check | cash | card | ach | other
  reference TEXT,             -- check number, transaction ID, etc.
  notes TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security (RLS) ──────────────────────────────────────────────
-- By default all tables are private.
-- For the customer portal, you'd add specific policies.
-- For admin routes using service_key, RLS is bypassed.

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (admin routes use service key)
CREATE POLICY "Service role has full access to leads" ON leads FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to bookings" ON bookings FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to customers" ON customers FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to appointments" ON appointments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to jobs" ON jobs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to estimates" ON estimates FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to estimate_items" ON estimate_items FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to invoices" ON invoices FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to invoice_items" ON invoice_items FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to notifications" ON notifications FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to activities" ON activities FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to careers" ON career_applications FOR ALL TO service_role USING (true);
CREATE POLICY "Service role has full access to payments" ON payments FOR ALL TO service_role USING (true);

-- Allow anonymous users to INSERT into leads (from website forms)
CREATE POLICY "Anon can insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert careers" ON career_applications FOR INSERT TO anon WITH CHECK (true);

-- NOTE: All customer portal routes use the service_role key via getSupabaseAdmin()
-- so no additional RLS policies are required for portal access.
-- Portal auth is handled at the application layer (HMAC-signed cookie in lib/portal-auth.ts).
-- Each portal API route verifies the customer ID from the cookie before querying data.

-- ── Portal credential management ──────────────────────────────────────────────
-- Admin sets portal credentials via the CRM (Customers → set portal_email + portal_password_hash)
-- For production, upgrade portal_password_hash to store bcrypt hashes:
--   UPDATE customers SET portal_password_hash = crypt('password', gen_salt('bf')) WHERE id = '...';
-- And verify with: portal_password_hash = crypt(input_password, portal_password_hash)

-- ── Portal messages table (optional — currently uses activities table) ─────────
-- Portal messages are stored in the activities table with action = 'portal_message'
-- Entity type: 'customer', entity_id: customer.id
-- Description format: "[Portal Message] Subject: Body"
