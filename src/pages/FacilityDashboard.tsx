import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Calendar, Users, ClipboardList, Package, AlertTriangle, BarChart } from 'lucide-react';

export function FacilityDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Facility Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="schedule"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Calendar className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Schedule</h2>
          <p className="text-gray-600">View and manage daily schedules</p>
        </Link>

        <Link
          to="staff"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Users className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Staff</h2>
          <p className="text-gray-600">Manage staff schedules and assignments</p>
        </Link>

        <Link
          to="attendance"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ClipboardList className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Attendance</h2>
          <p className="text-gray-600">Track children and staff attendance</p>
        </Link>

        <Link
          to="inventory"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Package className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Inventory</h2>
          <p className="text-gray-600">Manage supplies and equipment</p>
        </Link>

        <Link
          to="incidents"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <AlertTriangle className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Incidents</h2>
          <p className="text-gray-600">Record and manage incidents</p>
        </Link>

        <Link
          to="reports"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <BarChart className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Reports</h2>
          <p className="text-gray-600">Generate and view facility reports</p>
        </Link>
      </div>

      <Routes>
        <Route path="schedule" element={<div>Schedule component to be implemented</div>} />
        <Route path="staff" element={<div>Staff component to be implemented</div>} />
        <Route path="attendance" element={<div>Attendance component to be implemented</div>} />
        <Route path="inventory" element={<div>Inventory component to be implemented</div>} />
        <Route path="incidents" element={<div>Incidents component to be implemented</div>} />
        <Route path="reports" element={<div>Reports component to be implemented</div>} />
      </Routes>
    </div>
  );
}