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

import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="grocery" element={<Grocery />} />
            <Route path="ai-controls" element={<AIControls />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
