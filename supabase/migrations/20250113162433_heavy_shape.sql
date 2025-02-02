/*
  # Initial Schema Setup for KidCare Connect

  1. Tables
    - profiles
      - id (uuid, references auth.users)
      - role (enum: parent, staff, admin)
      - created_at (timestamp)
    - children
      - id (uuid)
      - parent_id (uuid, references profiles)
      - first_name (text)
      - last_name (text)
      - date_of_birth (date)
      - medical_info (jsonb)
      - emergency_contacts (jsonb[])
      - created_at (timestamp)
    - bookings
      - id (uuid)
      - child_id (uuid, references children)
      - start_time (timestamp)
      - end_time (timestamp)
      - status (enum: pending, confirmed, cancelled)
      - package_type (enum: hourly, daily, recurring)
      - created_at (timestamp)
    - care_packages
      - id (uuid)
      - name (text)
      - description (text)
      - price (numeric)
      - type (enum: hourly, daily, recurring)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on user roles
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('parent', 'staff', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE package_type AS ENUM ('hourly', 'daily', 'recurring');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'parent',
  created_at timestamptz DEFAULT now()
);

-- Create children table
CREATE TABLE children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  medical_info jsonb DEFAULT '{}',
  emergency_contacts jsonb[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  package_type package_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create care_packages table
CREATE TABLE care_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  type package_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_packages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Staff and admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('staff', 'admin')
  ));

-- Children policies
CREATE POLICY "Parents can view their own children"
  ON children FOR SELECT
  TO authenticated
  USING (parent_id = auth.uid());

CREATE POLICY "Staff and admins can view all children"
  ON children FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('staff', 'admin')
  ));

CREATE POLICY "Parents can insert their own children"
  ON children FOR INSERT
  TO authenticated
  WITH CHECK (parent_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    child_id IN (
      SELECT id FROM children WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Staff and admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('staff', 'admin')
  ));

-- Care packages policies
CREATE POLICY "All authenticated users can view care packages"
  ON care_packages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify care packages"
  ON care_packages FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));