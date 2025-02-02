import { describe, test, expect, beforeEach } from 'vitest';
import { supabase } from '../lib/supabase';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { addDays, addMinutes } from 'date-fns';

describe('Booking System Tests', () => {
  const testChild = {
    id: 'test-child-id',
    parent_id: 'test-parent-id',
    first_name: 'Test',
    last_name: 'Child'
  };

  const timeZone = 'America/New_York';

  beforeEach(async () => {
    // Clean up test data
    await supabase.from('bookings').delete().eq('child_id', testChild.id);
  });

  test('Create Booking - Available Slot', async () => {
    const startTime = zonedTimeToUtc('2024-01-20 09:00', timeZone);
    const endTime = zonedTimeToUtc('2024-01-20 17:00', timeZone);

    const mockBooking = {
      child_id: testChild.id,
      start_time: startTime,
      end_time: endTime,
      status: 'pending',
      package_type: 'daily'
    };

    const { error } = await supabase
      .from('bookings')
      .insert(mockBooking);

    expect(error).toBeNull();
  });

  test('Create Booking - Conflict Detection', async () => {
    // First booking
    const startTime = zonedTimeToUtc('2024-01-20 09:00', timeZone);
    const endTime = zonedTimeToUtc('2024-01-20 17:00', timeZone);

    const firstBooking = {
      child_id: testChild.id,
      start_time: startTime,
      end_time: endTime,
      status: 'confirmed',
      package_type: 'daily'
    };

    await supabase.from('bookings').insert(firstBooking);

    // Attempt conflicting booking
    const conflictStart = zonedTimeToUtc('2024-01-20 10:00', timeZone);
    const conflictEnd = zonedTimeToUtc('2024-01-20 15:00', timeZone);

    const conflictingBooking = {
      child_id: testChild.id,
      start_time: conflictStart,
      end_time: conflictEnd,
      status: 'pending',
      package_type: 'daily'
    };

    const { error } = await supabase
      .from('bookings')
      .insert(conflictingBooking);

    expect(error).not.toBeNull();
  });

  test('Timezone Conversion - DST Transition', async () => {
    // Test booking during DST transition
    const dstTransitionDate = new Date('2024-03-10T02:00:00');
    
    // Add a buffer to ensure we're past the transition
    const bookingDate = addMinutes(dstTransitionDate, 120);
    
    // Convert local time to UTC for storage
    const startTime = zonedTimeToUtc('09:00', bookingDate, timeZone);
    const endTime = zonedTimeToUtc('17:00', bookingDate, timeZone);

    const booking = {
      child_id: testChild.id,
      start_time: startTime,
      end_time: endTime,
      status: 'pending',
      package_type: 'daily'
    };

    const { error } = await supabase
      .from('bookings')
      .insert(booking);

    expect(error).toBeNull();

    // Verify the stored times are correct
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('child_id', testChild.id)
      .single();

    // Convert stored UTC times back to local timezone for verification
    const storedStartTime = formatInTimeZone(
      new Date(data.start_time),
      timeZone,
      'HH:mm'
    );
    const storedEndTime = formatInTimeZone(
      new Date(data.end_time),
      timeZone,
      'HH:mm'
    );

    expect(storedStartTime).toBe('09:00');
    expect(storedEndTime).toBe('17:00');
  });

  test('Recurring Booking Creation', async () => {
    const startDate = zonedTimeToUtc('2024-01-20 09:00', timeZone);
    const endDate = zonedTimeToUtc('2024-01-20 17:00', timeZone);

    const recurringBookings = Array.from({ length: 4 }, (_, i) => ({
      child_id: testChild.id,
      start_time: addDays(startDate, i * 7),
      end_time: addDays(endDate, i * 7),
      status: 'pending',
      package_type: 'recurring'
    }));

    const { error } = await supabase
      .from('bookings')
      .insert(recurringBookings);

    expect(error).toBeNull();
  });
});