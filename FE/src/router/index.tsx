import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';

const LazyLogin = React.lazy(() => import('@/pages/Login'));
const LazyRegistration = React.lazy(() => import('@/pages/Registration'));
const LazyBoard = React.lazy(() => import('@/pages/Board'));

// Компонент для защищенных маршрутов
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Компонент для публичных маршрутов (только для неавторизованных)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/board" replace />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <Loader 
          type="backdrop" 
          loading={true} 
          message="Загружаем приложение..." 
        />
      }>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LazyLogin />
              </PublicRoute>
            } 
          />
          <Route 
            path="/registration" 
            element={
              <PublicRoute>
                <LazyRegistration />
              </PublicRoute>
            } 
          />
          <Route 
            path="/board" 
            element={
              <ProtectedRoute>
                <LazyBoard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;