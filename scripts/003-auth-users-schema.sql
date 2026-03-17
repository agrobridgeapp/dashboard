-- AgroBridge Auth & Registration Schema
-- Migration 003: users, registrations, invite_tokens

-- ─────────────────────────────────────────────
-- Users (accounts with login credentials)
-- Buyer/Partner: self-signup → pre_onboarding → active
-- Agent/Farmer:  invite_only (approved by Ops first)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               VARCHAR(320) UNIQUE NOT NULL,
  password_hash       TEXT NOT NULL,
  first_name          VARCHAR(100),
  last_name           VARCHAR(100),
  phone               VARCHAR(30),
  role                VARCHAR(50) NOT NULL,
  onboarding_status   VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (onboarding_status IN ('pending','in_progress','complete','under_review')),
  account_status      VARCHAR(30) NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active','suspended','deactivated')),
  email_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  registration_id     UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role          ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_onb_status    ON users(onboarding_status);

-- ─────────────────────────────────────────────
-- Registrations (agent/farmer pre-approval queue)
-- No password. Ops reviews → approves → sends invite.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role            VARCHAR(30) NOT NULL CHECK (role IN ('field_agent','farmer')),
  status          VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','invited','active')),

  -- Personal
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  phone           VARCHAR(30) NOT NULL,
  email           VARCHAR(320),

  -- Location
  state_id        INTEGER REFERENCES states(id),
  lga_id          INTEGER REFERENCES lgas(id),
  community_name  VARCHAR(200),

  -- Agent-specific
  education       VARCHAR(50),
  experience      TEXT,
  farming_knowledge TEXT,
  has_bike        BOOLEAN DEFAULT FALSE,
  has_smartphone  BOOLEAN DEFAULT FALSE,
  references_text TEXT,
  motivation      TEXT,
  referred_by     VARCHAR(100),

  -- Farmer-specific
  farm_size       DECIMAL(8,2),
  soil_type       VARCHAR(50),
  irrigation_access BOOLEAN DEFAULT FALSE,
  crop_types      TEXT,   -- comma-separated

  -- Review
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  rejection_reason TEXT,
  ops_notes       TEXT,

  -- Invite tracking
  invited_at      TIMESTAMPTZ,
  invite_sent_to  VARCHAR(320),

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_role   ON registrations(role);
CREATE INDEX IF NOT EXISTS idx_registrations_phone  ON registrations(phone);

-- ─────────────────────────────────────────────
-- Invite Tokens (one-time tokens for approved users)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invite_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token           VARCHAR(128) UNIQUE NOT NULL,
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  role            VARCHAR(30) NOT NULL,
  email           VARCHAR(320),
  phone           VARCHAR(30),
  used            BOOLEAN NOT NULL DEFAULT FALSE,
  used_at         TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_tokens_token     ON invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_reg_id    ON invite_tokens(registration_id);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_used      ON invite_tokens(used);

-- ─────────────────────────────────────────────
-- updated_at triggers
-- ─────────────────────────────────────────────
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
