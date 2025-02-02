import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['parent', 'staff', 'admin']).default('parent'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const { signUp, error: authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'parent'
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setRegistrationError(null);
      setRegistrationSuccess(false);
      clearError();
      console.log('Starting registration for:', data.email);

      await signUp(data.email, data.password, data.role);
      
      setRegistrationSuccess(true);
      
      // Wait 5 seconds before redirecting to login
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Please check your email to verify your account before signing in.' 
          }
        });
      }, 5000);
      
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error && err.message.includes('already registered')) {
        setRegistrationError('This email is already registered. Please sign in instead.');
      } else {
        setRegistrationError(
          err instanceof Error 
            ? err.message 
            : 'Failed to create account. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="max-w-md mx-auto px-4">
        <div className="bg-green-50 p-8 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-4">Registration Successful!</h2>
          <p className="text-green-700 mb-4">
            Please check your email to verify your account. You will be redirected to the login page in a few seconds.
          </p>
          <div className="animate-pulse">
            <div className="h-1 w-full bg-green-200 rounded">
              <div className="h-1 bg-green-600 rounded" style={{ width: '100%', transition: 'width 5s linear' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
        <p className="text-gray-600 mt-2">Join KidCare Connect to get started</p>
      </div>

      {(authError || registrationError) && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Registration failed</h3>
            <p className="text-sm text-red-700 mt-1">
              {registrationError || authError?.message}
            </p>
            {registrationError?.includes('already registered') && (
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
                Click here to sign in
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Create a password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            {...register('role')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="parent">Parent</option>
            <option value="staff">Staff</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}