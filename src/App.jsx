import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Recipes from './pages/Recipes';
import Inventory from './pages/Inventory';
import Grocery from './pages/Grocery';
import AIControls from './pages/AIControls';
import Settings from './pages/Settings';
import Database from './pages/Database';
import Login from './pages/Login';

import { UserProvider } from './context/UserContext';
import { InventoryProvider } from './context/InventoryContext';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <InventoryProvider>
          <UIProvider>
            <BrowserRouter basename="/Ai-web">
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route
                    path="users"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'manager']}>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="recipes" element={<Recipes />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="grocery" element={<Grocery />} />
                  <Route
                    path="ai-controls"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'manager']}>
                        <AIControls />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="settings" element={<Settings />} />
                  <Route
                    path="database"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Database />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </UIProvider>
        </InventoryProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
