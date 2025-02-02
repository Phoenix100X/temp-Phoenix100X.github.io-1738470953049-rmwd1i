import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { ParentPortal } from './pages/ParentPortal';
import { FacilityDashboard } from './pages/FacilityDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ClientProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route element={<AuthMiddleware />}>
                  {/* Parent Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
                    <Route path="/parent/*" element={<ParentPortal />} />
                  </Route>
                  
                  {/* Staff/Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
                    <Route path="/facility/*" element={<FacilityDashboard />} />
                  </Route>
                  
                  {/* Admin Only Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/*" element={<AdminDashboard />} />
                  </Route>
                </Route>

                {/* Catch all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}