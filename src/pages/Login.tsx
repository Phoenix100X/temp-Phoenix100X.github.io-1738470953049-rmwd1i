import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import type { AuthError } from '@supabase/supabase-js';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error: authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setError: setFormError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const message = location.state?.message;

  const handleAuthError = (err: unknown) => {
    if (err && typeof err === 'object' && '__isAuthError' in err) {
      const authErr = err as AuthError;
      switch (authErr.status) {
        case 400:
          if (authErr.message.includes('Invalid login credentials')) {
            setLoginError('Invalid email or password. Please check your credentials and try again.');
            setFormError('password', { message: 'Invalid password' });
          } else if (authErr.message.includes('Email not confirmed')) {
            setLoginError('Please verify your email address before signing in. Check your inbox for the verification link.');
          } else {
            setLoginError(authErr.message);
          }
          break;
        case 429:
          setLoginError('Too many login attempts. Please try again later.');
          break;
        default:
          setLoginError('An error occurred during sign in. Please try again.');
      }
    } else {
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setLoginError(null);
      clearError();

      await signIn(data.email, data.password);
      
      // Get the redirect path from location state or default to '/'
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <LogIn className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to your KidCare Connect account</p>
      </div>

      {message && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">{message}</p>
        </div>
      )}

      {(authError || loginError) && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Sign in failed</h3>
            <p className="text-sm text-red-700 mt-1">
              {loginError || authError?.message}
            </p>
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
            autoComplete="email"
            autoFocus
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
            placeholder="Enter your password"
            disabled={isLoading}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register here
          </Link>
        </p>
        <p>
          <Link to="/reset-password" className="text-blue-600 hover:text-blue-700 text-sm">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}