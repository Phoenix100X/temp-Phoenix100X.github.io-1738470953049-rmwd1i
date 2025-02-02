import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupport } from '../../hooks/useSupport';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const supportConfigSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  hours: z.string().optional(),
  additional_info: z.record(z.any()).optional()
});

type SupportConfigForm = z.infer<typeof supportConfigSchema>;

export function SupportConfig() {
  const { supportConfig, loading, error, updateSupportConfig } = useSupport();
  const [activeType, setActiveType] = React.useState<'technical' | 'billing'>('technical');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupportConfigForm>({
    resolver: zodResolver(supportConfigSchema),
    defaultValues: supportConfig[activeType]
  });

  React.useEffect(() => {
    if (supportConfig[activeType]) {
      reset(supportConfig[activeType]);
    }
  }, [activeType, supportConfig]);

  const onSubmit = async (data: SupportConfigForm) => {
    try {
      await updateSupportConfig(activeType, data);
      alert('Support configuration updated successfully');
    } catch (err) {
      console.error('Error updating support config:', err);
      alert('Failed to update support configuration');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) throw error;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Configuration</h1>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveType('technical')}
              className={`px-4 py-2 rounded-md ${
                activeType === 'technical'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Technical Support
            </button>
            <button
              onClick={() => setActiveType('billing')}
              className={`px-4 py-2 rounded-md ${
                activeType === 'billing'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Billing Support
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              {...register('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Hours
            </label>
            <input
              type="text"
              {...register('hours')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Mon-Fri, 9 AM - 5 PM EST"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
}