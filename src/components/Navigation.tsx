import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClient } from '../contexts/ClientContext';
import { Users, LogOut } from 'lucide-react';

export function Navigation() {
  const { user, signOut } = useAuth();
  const { client } = useClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            {client?.branding.logo ? (
              <img 
                src={client.branding.logo} 
                alt={client.name} 
                className="h-8 w-auto"
              />
            ) : (
              <Users className="w-8 h-8 text-blue-600" />
            )}
            <span 
              className="text-xl font-bold"
              style={{ color: client?.branding.primary_color || '#2563eb' }}
            >
              KidCare Connect
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}