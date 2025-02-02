import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, CheckCircle, Calendar, MessageSquare } from 'lucide-react';

export function Dashboard() {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // If authenticated, redirect to appropriate portal based on role
  if (user && profile) {
    switch (profile.role) {
      case 'parent':
        return <Navigate to="/parent" replace />;
      case 'staff':
        return <Navigate to="/facility" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
    }
  }

  const handleGetStarted = () => {
    navigate('/register');
  };

  // Show welcome page for unauthenticated users
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Users className="w-20 h-20 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to KidCare Connect
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The complete childcare management solution for modern families and facilities
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
          <Link
            to="/login"
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mb-16">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Easy Scheduling</h2>
          <p className="text-gray-600">
            Book and manage childcare sessions with our intuitive scheduling system
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Safe & Secure</h2>
          <p className="text-gray-600">
            Rest easy with our secure check-in/out system and real-time updates
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MessageSquare className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Stay Connected</h2>
          <p className="text-gray-600">
            Direct communication between parents and staff for peace of mind
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to transform your childcare experience?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of families and facilities already using KidCare Connect
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
}