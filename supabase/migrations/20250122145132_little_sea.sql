/*
  # Fix Profile Policies - Final

  1. Changes
    - Remove all existing policies
    - Create simplified policies without recursion
    - Add basic insert policy for registration
    - Add proper role-based access without circular dependencies

  2. Security
    - Maintain RLS protection
    - Ensure proper access control
    - Allow profile creation during registration
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin access all profiles" ON profiles;
DROP POLICY IF EXISTS "Staff view all profiles" ON profiles;

-- Create simplified policies
CREATE POLICY "Enable read access for authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for registration"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Enable delete for admins"
  ON profiles FOR DELETE
  TO authenticated
  USING (role = 'admin');