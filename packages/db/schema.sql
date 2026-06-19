-- CostPilot Database Schema
-- Neon PostgreSQL

-- Enum for user niches
CREATE TYPE user_niche AS ENUM ('contractor', 'real_estate_agent', 'other');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  niche user_niche NOT NULL,
  oauth_provider VARCHAR(50), -- 'google', 'facebook', 'linkedin'
  oauth_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Receipts table
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255),
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'CAD',
  category VARCHAR(100),
  date DATE,
  image_url TEXT,
  extracted_data JSONB, -- OCR extracted data
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, date)
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receipt_id UUID REFERENCES receipts(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CAD',
  category VARCHAR(100),
  description TEXT,
  date DATE NOT NULL,
  is_tax_deductible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, date)
);

-- Mileage tracking (for contractors & real estate agents)
CREATE TABLE mileage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  kilometers DECIMAL(10, 2) NOT NULL,
  purpose VARCHAR(255),
  deduction_rate DECIMAL(5, 4) DEFAULT 0.70, -- CRA standard rate
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, date)
);

-- Tax summary (auto-generated)
CREATE TABLE tax_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  total_expenses DECIMAL(12, 2),
  total_mileage DECIMAL(10, 2),
  mileage_deduction DECIMAL(12, 2),
  tax_deductible_expenses DECIMAL(12, 2),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, year)
);

-- Create indexes
CREATE INDEX idx_users_niche ON users(niche);
CREATE INDEX idx_receipts_user ON receipts(user_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_mileage_user ON mileage(user_id);
CREATE INDEX idx_tax_summary_user ON tax_summary(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mileage_updated_at BEFORE UPDATE ON mileage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
