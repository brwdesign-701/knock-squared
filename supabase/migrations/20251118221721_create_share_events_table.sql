/*
  # Create share_events table

  ## Overview
  Stores events when technician profiles are shared with customers

  ## New Table: share_events
  - `id` (uuid, primary key) - Unique share event identifier
  - `technician_id` (uuid, foreign key) - Link to technicians table
  - `company_id` (uuid, foreign key) - Link to companies table
  - `customer_name` (text) - Name of customer receiving the share
  - `contact_info` (text) - Email or phone where share was sent
  - `delivery_method` (text) - 'email' or 'sms'
  - `share_token` (text, nullable) - Unique token for tracking
  - `created_at` (timestamptz) - When the share was created

  ## Security
  - RLS enabled to restrict access to company users
  - Companies can only view share events for their technicians
*/

CREATE TABLE IF NOT EXISTS share_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id uuid REFERENCES technicians(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  contact_info text NOT NULL,
  delivery_method text NOT NULL CHECK (delivery_method IN ('email', 'sms')),
  share_token text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE share_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view own share events"
  ON share_events FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Companies can insert share events"
  ON share_events FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_share_events_company_id ON share_events(company_id);
CREATE INDEX IF NOT EXISTS idx_share_events_technician_id ON share_events(technician_id);
