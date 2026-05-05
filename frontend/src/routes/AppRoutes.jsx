import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RegisterUser from './RegisterUser';
import LoginUser from './LoginUser';
import Home from '../pages/generals/Home';
import Saved from '../pages/generals/Saved';
import FoodPartnerLogin from './RegisterPartner';
import LoginPartner from './LoginPartner';
import Profile from '../pages/food-Partner/Profile';
import AuthNav from '../components/AuthNav';
import CreateFood from '../pages/food-Partner/CreateFood';
import ProtectedRoute from "../components/ProtectedRoute"

function AppShell() {
  const location = useLocation();

  return (
    <>
      <AuthNav key={location.pathname} />
      <Routes>
        <Route path="/user/register" element={<RegisterUser />} />
        <Route path="/user/login" element={<LoginUser />} />
        <Route path="/home" element={<Home />} />
        <Route path="/saved" element={<ProtectedRoute allowedRole="user" redirectTo="/user/login"><Saved /></ProtectedRoute>} />
        <Route path="/food-partner/:id" element={<Profile key={location.pathname} />} />
        <Route path="/food-partner/register" element={<FoodPartnerLogin />} />
        <Route path="/food-partner/login" element={<LoginPartner />} />
        <Route path="/create-food" element={<ProtectedRoute allowedRole="foodPartner" redirectTo="/food-partner/login"><CreateFood /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/user/register" replace />} />
      </Routes>
    </>
  );
}

const AppRoutes = () => {
  return (
    <Router>
      <AppShell />
    </Router>
  );
};

export default AppRoutes;
