-- AgroBridge Nigeria Location Hierarchy Schema
-- Migration 001: States → LGAs → Communities → Corridors

-- ─────────────────────────────────────────────
-- States
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS states (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  code        VARCHAR(10),
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_states_active ON states(active);

-- ─────────────────────────────────────────────
-- LGAs (Local Government Areas)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lgas (
  id          SERIAL PRIMARY KEY,
  state_id    INTEGER NOT NULL REFERENCES states(id) ON DELETE RESTRICT,
  name        VARCHAR(150) NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(state_id, name)
);

CREATE INDEX IF NOT EXISTS idx_lgas_state_id ON lgas(state_id);
CREATE INDEX IF NOT EXISTS idx_lgas_active ON lgas(active);

-- ─────────────────────────────────────────────
-- Communities (town / ward / village level)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS communities (
  id          SERIAL PRIMARY KEY,
  lga_id      INTEGER NOT NULL REFERENCES lgas(id) ON DELETE RESTRICT,
  name        VARCHAR(200) NOT NULL,
  latitude    DECIMAL(9,6),
  longitude   DECIMAL(9,6),
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lga_id, name)
);

CREATE INDEX IF NOT EXISTS idx_communities_lga_id ON communities(lga_id);
CREATE INDEX IF NOT EXISTS idx_communities_active ON communities(active);

-- ─────────────────────────────────────────────
-- Corridors (Ops-defined operational clusters)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS corridors (
  id                    SERIAL PRIMARY KEY,
  name                  VARCHAR(200) NOT NULL UNIQUE,
  description           TEXT,
  primary_delivery_hub  VARCHAR(200),
  crop_focus            VARCHAR(200),
  active                BOOLEAN NOT NULL DEFAULT TRUE,
  created_by            VARCHAR(200),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corridors_active ON corridors(active);

-- ─────────────────────────────────────────────
-- Corridor ↔ Community mapping (many-to-many)
-- A community belongs to at most one active corridor
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS corridor_communities (
  corridor_id   INTEGER NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
  community_id  INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  assigned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (corridor_id, community_id)
);

CREATE INDEX IF NOT EXISTS idx_corridor_communities_community ON corridor_communities(community_id);

-- ─────────────────────────────────────────────
-- Corridor ↔ LGA mapping (denorm for fast queries)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS corridor_lgas (
  corridor_id INTEGER NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
  lga_id      INTEGER NOT NULL REFERENCES lgas(id) ON DELETE CASCADE,
  PRIMARY KEY (corridor_id, lga_id)
);

-- ─────────────────────────────────────────────
-- updated_at trigger function
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER states_updated_at
  BEFORE UPDATE ON states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER lgas_updated_at
  BEFORE UPDATE ON lgas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER corridors_updated_at
  BEFORE UPDATE ON corridors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
