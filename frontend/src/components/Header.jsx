import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react'
import '../css/Header.css';
import { useUser, useAuth } from '@clerk/clerk-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef(null);
  
  //clear jwt
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      if(isSignedIn){
        const token = await getToken({ template: 'node-backend' });
        console.log("JWT: ", token);
      }
    };
    fetchToken();
  }, [isSignedIn, getToken]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <img src="/Logo_FPT_Education.png" alt="FPT Education Logo" className="header-logo" />
          </Link>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="header-nav-link">Home</Link>
          <Link to="/food" className="header-nav-link">Food</Link>
          <Link to="/destination" className="header-nav-link">Destination</Link>
          <Link to="/pages" className="header-nav-link">Pages</Link>
        </nav>
        <SignedOut>
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
                <li><Link to="/logout">Đăng xuất</Link></li>
                <li><Link to="/signup">Đăng ký</Link></li>
              </ul>
            )}
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
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