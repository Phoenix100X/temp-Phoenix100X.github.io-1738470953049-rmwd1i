import React, { useState } from 'react';
import { User, Calendar, AlertCircle, Plus } from 'lucide-react';
import { useChildren } from '../../hooks/useChildren';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { Database } from '../../lib/database.types';

type Child = Database['public']['Tables']['children']['Row'];

export function ChildrenList() {
  const { children, loading, error } = useChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) throw error;

  const ChildCard = ({ child }: { child: Child }) => (
    <div 
      className="bg-white rounded-lg shadow p-6 transition-shadow hover:shadow-md"
      onClick={() => setSelectedChild(child)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {child.first_name} {child.last_name}
            </h3>
            <p className="text-sm text-gray-600">
              Born {new Date(child.date_of_birth).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Show medical info modal
          }}
        >
          <AlertCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="border-t pt-4">
        <button 
          className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Navigate to schedule
          }}
        >
          <Calendar className="w-5 h-5" />
          <span>View Schedule</span>
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Children Added</h3>
      <p className="text-gray-600 mb-6">Add your children to start managing their care</p>
      <button 
        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => {/* Open add child modal */}}
      >
        <Plus className="w-5 h-5" />
        <span>Add Your First Child</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Your Children</h2>
          <p className="text-gray-600 mt-1">
            {children.length} {children.length === 1 ? 'child' : 'children'} registered
          </p>
        </div>
        {children.length > 0 && (
          <button 
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {/* Open add child modal */}}
          >
            <Plus className="w-5 h-5" />
            <span>Add Child</span>
          </button>
        )}
      </div>

      {children.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}