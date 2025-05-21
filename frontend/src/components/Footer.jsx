// components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="logo1.png" alt=" Logo" className="footer-logo" />
          </div>
          <div>
            <h3 className="footer-title">VỀ REPTIEST</h3>
            <ul className="footer-links">
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Đối tác</a></li>
              <li><a href="#">Tin tức</a></li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">HỖ TRỢ</h3>
            <ul className="footer-links">
              <li><a href="#">Trung tâm hỗ trợ</a></li>
              <li><a href="#">Phương thức thanh toán</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">LIÊN HỆ</h3>
            <p>Số 123, Đường ABC, Quận XYZ, Hà Nội, Việt Nam</p>
            <p>Điện thoại: 0987 654 321</p>
            <p>Email: info@locallink.vn</p>
            <div className="social-icons">
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">YT</a>
              <a href="#" className="social-icon">TW</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© COPYRIGHT 2025 BY LOCALLINK</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;