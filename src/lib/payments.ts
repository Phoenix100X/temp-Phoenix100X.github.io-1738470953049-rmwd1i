import { loadStripe } from '@stripe/stripe-js';
import { payments } from '@square/web-sdk';

// Initialize payment providers
export const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');
export const square = await payments(import.meta.env.VITE_SQUARE_APP_ID || '', import.meta.env.VITE_SQUARE_LOCATION_ID || '');

export type PaymentProvider = 'stripe' | 'square';
export type PaymentMethod = 'card' | 'ach';

export async function createPaymentIntent(amount: number, provider: PaymentProvider, method: PaymentMethod) {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, provider, method }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function processPayment(provider: PaymentProvider, method: PaymentMethod, data: any) {
  try {
    switch (provider) {
      case 'stripe':
        if (!stripe) throw new Error('Stripe not initialized');
        if (method === 'ach') {
          return await stripe.confirmAchDebitPayment(data.clientSecret, {
            payment_method: {
              type: 'us_bank_account',
              us_bank_account: {
                account_number: data.accountNumber,
                routing_number: data.routingNumber,
                account_holder_type: 'individual',
                account_holder_name: data.accountName,
              },
            },
          });
        }
        return await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: data.paymentMethod,
        });

      case 'square':
        if (!square) throw new Error('Square not initialized');
        if (method === 'ach') {
          return await processSquareACH(data);
        }
        const card = await square.card();
        await card.attach('#card-container');
        const result = await card.tokenize();
        if (result.status === 'OK') {
          return await processSquarePayment(result.token);
        }
        throw new Error(result.errors?.[0]?.message || 'Payment failed');

      default:
        throw new Error('Invalid payment provider');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}

async function processSquarePayment(token: string) {
  const response = await fetch('/api/process-square-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  return await response.json();
}

async function processSquareACH(data: any) {
  const response = await fetch('/api/process-square-ach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountNumber: data.accountNumber,
      routingNumber: data.routingNumber,
      accountName: data.accountName,
    }),
  });
  return await response.json();
}