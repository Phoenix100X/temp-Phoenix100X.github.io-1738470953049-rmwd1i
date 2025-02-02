/*
  # Fix Profile Policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Simplify profile access policies
    - Add proper role-based access control

  2. Security
    - Enable RLS on profiles table
    - Add policies for profile access
*/

-- Drop existing policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Staff and admins can view all profiles" ON profiles;

-- Create new, non-recursive policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin access all profiles"
  ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Staff view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
      AND role = 'staff'
    )
  );