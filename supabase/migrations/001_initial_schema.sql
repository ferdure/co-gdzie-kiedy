-- Shopping List Application Database Schema
-- Run this migration in your Supabase SQL editor

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('piece', 'kg', 'g', 'l', 'ml', 'pack', 'bottle')),
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  is_bought BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_item_id UUID NOT NULL REFERENCES shopping_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  value_decimal NUMERIC(10, 2),
  value_percentage NUMERIC(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (date_to >= date_from)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON shopping_items(category_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_item ON opportunities(shopping_item_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_dates ON opportunities(date_from, date_to);
CREATE INDEX IF NOT EXISTS idx_opportunities_name ON opportunities(name);

-- Row Level Security (RLS) - enable for production
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users and anon (adjust for your auth setup)
CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on shopping_items" ON shopping_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on opportunities" ON opportunities FOR ALL USING (true) WITH CHECK (true);

-- Seed data for categories (optional)
INSERT INTO categories (name) VALUES
  ('Warzywa i owoce'),
  ('Mięso i ryby'),
  ('Nabiał'),
  ('Pieczywo'),
  ('Napoje'),
  ('Przekąski'),
  ('Chemia i higiena'),
  ('Inne')
ON CONFLICT DO NOTHING;
