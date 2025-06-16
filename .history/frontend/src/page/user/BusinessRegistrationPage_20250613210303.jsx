import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../css/BusinessRegistrationPage.css';

const BusinessRegistrationPage = () => {
  return (
    <>
      <main className="business-registration-container">
        <div className="business-intro-card">
          <h2 className="business-intro-title">
            Chào mừng các doanh nghiệp đến với hệ thống Smearch!
          </h2>
          <div className="business-intro-section">
            <div className="business-intro-text">
              <strong>Chính sách đăng tải nội dung và sản phẩm</strong>
              <ul>
                <li>
                  Chỉ cho phép đăng các sản phẩm và dịch vụ hợp pháp theo q định
                  pháp luật của Việt Nam.
                </li>
                <li>
                  Cấm quảng cáo sai sự thật, thông tin gây hiểu lầm hoặc gian
                  lận.
                </li>
                <li>
                  Không được đăng sản phẩm vi phạm pháp luật như hàng giả, hàng
                  cấm, vũ khí, nội dung nhạy cảm, ...
                </li>
                <li>
                  Hình ảnh và mô tả sản phẩm phỉa chính xác, rõ ràng và do doanh
                  nghiệp sở hữu.
                </li>
              </ul>

              <strong>Chính sách ứng xử của người dùng và doanh nghiệp</strong>
              <ul>
                <li>
                  Cấm hành vi spam, quấy rối, hoặc sử dụng hình thức tiếp thị
                  quá mức gây phiền hà.
                </li>
                <li>
                  Doanh nghiệp tự chịu trách nhiệm về dịch vụ khách hàng và xử
                  lý khiếu nại.
                </li>
                <li>Vi phạm nhiều lần có thể bị khóa tìa khoản vĩnh viễn.</li>
              </ul>
            </div>
            <div className="business-intro-image">
              <img src="/1.png" alt="Product Illustration" />
            </div>
          </div>
        </div>

        <h1 className="page-title">Đăng ký doanh nghiệp</h1>
        <form className="registration-form">
          <div className="form-columns">
            <div className="form-column left">
              <div className="form-group">
                <label htmlFor="business-name">Tên doanh nghiệp</label>
                <input
                  type="text"
                  id="business-name"
                  name="business-name"
                  placeholder="Nhập ..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="business-address">Địa chỉ</label>
                <input
                  type="text"
                  id="business-address"
                  name="business-address"
                  placeholder="Nhập ..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="business-description">Mô tả</label>
                <input
                  type="text"
                  id="business-description"
                  name="business-description"
                  placeholder="Nhập ..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="business-image">Hình ảnh</label>
                <div className="image-upload">
                  <div className="image-preview"></div>
                  <div className="image-preview"></div>
                  <button type="button" className="add-image-btn">
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="form-column right">
              <div className="form-group">
                <label htmlFor="business-type">Loại hình kinh doanh</label>
                <select id="business-type" name="business-type" required>
                  <option value="">Lựa chọn...</option>
                  <option value="nhà hàng">Nhà hàng</option>
                  <option value="quán ăn">Quán ăn</option>
                  <option value="cafe">Cafe</option>
                  <option value="supply">Supply</option>
                  <option value="giới thiệu">Giới thiệu</option>
                  <option value="số điện thoại">Số điện thoại</option>
                  <option value="thông tin doanh nghiệp">
                    Thông tin doanh nghiệp
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="business-phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="business-phone"
                  name="business-phone"
                  placeholder="Nhập ..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="operating-hours">Thời gian hoạt động</label>
                <div className="operating-hours-inputs">
                  <input
                    type="text"
                    id="operating-hours-from"
                    name="operating-hours-from"
                    placeholder="Từ ..."
                  />
                  <input
                    type="text"
                    id="operating-hours-to"
                    name="operating-hours-to"
                    placeholder="Đến ..."
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pricing-plans">
            <h2 className="plan-title">Lựa chọn gói đăng ký</h2>
            <div className="plan-options">
              <div className="plan-card">
                <h3>Free</h3>
                <p>
                  <strong>$0/mo</strong>
                </p>
                <ul>
                  <li>✔ Voice messages anywhere</li>
                  <li>✔ Voice messages anywhere</li>
                  <li>✔ Voice messages anywhere</li>
                </ul>
                <button className="plan-btn">Already using</button>
              </div>
              <div className="plan-card">
                <h3>Premium</h3>
                <p>
                  <strong>100 triệu/tháng</strong>
                </p>
                <ul>
                  <li>✔ Voice messages anywhere</li>
                  <li>✔ Voice messages anywhere</li>
                  <li>✔ Voice messages anywhere</li>
                </ul>
                <button className="plan-btn">Buy now</button>
              </div>
              <div className="plan-card">
                <h3>Super vip</h3>
                <p>
                  <strong>1 tỷ/tháng</strong>
                </p>
                <ul>
                  <li>✔ Voice messages anywhere</li>
                  <li>✔ Voice messages anywhere</li>
                  <li>✔ Voice messages anywhere</li>
                </ul>
                <button className="plan-btn">Buy now</button>
              </div>
            </div>
          </div>
          <button type="button" className="submit-btn">
            Đăng ký
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default BusinessRegistrationPage;
