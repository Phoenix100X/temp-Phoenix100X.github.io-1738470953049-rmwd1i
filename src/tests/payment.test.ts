import { describe, test, expect, beforeEach } from 'vitest';
import { supabase } from '../lib/supabase';
import Decimal from 'decimal.js';

describe('Payment System Tests', () => {
  const testClient = {
    id: 'test-client-id'
  };

  beforeEach(async () => {
    // Clean up test data
    await supabase.from('payments').delete().eq('client_id', testClient.id);
  });

  test('Process Full Payment', async () => {
    const payment = {
      client_id: testClient.id,
      amount: new Decimal('199.99').toNumber(),
      status: 'completed',
      payment_method: 'credit_card',
      transaction_id: 'test-transaction-1'
    };

    const { error } = await supabase
      .from('payments')
      .insert(payment);

    expect(error).toBeNull();
  });

  test('Process Partial Refund', async () => {
    // Original payment
    const originalAmount = new Decimal('199.99');
    const originalPayment = {
      client_id: testClient.id,
      amount: originalAmount.toNumber(),
      status: 'completed',
      payment_method: 'credit_card',
      transaction_id: 'test-transaction-2'
    };

    await supabase
      .from('payments')
      .insert(originalPayment);

    // Calculate partial refund (40%)
    const refundPercentage = new Decimal('0.4');
    const refundAmount = originalAmount.mul(refundPercentage);

    const refund = {
      client_id: testClient.id,
      amount: refundAmount.negated().toNumber(), // Store as negative amount
      status: 'completed',
      payment_method: 'refund',
      transaction_id: 'test-refund-1',
      reference_transaction: 'test-transaction-2'
    };

    const { error } = await supabase
      .from('payments')
      .insert(refund);

    expect(error).toBeNull();

    // Verify the refund amount is correct
    const { data } = await supabase
      .from('payments')
      .select('amount')
      .eq('transaction_id', 'test-refund-1')
      .single();

    const expectedRefund = new Decimal('199.99').mul('-0.4').toNumber();
    expect(data.amount).toBe(expectedRefund);
  });

  test('Process Failed Payment', async () => {
    const failedPayment = {
      client_id: testClient.id,
      amount: new Decimal('199.99').toNumber(),
      status: 'failed',
      payment_method: 'credit_card',
      transaction_id: 'test-transaction-3',
      error_message: 'Card declined'
    };

    const { error } = await supabase
      .from('payments')
      .insert(failedPayment);

    expect(error).toBeNull();
  });

  test('Payment Validation', async () => {
    const invalidPayment = {
      client_id: testClient.id,
      amount: new Decimal('-50').toNumber(), // Negative amount not allowed for regular payments
      status: 'completed',
      payment_method: 'credit_card',
      transaction_id: 'test-transaction-4'
    };

    const { error } = await supabase
      .from('payments')
      .insert(invalidPayment);

    expect(error).not.toBeNull();
  });
});