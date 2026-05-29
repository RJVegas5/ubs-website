-- ══════════════════════════════════════════════════════════════════════════════
-- CRM + Portal Enhancement Tables
-- Run in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

-- ── job_photos ────────────────────────────────────────────────────────────────
-- Before / progress / after photos uploaded by UBS staff, visible in portal

CREATE TABLE IF NOT EXISTS job_photos (
  id           SERIAL PRIMARY KEY,
  job_id       INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id  INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  lead_id      INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  uploader     TEXT NOT NULL DEFAULT 'UBS Team',
  photo_type   TEXT NOT NULL DEFAULT 'progress', -- before | progress | after
  url          TEXT NOT NULL,
  caption      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_photos_job    ON job_photos(job_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_cust   ON job_photos(customer_id);

ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_photos' AND policyname='Service role full access job_photos') THEN
    CREATE POLICY "Service role full access job_photos" ON job_photos FOR ALL TO service_role USING (true);
  END IF;
END $$;

-- ── job_updates ───────────────────────────────────────────────────────────────
-- Staff posts visible to customer in portal (crew arrived, work completed, etc.)

CREATE TABLE IF NOT EXISTS job_updates (
  id                       SERIAL PRIMARY KEY,
  job_id                   INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id              INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  author                   TEXT NOT NULL DEFAULT 'UBS Team',
  content                  TEXT NOT NULL,
  is_visible_to_customer   BOOLEAN DEFAULT TRUE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_updates_job  ON job_updates(job_id);
CREATE INDEX IF NOT EXISTS idx_job_updates_cust ON job_updates(customer_id);

ALTER TABLE job_updates ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_updates' AND policyname='Service role full access job_updates') THEN
    CREATE POLICY "Service role full access job_updates" ON job_updates FOR ALL TO service_role USING (true);
  END IF;
END $$;

-- ── messages ──────────────────────────────────────────────────────────────────
-- Two-way messages between UBS and customers (replaces activities-based approach)

CREATE TABLE IF NOT EXISTS messages (
  id           SERIAL PRIMARY KEY,
  customer_id  INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  lead_id      INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  direction    TEXT NOT NULL DEFAULT 'inbound',  -- inbound | outbound
  sender_name  TEXT,
  subject      TEXT,
  body         TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_customer  ON messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread    ON messages(customer_id, is_read) WHERE is_read = false;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='Service role full access messages') THEN
    CREATE POLICY "Service role full access messages" ON messages FOR ALL TO service_role USING (true);
  END IF;
END $$;

-- ── Portal activity tracking ──────────────────────────────────────────────────
-- Track customer portal usage visible in CRM

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS portal_last_login   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS portal_login_count  INTEGER DEFAULT 0;

-- ── Done ──────────────────────────────────────────────────────────────────────
-- After running:
--   1. Upload photos via POST /api/jobs/:id/photos
--   2. Post updates via POST /api/jobs/:id/updates
--   3. Message customers via POST /api/messages
--   4. Portal shows photos + updates + messages automatically
