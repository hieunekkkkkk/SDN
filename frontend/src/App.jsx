// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import LandingPage from './page/LandingPage';
import LoginPage from './page/LoginPage';
import SignupPage from './page/SignupPage';
import BusinessPage from './page/BusinessPage';
import UserProfilePage from './page/UserProfilePage';
import AuthCallback from './components/AuthCallback';
import PersonalizedPage from './page/PersonalizedPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/user-profile/*" element={<UserProfilePage />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/personalized" element={<PersonalizedPage />} />

        {/* Các route khác có thể thêm sau */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;