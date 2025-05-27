// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import LandingPage from './page/LandingPage';
import LoginPage from './page/LoginPage';
import SignupPage from './page/SignupPage';
import BusinessPage from './page/BusinessPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/business" element={<BusinessPage />} />
        {/* Các route khác có thể thêm sau */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;