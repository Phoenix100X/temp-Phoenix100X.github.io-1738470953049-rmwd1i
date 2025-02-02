// Test setup file
import { beforeAll } from 'vitest';
import { supabase } from '../lib/supabase';

beforeAll(async () => {
  // Clean up test data before running tests
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error cleaning up:', error);
});