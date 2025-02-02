import React, { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { usePackages } from '../../hooks/usePackages';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { Database } from '../../lib/database.types';

type CarePackage = Database['public']['Tables']['care_packages']['Row'];

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPackage, setSelectedPackage] = useState<CarePackage | null>(null);
  const { packages, loading, error } = usePackages();

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    return [...Array(7)].map((_, i) => addDays(weekStart, i));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) throw error;

  const PackageCard = ({ pkg }: { pkg: CarePackage }) => (
    <button
      onClick={() => setSelectedPackage(pkg)}
      className={`
        p-4 rounded-lg border transition-colors text-left
        ${selectedPackage?.id === pkg.id
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-blue-600'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
        <Clock className="w-5 h-5 text-blue-600" />
      </div>
      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
      <div className="text-blue-600 font-semibold">
        ${pkg.price} / {pkg.type}
      </div>
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Book Childcare</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">{format(selectedDate, 'MMMM yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            className={`
              p-4 rounded-lg text-center transition-colors
              ${isSameDay(day, selectedDate)
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'}
            `}
          >
            <div className="text-sm mb-1">{format(day, 'EEE')}</div>
            <div className="font-semibold">{format(day, 'd')}</div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Packages</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>

      <button
        disabled={!selectedPackage}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue Booking
      </button>
    </div>
  );
}