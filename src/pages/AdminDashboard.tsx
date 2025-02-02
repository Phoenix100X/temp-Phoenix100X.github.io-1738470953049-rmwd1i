import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Settings, Users, BarChart, Mail, FileText, Bell } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="users"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Users className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </Link>

        <Link
          to="settings"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Settings className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h2>
          <p className="text-gray-600">Configure system preferences</p>
        </Link>

        <Link
          to="reports"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <BarChart className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h2>
          <p className="text-gray-600">View system analytics and reports</p>
        </Link>

        <Link
          to="marketing"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Mail className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Marketing</h2>
          <p className="text-gray-600">Manage marketing campaigns</p>
        </Link>

        <Link
          to="compliance"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <FileText className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Compliance</h2>
          <p className="text-gray-600">Track regulatory compliance</p>
        </Link>

        <Link
          to="notifications"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Bell className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
          <p className="text-gray-600">Manage system notifications</p>
        </Link>
      </div>

      <Routes>
        <Route path="users" element={<div>Users component to be implemented</div>} />
        <Route path="settings" element={<div>Settings component to be implemented</div>} />
        <Route path="reports" element={<div>Reports component to be implemented</div>} />
        <Route path="marketing" element={<div>Marketing component to be implemented</div>} />
        <Route path="compliance" element={<div>Compliance component to be implemented</div>} />
        <Route path="notifications" element={<div>Notifications component to be implemented</div>} />
      </Routes>
    </div>
  );
}