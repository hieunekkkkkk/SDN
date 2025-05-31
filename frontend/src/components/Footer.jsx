import React, { useState } from 'react';
import '../css/Footer.css';
import { FaFacebookF, FaInstagram, FaGoogle } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <h3>Speak to our expert at...</h3>
              <div className="contact-info">
              </div>
            </div>

            <div className="footer-right">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Google"
                >
                  <FaGoogle />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h4>Contact</h4>
              <ul className="footer-links">
                <li>Truong dai hoc FPT, Thach Hoa, Thach That, Thanh pho Ha Noi</li>
                <li>Locallink@gmail.com</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Travel Guides</a></li>
                <li><a href="#">Data Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Legal</a></li>
                <li><a href="#">Sitemap</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <ul className="footer-links">
                <li><a href="#">Get in Touch</a></li>
                <li><a href="#">Help center</a></li>
                <li><a href="#">Live chat</a></li>
                <li><a href="#">How it works</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Newsletter</h4>
              <p>Subscribe to the free newsletter and stay up to date</p>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Send
                </button>
              </form>
              <div className="payment-methods">
                <img src="/visa.png" alt="Visa" />
                <img src="/mastercard.png" alt="Mastercard" />
                <img src="/paypal.png" alt="PayPal" />
                <img src="/amex.png" alt="American Express" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>© Copyright LocalLink 2024</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookies Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;