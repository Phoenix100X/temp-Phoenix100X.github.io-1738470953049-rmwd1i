import { describe, test, expect } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Attendance System Tests', () => {
  test('Child Check-in', async () => {
    const mockCheckIn = {
      child_id: 'test-child-id',
      check_in_time: new Date().toISOString(),
      checked_in_by: 'test-staff-id'
    };

    const { error } = await supabase
      .from('attendance')
      .insert(mockCheckIn);

    expect(error).toBeNull();
  });

  test('Child Check-out', async () => {
    const mockCheckOut = {
      attendance_id: 'test-attendance-id',
      check_out_time: new Date().toISOString(),
      checked_out_by: 'test-staff-id'
    };

    const { error } = await supabase
      .from('attendance')
      .update(mockCheckOut)
      .eq('id', mockCheckOut.attendance_id);

    expect(error).toBeNull();
  });
});