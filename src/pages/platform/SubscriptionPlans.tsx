import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/LoadingSpinner';

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

export function SubscriptionPlans() {
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');

      if (error) throw error;
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="mt-4 text-lg text-gray-600">Choose the perfect plan for your facility</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <p className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>
                    {plan.features.max_children === null
                      ? 'Unlimited children'
                      : `Up to ${plan.features.max_children} children`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>
                    {plan.features.max_staff === null
                      ? 'Unlimited staff'
                      : `Up to ${plan.features.max_staff} staff members`}
                  </span>
                </div>
                {Object.entries(plan.features.features).map(([feature, included]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    {included ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className="capitalize">
                      {feature.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/platform/subscribe/${plan.id}`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}