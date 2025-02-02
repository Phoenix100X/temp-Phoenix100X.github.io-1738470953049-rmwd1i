/*
  # Create subscription plans and billing

  1. New Tables
    - `subscription_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `features` (jsonb)
      - `created_at` (timestamp)
    - `client_subscriptions`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `plan_id` (uuid, references subscription_plans)
      - `status` (text)
      - `current_period_start` (timestamp)
      - `current_period_end` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for platform admins and client owners
*/

-- Create subscription_plans table
CREATE TABLE subscription_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    features jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create client_subscriptions table
CREATE TABLE client_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    plan_id uuid REFERENCES subscription_plans(id),
    status text NOT NULL CHECK (status IN ('active', 'past_due', 'canceled')),
    current_period_start timestamptz NOT NULL,
    current_period_end timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(client_id)
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans
CREATE POLICY "Anyone can view subscription plans"
    ON subscription_plans
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only platform admins can modify subscription plans"
    ON subscription_plans
    USING (
        auth.jwt() ? 'is_platform_admin' 
        AND auth.jwt()->>'is_platform_admin' = 'true'
    );

-- Policies for client_subscriptions
CREATE POLICY "Platform admins can manage all subscriptions"
    ON client_subscriptions
    TO authenticated
    USING (
        auth.jwt() ? 'is_platform_admin' 
        AND auth.jwt()->>'is_platform_admin' = 'true'
    );

CREATE POLICY "Client owners can view their subscription"
    ON client_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        client_id IN (
            SELECT client_id 
            FROM client_users 
            WHERE user_id = auth.uid() 
            AND role = 'owner'
        )
    );

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, features) VALUES
    ('Basic', 'Perfect for small facilities', 49.99, '{
        "max_children": 50,
        "max_staff": 10,
        "features": {
            "billing": true,
            "documents": true,
            "messages": true,
            "attendance": true
        }
    }'),
    ('Professional', 'Ideal for growing facilities', 99.99, '{
        "max_children": 150,
        "max_staff": 30,
        "features": {
            "billing": true,
            "documents": true,
            "messages": true,
            "attendance": true,
            "api_access": true,
            "custom_reports": true
        }
    }'),
    ('Enterprise', 'For large organizations', 199.99, '{
        "max_children": null,
        "max_staff": null,
        "features": {
            "billing": true,
            "documents": true,
            "messages": true,
            "attendance": true,
            "api_access": true,
            "custom_reports": true,
            "white_label": true,
            "priority_support": true
        }
    }');