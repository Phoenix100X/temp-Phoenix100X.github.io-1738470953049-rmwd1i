/*
  # Add support configuration

  1. New Tables
    - `support_config`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `support_type` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `hours` (text, optional)
      - `additional_info` (jsonb, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `support_config` table
    - Add policies for platform admins and client owners
*/

CREATE TABLE support_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    support_type text NOT NULL,
    email text NOT NULL,
    phone text,
    hours text,
    additional_info jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(client_id, support_type)
);

-- Enable RLS
ALTER TABLE support_config ENABLE ROW LEVEL SECURITY;

-- Policies for support_config
CREATE POLICY "Platform admins can manage all support configs"
    ON support_config
    TO authenticated
    USING (
        auth.jwt() ? 'is_platform_admin' 
        AND auth.jwt()->>'is_platform_admin' = 'true'
    );

CREATE POLICY "Client owners can manage their support config"
    ON support_config
    TO authenticated
    USING (
        client_id IN (
            SELECT client_id 
            FROM client_users 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can view their client's support config"
    ON support_config
    FOR SELECT
    TO authenticated
    USING (
        client_id IN (
            SELECT client_id 
            FROM client_users 
            WHERE user_id = auth.uid()
        )
    );