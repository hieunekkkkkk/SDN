import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';

import LandingPage from './page/LandingPage';
import LoginPage from './page/LoginPage';
import SignupPage from './page/SignupPage';
import BusinessPage from './page/BusinessPage';
import UserProfilePage from './page/UserProfilePage';
import AuthCallback from './auth/AuthCallback';
import PersonalizedPage from './page/PersonalizedPage';
import DiscoverPage from './page/DiscoverPage';
import DiscoverByCategoryPage from './page/DiscoverByCategoryPage';
import AnimatedLayout from './components/AnimatedLayout';

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
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
