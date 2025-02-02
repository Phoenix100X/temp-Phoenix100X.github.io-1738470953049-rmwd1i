import React from 'react';
import { Mail, Phone, Clock } from 'lucide-react';
import { useSupport } from '../hooks/useSupport';
import { LoadingSpinner } from './LoadingSpinner';

interface SupportInfoProps {
  type: 'technical' | 'billing';
}

export function SupportInfo({ type }: SupportInfoProps) {
  const { supportConfig, loading, error } = useSupport();

  if (loading) return <LoadingSpinner />;
  if (error) throw error;

  const config = supportConfig[type];
  if (!config) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Mail className="w-5 h-5 text-gray-400" />
        <a href={`mailto:${config.email}`} className="text-blue-600 hover:text-blue-800">
          {config.email}
        </a>
      </div>
      
      {config.phone && (
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-gray-400" />
          <a href={`tel:${config.phone}`} className="text-blue-600 hover:text-blue-800">
            {config.phone}
          </a>
        </div>
      )}
      
      {config.hours && (
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">{config.hours}</span>
        </div>
      )}
    </div>
  );
}