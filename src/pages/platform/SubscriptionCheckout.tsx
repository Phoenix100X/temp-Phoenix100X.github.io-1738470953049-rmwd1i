import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const billingSchema = z.object({
  client_id: z.string().uuid(),
  card_number: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiry_month: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
  expiry_year: z.string().regex(/^\d{4}$/, 'Invalid year'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
  billing_name: z.string().min(1, 'Name is required'),
  billing_email: z.string().email('Invalid email'),
  billing_address: z.string().min(1, 'Address is required'),
  billing_city: z.string().min(1, 'City is required'),
  billing_state: z.string().min(1, 'State is required'),
  billing_zip: z.string().min(1, 'ZIP code is required'),
  billing_country: z.string().min(1, 'Country is required'),
});

type BillingForm = z.infer<typeof billingSchema>;

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: {
    max_children: number | null;
    max_staff: number | null;
    features: Record<string, boolean>;
  };
}

export function SubscriptionCheckout() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BillingForm>({
    resolver: zodResolver(billingSchema),
  });

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      setPlan(data);
    } catch (err) {
      setError('Failed to load subscription plan');
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BillingForm) => {
    try {
      // In a real implementation, you would:
      // 1. Process payment with a payment provider (e.g., Stripe)
      // 2. Create subscription record
      // 3. Update client subscription status

      const { error: subscriptionError } = await supabase
        .from('client_subscriptions')
        .insert([{
          client_id: data.client_id,
          plan_id: planId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }]);

      if (subscriptionError) throw subscriptionError;

      navigate('/platform/clients');
      alert('Subscription activated successfully!');
    } catch (err) {
      console.error('Error processing subscription:', err);
      setError('Failed to process subscription');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !plan) return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 rounded-lg">
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <p>{error || 'Plan not found'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Subscription</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Plan Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscription</span>
                  <span className="font-medium">${plan.price}/month</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between mt-4 text-lg font-semibold">
                  <span>Total</span>
                  <span>${plan.price}/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Card Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    {...register('card_number')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.card_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.card_number.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Month
                    </label>
                    <input
                      type="text"
                      {...register('expiry_month')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="MM"
                    />
                    {errors.expiry_month && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiry_month.message}</p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <input
                      type="text"
                      {...register('expiry_year')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="YYYY"
                    />
                    {errors.expiry_year && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiry_year.message}</p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      {...register('cvc')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="123"
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Billing Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      {...register('billing_name')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.billing_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.billing_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('billing_email')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.billing_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.billing_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register('billing_address')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.billing_address && (
                      <p className="mt-1 text-sm text-red-600">{errors.billing_address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        {...register('billing_city')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.billing_city && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        {...register('billing_state')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.billing_state && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_state.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        {...register('billing_zip')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.billing_zip && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_zip.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register('billing_country')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.billing_country && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_country.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Complete Subscription
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}