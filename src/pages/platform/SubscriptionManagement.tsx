import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Clock, AlertTriangle, FileText, BarChart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { format } from 'date-fns';

interface Subscription {
  id: string;
  status: 'active' | 'past_due' | 'canceled';
  current_period_start: string;
  current_period_end: string;
  plan: {
    name: string;
    price: number;
  };
}

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'void';
  created_at: string;
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data: subData, error: subError } = await supabase
        .from('client_subscriptions')
        .select(`
          id,
          status,
          current_period_start,
          current_period_end,
          subscription_plans (
            name,
            price
          )
        `)
        .single();

      if (subError) throw subError;
      setSubscription(subData);

      // Fetch invoices
      const { data: invData, error: invError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invError) throw invError;
      setInvoices(invData);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Management</h1>

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
            </div>
            {subscription?.status === 'active' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Active
              </span>
            )}
            {subscription?.status === 'past_due' && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                Past Due
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{subscription?.plan.name}</h3>
              <p className="text-2xl font-bold text-gray-900">
                ${subscription?.plan.price}/month
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Clock className="w-5 h-5" />
                <span>Current Period</span>
              </div>
              <p className="text-sm text-gray-600">
                {subscription && `${format(new Date(subscription.current_period_start), 'MMM d, yyyy')} - ${format(new Date(subscription.current_period_end), 'MMM d, yyyy')}`}
              </p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate('/platform/plans')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Change Plan
            </button>
            <button
              onClick={() => {/* Handle cancellation */}}
              className="border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <BarChart className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage</h3>
          <p className="text-3xl font-bold text-blue-600">85%</p>
          <p className="text-sm text-gray-600 mt-1">of allowed capacity</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Billing</h3>
          <p className="text-3xl font-bold text-blue-600">
            {subscription && format(new Date(subscription.current_period_end), 'MMM d')}
          </p>
          <p className="text-sm text-gray-600 mt-1">Auto-renewal date</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <AlertTriangle className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Alerts</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-600 mt-1">Active warnings</p>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="py-4">
                      {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4">${invoice.amount}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'void'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => {/* Download invoice */}}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}