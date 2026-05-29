-- Migration: Add Connecteam sync columns to leads, appointments, and jobs
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- This replaces the earlier booking-level sync approach.
-- Shifts are now created only when a lead is approved, an appointment
-- is scheduled, or a job is created — not on raw booking submission.

-- ── Ensure the status enum exists (created in prior migration) ────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'connecteam_sync_status') THEN
    CREATE TYPE connecteam_sync_status AS ENUM ('pending', 'synced', 'failed', 'disabled');
  END IF;
END
$$;

-- ── leads ─────────────────────────────────────────────────────────────────────

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS connecteam_sync_status  connecteam_sync_status  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS connecteam_external_id  TEXT                    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS connecteam_sync_date    TIMESTAMPTZ             DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_connecteam_sync_status
  ON leads (connecteam_sync_status)
  WHERE connecteam_sync_status IN ('failed', 'pending');

-- ── appointments ──────────────────────────────────────────────────────────────

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS connecteam_sync_status  connecteam_sync_status  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS connecteam_external_id  TEXT                    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS connecteam_sync_date    TIMESTAMPTZ             DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_connecteam_sync_status
  ON appointments (connecteam_sync_status)
  WHERE connecteam_sync_status IN ('failed', 'pending');

-- ── jobs ──────────────────────────────────────────────────────────────────────

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS connecteam_sync_status  connecteam_sync_status  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS connecteam_external_id  TEXT                    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS connecteam_sync_date    TIMESTAMPTZ             DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_connecteam_sync_status
  ON jobs (connecteam_sync_status)
  WHERE connecteam_sync_status IN ('failed', 'pending');

-- ── Note on the bookings table ────────────────────────────────────────────────
-- The connecteam_* columns added to "bookings" in the prior migration
-- (20250529_connecteam_sync_columns.sql) are intentionally left in place
-- but will always read NULL — they are no longer used.
-- Optionally drop them with:
--   ALTER TABLE bookings
--     DROP COLUMN IF EXISTS connecteam_sync_status,
--     DROP COLUMN IF EXISTS connecteam_external_id;

-- ── Done ──────────────────────────────────────────────────────────────────────
-- After running this migration:
--   1. Set CONNECTEAM_ENABLED=true in your environment
--   2. New shifts will be created when:
--        • PATCH /api/leads/{id}         with status "approved" or "won"
--        • POST  /api/appointments       (any new scheduled appointment)
--        • PATCH /api/appointments/{id}  with status "scheduled"
--        • POST  /api/jobs               (any new job)
--   3. Manual send: POST /api/admin/connecteam/send { entityType, entityId }
--   4. Retry failures: POST /api/admin/connecteam/retry
