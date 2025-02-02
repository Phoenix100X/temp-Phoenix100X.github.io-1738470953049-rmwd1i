import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Calendar, Clock, CreditCard, FileText, MessageSquare, User } from 'lucide-react';
import { Bookings } from './bookings';
import { Children } from './children';

export function ParentPortal() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Parent Portal</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="bookings"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Calendar className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bookings</h2>
          <p className="text-gray-600">Schedule and manage your childcare bookings</p>
        </Link>

        <Link
          to="children"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <User className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Children</h2>
          <p className="text-gray-600">Manage your children's profiles and information</p>
        </Link>

        <Link
          to="billing"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <CreditCard className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing</h2>
          <p className="text-gray-600">View and manage payments and invoices</p>
        </Link>

        <Link
          to="attendance"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Clock className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Attendance</h2>
          <p className="text-gray-600">Track check-in/out and attendance history</p>
        </Link>

        <Link
          to="documents"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <FileText className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Documents</h2>
          <p className="text-gray-600">Access and complete required forms</p>
        </Link>

        <Link
          to="messages"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <MessageSquare className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Messages</h2>
          <p className="text-gray-600">Communicate with facility staff</p>
        </Link>
      </div>

      <Routes>
        <Route path="bookings" element={<Bookings />} />
        <Route path="children" element={<Children />} />
        <Route path="billing" element={<div>Billing component to be implemented</div>} />
        <Route path="attendance" element={<div>Attendance component to be implemented</div>} />
        <Route path="documents" element={<div>Documents component to be implemented</div>} />
        <Route path="messages" element={<div>Messages component to be implemented</div>} />
      </Routes>
    </div>
  );
}