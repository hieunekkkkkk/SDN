import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../css/BusinessRegistrationPage.css';

const BusinessRegistrationPage = () => {
  return (
    <>
      <Header />
      <main className="business-registration-container">
        <section className="intro-section">
          <div className="intro-text">
            <h1>Chào mừng các doanh nghiệp đến với hệ thống Smearch!</h1>
            <ul>
              <li>Chỉ đăng tải các sản phẩm hợp pháp.</li>
              <li>Thông tin sản phẩm phải chính xác và rõ ràng.</li>
              <li>Doanh nghiệp chịu trách nhiệm về dịch vụ khách hàng.</li>
            </ul>
          </div>
          <div className="intro-image">
            <img src="/public/1.png" alt="Smearch Intro" />
          </div>
        </section>

        <section className="registration-form-section">
          <h2>Đăng ký doanh nghiệp</h2>
          <form className="registration-form">
            <div className="form-group">
              <label htmlFor="business-name">Tên doanh nghiệp:</label>
              <input
                type="text"
                id="business-name"
                name="business-name"
                placeholder="Nhập tên doanh nghiệp"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="business-category">Loại hình kinh doanh:</label>
              <select id="business-category" name="business-category" required>
                <option value="">Chọn loại hình</option>
                <option value="food">Nhà hàng</option>
                <option value="hotel">Khách sạn</option>
                <option value="retail">Bán lẻ</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="business-address">Địa chỉ:</label>
              <input
                type="text"
                id="business-address"
                name="business-address"
                placeholder="Nhập địa chỉ"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="business-image">Hình ảnh:</label>
              <input
                type="file"
                id="business-image"
                name="business-image"
                accept="image/*"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Đăng ký
            </button>
          </form>
        </section>

        <section className="pricing-section">
          <h2>Lựa chọn gói đăng ký</h2>
          <div className="pricing-options">
            <div className="pricing-card">
              <h3>Free</h3>
              <p>$0/mo</p>
              <button className="pricing-btn">Already using</button>
            </div>
            <div className="pricing-card">
              <h3>Premium</h3>
              <p>100 triệu/tháng</p>
              <button className="pricing-btn">Buy now</button>
            </div>
            <div className="pricing-card">
              <h3>Super VIP</h3>
              <p>1 tỷ/tháng</p>
              <button className="pricing-btn">Buy now</button>
            </div>
          </div>
          <button className="submit-btn">Đăng ký</button>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BusinessRegistrationPage;
