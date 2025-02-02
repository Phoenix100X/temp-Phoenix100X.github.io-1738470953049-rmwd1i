/*
  # Add Operational Tables

  1. New Tables
    - `attendance` - Track child check-in/out
    - `staff_schedules` - Staff scheduling
    - `payroll` - Staff payroll records
    - `payments` - Payment transactions

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create attendance table
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  check_in_time timestamptz NOT NULL,
  check_out_time timestamptz,
  checked_in_by uuid REFERENCES profiles(id),
  checked_out_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create staff_schedules table
CREATE TABLE staff_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  role text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create payroll table
CREATE TABLE payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  pay_period_start timestamptz NOT NULL,
  pay_period_end timestamptz NOT NULL,
  hours_worked numeric NOT NULL,
  hourly_rate numeric NOT NULL,
  total_pay numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL,
  payment_method text NOT NULL,
  transaction_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Attendance policies
CREATE POLICY "Staff can manage attendance"
  ON attendance
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('staff', 'admin')
  ));

CREATE POLICY "Parents can view their children's attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

-- Staff schedules policies
CREATE POLICY "Staff can view their own schedule"
  ON staff_schedules FOR SELECT
  TO authenticated
  USING (staff_id = auth.uid());

CREATE POLICY "Admins can manage all schedules"
  ON staff_schedules
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Payroll policies
CREATE POLICY "Staff can view their own payroll"
  ON payroll FOR SELECT
  TO authenticated
  USING (staff_id = auth.uid());

CREATE POLICY "Admins can manage all payroll"
  ON payroll
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Payments policies
CREATE POLICY "Clients can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT client_id FROM client_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all payments"
  ON payments
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));