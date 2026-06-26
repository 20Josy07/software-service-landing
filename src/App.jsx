import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));

const PageLoader = () => (
  <div className="min-h-screen bg-void flex items-center justify-center">
    <div
      className="w-8 h-8 border-2 border-electric-400 border-t-transparent rounded-full animate-spin"
      aria-label="Cargando"
    />
  </div>
);

const AdminLayout = () => (
  <AuthProvider>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </AuthProvider>
);

const App = () => (
  <ErrorBoundary>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </ErrorBoundary>
);

export default App;
