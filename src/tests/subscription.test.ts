import { describe, test, expect } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Subscription System Tests', () => {
  test('Package Selection', async () => {
    const { data: packages, error } = await supabase
      .from('subscription_plans')
      .select('*');
    
    expect(error).toBeNull();
    expect(packages).toBeDefined();
    expect(packages?.length).toBeGreaterThan(0);
    
    // Verify package structure
    const basicPlan = packages?.find(p => p.name === 'Basic');
    expect(basicPlan).toBeDefined();
    expect(basicPlan?.price).toBe(49.99);
  });

  test('Subscription Creation', async () => {
    const testClientId = 'test-client-id';
    const testPlanId = 'test-plan-id';
    
    const { error } = await supabase
      .from('client_subscriptions')
      .insert({
        client_id: testClientId,
        plan_id: testPlanId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

    expect(error).toBeNull();
  });
});