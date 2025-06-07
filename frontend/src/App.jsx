import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import "@fontsource/montserrat";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';

import LandingPage from './page/user/LandingPage';
import LoginPage from './page/user/LoginPage';
import SignupPage from './page/user/SignupPage';
import BusinessPage from './page/user/BusinessPage';
import UserProfilePage from './page/user/UserProfilePage';
import AuthCallback from './auth/AuthCallback';
import PersonalizedPage from './page/user/PersonalizedPage';
import DiscoverPage from './page/user/DiscoverPage';
import DiscoverByCategoryPage from './page/user/DiscoverByCategoryPage';
import AnimatedLayout from './components/AnimatedLayout';
import MyBusinessPage from './page/user/MyBusinessPage';
import BusinessRegistrationPage from './page/user/BusinessRegistrationPage';
import ManageUserPage from './page/admin/ManageUserPage';
import ManageBusinessPage from './page/admin/ManageBusinessPage';
import ManageTransactionPage from './page/admin/ManageTransactionPage'; 

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AnimatedLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/user-profile/*" element={<UserProfilePage />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/personalized" element={<PersonalizedPage />} />
          <Route path="/discover/" element={<DiscoverPage />} />
          <Route path="/discover/:category" element={<DiscoverByCategoryPage />} />
          <Route path="/my-business" element={<MyBusinessPage />} />
          <Route path="/business-registration" element={<BusinessRegistrationPage />} />
          <Route path="/admin/users" element={<ManageUserPage />} />
          <Route path="/admin/businesses" element={<ManageBusinessPage />} />
          <Route path="/admin/transactions" element={<ManageTransactionPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;