/*
  # Knock² Database Schema

  ## Overview
  This migration creates the complete database schema for Knock² - a SaaS platform 
  for service companies to share technician information with customers.

  ## New Tables

  ### 1. companies
  Stores company information and account details
  - `id` (uuid, primary key) - Unique company identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `company_name` (text) - Name of the service company
  - `email` (text) - Company contact email
  - `phone` (text, nullable) - Company phone number
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. company_settings
  Stores branding and customization preferences
  - `id` (uuid, primary key) - Unique settings identifier
  - `company_id` (uuid, foreign key) - Links to companies table
  - `logo_url` (text, nullable) - URL to company logo
  - `primary_color` (text) - Brand primary color (default: #0B2E51)
  - `secondary_color` (text) - Brand secondary color (default: #39C0C3)
  - `created_at` (timestamptz) - Settings creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. technicians
  Stores technician profile information
  - `id` (uuid, primary key) - Unique technician identifier
  - `company_id` (uuid, foreign key) - Links to companies table
  - `first_name` (text) - Technician first name
  - `last_name` (text) - Technician last name
  - `title` (text) - Job title/role
  - `photo_url` (text, nullable) - Profile photo URL
  - `bio` (text, nullable) - Professional bio/description
  - `certifications` (text[], nullable) - Array of certifications
  - `years_experience` (integer, nullable) - Years in the field
  - `is_active` (boolean) - Active status (default: true)
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled to ensure data isolation between companies.

  ### Companies Table Policies
  1. Users can view their own company data
  2. Users can update their own company data
  3. New users can insert their company data during signup

  ### Company Settings Table Policies
  1. Companies can view their own settings
  2. Companies can update their own settings
  3. Companies can insert their initial settings

  ### Technicians Table Policies
  1. Companies can view their own technicians
  2. Companies can insert new technicians
  3. Companies can update their own technicians
  4. Companies can delete their own technicians
  5. PUBLIC access for viewing technician profiles (for customer view)

  ## Indexes
  - Foreign key indexes for performance
  - Index on technician company_id for fast lookups
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL UNIQUE,
  logo_url text,
  primary_color text DEFAULT '#0B2E51' NOT NULL,
  secondary_color text DEFAULT '#39C0C3' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text NOT NULL,
  photo_url text,
  bio text,
  certifications text[],
  years_experience integer,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Companies table policies
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own company"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Company settings policies
CREATE POLICY "Companies can view own settings"
  ON company_settings FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Companies can update own settings"
  ON company_settings FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Companies can insert own settings"
  ON company_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Technicians table policies
CREATE POLICY "Companies can view own technicians"
  ON technicians FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Companies can insert technicians"
  ON technicians FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Companies can update own technicians"
  ON technicians FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Companies can delete own technicians"
  ON technicians FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Public policy for customer view (unauthenticated users can view active technicians)
CREATE POLICY "Anyone can view active technicians"
  ON technicians FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_company_settings_company_id ON company_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_technicians_company_id ON technicians(company_id);
CREATE INDEX IF NOT EXISTS idx_technicians_is_active ON technicians(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();