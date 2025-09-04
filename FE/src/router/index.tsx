import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const LazyLogin = React.lazy(() => import('../pages/Login'));
const LazyRegistration = React.lazy(() => import('../pages/Registration'));
const LazyBoard = React.lazy(() => import('../pages/Board'));


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LazyLogin />} />
        <Route path="/registration" element={<LazyRegistration />} />
        <Route path="/board" element={<LazyBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;