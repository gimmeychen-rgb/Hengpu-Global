CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'buyer', 'supplier', 'agent');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE request_category AS ENUM ('mining', 'hinge', 'trade');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('open', 'closed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('draft', 'negotiating', 'executing', 'closed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  trust_score INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  product_categories TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category request_category NOT NULL,
  budget_min NUMERIC(14, 2) NOT NULL CHECK (budget_min >= 0),
  budget_max NUMERIC(14, 2) NOT NULL CHECK (budget_max >= budget_min),
  country_target TEXT NOT NULL,
  status request_status NOT NULL DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 0),
  status match_status NOT NULL DEFAULT 'pending',
  UNIQUE (request_id, supplier_id)
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_requests_buyer_id ON requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_matches_request_id ON matches(request_id);
CREATE INDEX IF NOT EXISTS idx_projects_buyer_id ON projects(buyer_id);
CREATE INDEX IF NOT EXISTS idx_projects_supplier_id ON projects(supplier_id);

INSERT INTO users (id, name, email, password_hash, role, trust_score)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Atlas Mining Supply', 'atlas@example.com', 'seeded', 'supplier', 85),
  ('00000000-0000-0000-0000-000000000102', 'Precision Hinge Works', 'hinge@example.com', 'seeded', 'supplier', 78),
  ('00000000-0000-0000-0000-000000000103', 'Global Trade Bridge', 'trade@example.com', 'seeded', 'supplier', 72)
ON CONFLICT (email) DO NOTHING;

INSERT INTO suppliers (id, user_id, company_name, country, product_categories, verified)
VALUES
  ('10000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000101', 'Atlas Mining Supply', 'Chile', ARRAY['mining', 'trade'], TRUE),
  ('10000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000102', 'Precision Hinge Works', 'China', ARRAY['hinge'], TRUE),
  ('10000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000103', 'Global Trade Bridge', 'Singapore', ARRAY['trade', 'mining'], FALSE)
ON CONFLICT (id) DO NOTHING;
