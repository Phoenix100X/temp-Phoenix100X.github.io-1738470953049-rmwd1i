import { describe, test, expect } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Staff Management Tests', () => {
  test('Staff Scheduling', async () => {
    const mockSchedule = {
      staff_id: 'test-staff-id',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      role: 'teacher'
    };

    const { error } = await supabase
      .from('staff_schedules')
      .insert(mockSchedule);

    expect(error).toBeNull();
  });

  test('Payroll Calculation', async () => {
    const mockPayroll = {
      staff_id: 'test-staff-id',
      pay_period_start: new Date().toISOString(),
      pay_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      hours_worked: 80,
      hourly_rate: 25,
      total_pay: 2000
    };

    const { error } = await supabase
      .from('payroll')
      .insert(mockPayroll);

    expect(error).toBeNull();
  });
});