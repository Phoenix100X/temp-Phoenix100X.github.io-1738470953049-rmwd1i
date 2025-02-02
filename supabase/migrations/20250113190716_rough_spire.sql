/*
  # White Label Support Implementation

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `domain` (text, unique)
      - `branding` (jsonb)
      - `settings` (jsonb)
      - `subscription_tier` (text)
      - `active` (boolean)
      - `created_at` (timestamp)

    - `client_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `client_id` (uuid, references clients)
      - `role` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on new tables
    - Add policies for client access
    - Add policies for user management

  3. Changes
    - Add client relationship to existing tables
*/

-- Create clients table
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    domain text UNIQUE NOT NULL,
    branding jsonb NOT NULL DEFAULT '{
        "logo": null,
        "primary_color": "#2563eb",
        "secondary_color": "#1e40af",
        "font_family": "Inter"
    }',
    settings jsonb NOT NULL DEFAULT '{
        "features": {
            "billing": true,
            "documents": true,
            "messages": true,
            "attendance": true
        },
        "max_children": null,
        "max_staff": null
    }',
    subscription_tier text NOT NULL DEFAULT 'basic',
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create client_users junction table
CREATE TABLE client_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('owner', 'admin', 'staff', 'parent')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, client_id)
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;

-- Policies for clients table
CREATE POLICY "Platform admins can manage all clients"
    ON clients
    TO authenticated
    USING (
        auth.jwt() ? 'is_platform_admin' 
        AND auth.jwt()->>'is_platform_admin' = 'true'
    );

CREATE POLICY "Users can view their assigned client"
    ON clients
    FOR SELECT
    TO authenticated
    USING (
        id IN (
            SELECT client_id 
            FROM client_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policies for client_users table
CREATE POLICY "Platform admins can manage all client users"
    ON client_users
    TO authenticated
    USING (
        auth.jwt() ? 'is_platform_admin' 
        AND auth.jwt()->>'is_platform_admin' = 'true'
    );

CREATE POLICY "Client admins can manage their client users"
    ON client_users
    TO authenticated
    USING (
        client_id IN (
            SELECT client_id 
            FROM client_users 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Functions for client management
CREATE OR REPLACE FUNCTION get_user_client()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT client_id
        FROM client_users
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$;