import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../css/BusinessRegistrationPage.css';
import axios from 'axios';

const BusinessRegistrationPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    'Lựa chọn',
    'Nhà trọ',
    'Quán ăn',
    'Cafe',
    'Supply',
    'Giải trí',
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  const [images, setImages] = useState([]);
  const handleAddImage = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStacks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/stack`
        );
        setStacks(response.data.stacks || []);
      } catch (err) {
        console.error('Error fetching stacks:', err);
        setError('Không thể tải dữ liệu gói đăng ký.');
      } finally {
        setLoading(false);
      }
    };

    fetchStacks();
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000000000)
      return `${(price / 1000000000).toFixed(1)}B / tháng`;
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M / tháng`;
    if (price >= 1000) return `${(price / 1000).toFixed(1)}K / tháng`;
    return `${price}/tháng`;
  };

  return (
    <>
      <Header />
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
                  Chỉ cho phép đăng các sản phẩm và dịch vụ hợp pháp theo quy
                  định pháp luật của Việt Nam.
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
                  {images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image} alt={`Preview ${index + 1}`} />
                    </div>
                  ))}
                  <input
                    type="file"
                    id="add-image-input"
                    className="add-image-input"
                    accept="image/*"
                    multiple
                    onChange={handleAddImage}
                  />
                  <button
                    type="button"
                    className="add-image-btn"
                    onClick={() =>
                      document.getElementById('add-image-input').click()
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="form-column right">
              <div className="form-group">
                <label htmlFor="business-type">Loại hình kinh doanh</label>
                <div className="custom-select">
                  <div
                    className="select-selected"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedOption || 'Lựa chọn'}
                  </div>
                  {isOpen && (
                    <div className="select-items">
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className="select-item"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="business-phone">Số điện thoại</label>
                <input
                  type="number"
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
            {loading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="plan-options">
                {stacks.map((stack) => (
                  <div key={stack._id} className="plan-card">
                    <h3>{stack.stack_name}</h3>
                    <p>
                      <strong>{formatPrice(stack.stack_price)}</strong>
                    </p>
                    <p>{stack.stack_detail}</p>
                    <button className="plan-btn">Chọn gói</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="submit-btn">
            Đăng ký
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default BusinessRegistrationPage;
