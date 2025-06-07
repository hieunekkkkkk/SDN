import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import '../css/Header.css';
import AuthTokenReset from '../auth/AuthTokenReset';
import { GrUserAdmin } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef(null);


  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <img src="/Logo_FPT_Education.png" alt="FPT Education Logo" className="header-logo" />
          </Link>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="header-nav-link">Trang chủ</Link>
          <Link to="/discover" className="header-nav-link">Khám phá</Link>
          <Link to="/personalized" className="header-nav-link">Cá nhân hóa</Link>
          <Link to="/my-business" className="header-nav-link">Doanh nghiệp của tôi</Link>
        </nav>
        <SignedOut>
          <AuthTokenReset />
          <div
            className="account-menu-wrapper"
            ref={accountRef}
            onClick={() => setShowAccountMenu((prev) => !prev)}
          >
            <FaUserCircle size={20} />
            <span>Tài khoản</span>
            {showAccountMenu && (
              <ul className="account-dropdown">
                <li><Link to="/login">Đăng nhập</Link></li>
                <li><Link to="/signup">Đăng ký</Link></li>
              </ul>
            )}
          </div>
        </SignedOut>
        <SignedIn>
          <div className="header-user-info">
            <UserButton userProfileUrl="/user-profile">
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Quản trị hệ thống"
                  labelIcon={<GrUserAdmin />}
                  onClick={() => navigate('/admin')}
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </SignedIn>
        {/* <button
          className="header-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button> */}
      </div>
    </header>
  );
};

export default Header;