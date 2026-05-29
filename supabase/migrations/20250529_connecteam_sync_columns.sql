-- Migration: Add Connecteam sync tracking columns to bookings table
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- or via: supabase db push

-- ── 1. Create the status enum (idempotent) ────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'connecteam_sync_status') THEN
    CREATE TYPE connecteam_sync_status AS ENUM ('pending', 'synced', 'failed', 'disabled');
  END IF;
END
$$;

-- ── 2. Add columns to bookings ────────────────────────────────────────────────

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS connecteam_sync_status  connecteam_sync_status  DEFAULT 'disabled',
  ADD COLUMN IF NOT EXISTS connecteam_external_id  TEXT                    DEFAULT NULL;

-- ── 3. Add lead_id FK if not already present ─────────────────────────────────
-- (The booking route sets this after lead creation; safe to add here.)

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

-- ── 4. Index for efficient retry queries ─────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_bookings_connecteam_sync_status
  ON bookings (connecteam_sync_status)
  WHERE connecteam_sync_status IN ('failed', 'pending');

-- ── 5. Back-fill existing rows ────────────────────────────────────────────────
-- Existing bookings that predate this migration are marked disabled
-- (they were saved before the integration existed).

UPDATE bookings
SET connecteam_sync_status = 'disabled'
WHERE connecteam_sync_status IS NULL;

-- ── Done ──────────────────────────────────────────────────────────────────────
-- After running this migration:
--   1. Add the Connecteam env vars to your Vercel project settings
--   2. Set CONNECTEAM_ENABLED=true when ready to go live
--   3. Use POST /api/admin/connecteam/retry to re-sync any failed bookings
