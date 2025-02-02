import { describe, test, expect, beforeEach } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Authentication System Tests', () => {
  const testUsers = {
    parent: {
      email: 'test.parent@example.com',
      password: 'testPassword123'
    },
    admin: {
      email: 'admin@adminvsa.com',
      password: 'adminPassword123'
    }
  };

  beforeEach(async () => {
    await supabase.auth.signOut();
  });

  test('User Registration - Parent', async () => {
    const { data: parentData, error: parentError } = await supabase.auth.signUp(testUsers.parent);
    expect(parentError).toBeNull();
    expect(parentData.user).toBeDefined();
    expect(parentData.user?.email).toBe(testUsers.parent.email);
  });

  test('User Registration - Admin', async () => {
    const { data: adminData, error: adminError } = await supabase.auth.signUp(testUsers.admin);
    expect(adminError).toBeNull();
    expect(adminData.user).toBeDefined();
    expect(adminData.user?.email).toBe(testUsers.admin.email);
  });

  test('Super User Detection', async () => {
    const { data: adminData } = await supabase.auth.signInWithPassword(testUsers.admin);
    expect(adminData.user?.email?.endsWith('@adminvsa.com')).toBe(true);
  });

  test('Authentication State Management', async () => {
    // Test sign in
    const { error: signInError } = await supabase.auth.signInWithPassword(testUsers.parent);
    expect(signInError).toBeNull();

    // Verify session exists
    const { data: { session } } = await supabase.auth.getSession();
    expect(session).not.toBeNull();
    expect(session?.user?.email).toBe(testUsers.parent.email);

    // Test sign out
    const { error: signOutError } = await supabase.auth.signOut();
    expect(signOutError).toBeNull();

    // Verify session is cleared
    const { data: { session: clearedSession } } = await supabase.auth.getSession();
    expect(clearedSession).toBeNull();
  });

  test('Profile Creation on Registration', async () => {
    // Register new user
    const { data: { user } } = await supabase.auth.signUp(testUsers.parent);
    expect(user).not.toBeNull();

    // Check profile creation
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    expect(profileError).toBeNull();
    expect(profile).not.toBeNull();
    expect(profile?.role).toBe('parent');
  });

  test('Role-based Access Control', async () => {
    // Sign in as admin
    await supabase.auth.signInWithPassword(testUsers.admin);
    
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', testUsers.admin.email)
      .single();

    expect(adminProfile?.role).toBe('admin');

    // Verify admin access to protected resources
    const { error: accessError } = await supabase
      .from('clients')
      .select('*');

    expect(accessError).toBeNull();
  });
});