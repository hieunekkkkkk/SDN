import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../css/BusinessRegistrationPage.css';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUserId } from '../../utils/useCurrentUserId';

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessDescription: '',
    businessType: '',
    businessPhone: '',
    operatingHoursFrom: '',
    operatingHoursTo: '',
  });
  const [paymentStatus, setPaymentStatus] = useState(null);

  const userId = getCurrentUserId();

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

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/category`
        );
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải dữ liệu loại hình kinh doanh.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setPaymentStatus('completed');
      searchParams.delete('payment');
      setSearchParams(searchParams);
    } else if (payment === 'failed') {
      setPaymentStatus('failed');
      searchParams.delete('payment');
      setSearchParams(searchParams);
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/payment/status?user_id=${userId}`
        );
        if (response.data.status === 'completed') {
          setPaymentStatus('completed');
        } else if (response.data.status === 'failed') {
          setPaymentStatus('failed');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [userId, searchParams, setSearchParams]);

  const handleAddImage = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePlanClick = async (stackId) => {
    try {
      const selectedStack = stacks.find((stack) => stack._id === stackId);
      if (!selectedStack) {
        alert('Không tìm thấy gói đăng ký.');
        return;
      }

      const paymentResponse = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/payment`,
        {
          user_id: userId,
          stack_id: stackId,
        }
      );

      console.log(paymentResponse.data);

      if (paymentResponse.data) {
        window.open(paymentResponse.data.url, '_blank');
      } else {
        throw new Error('Thanh toán thất bại.');
      }
    } catch (err) {
      console.error('Error during payment:', err);
      alert('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const businessData = {
        owner_id: userId,
        business_name: formData.businessName,
        business_address: formData.businessAddress,
        business_category_id: formData.businessType,
        business_detail: formData.businessDescription,
        business_phone: formData.businessPhone,
        business_time: {
          open: formData.operatingHoursFrom,
          close: formData.operatingHoursTo,
        },
        business_image: images,
        business_status: false,
      };

      await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/business`,
        businessData
      );

      alert('Doanh nghiệp đã được tạo thành công và đang chờ phê duyệt.');
      navigate('/');
    } catch (err) {
      console.error('Error creating business:', err);
      alert('Không thể tạo doanh nghiệp. Vui lòng thử lại.');
    }
  };

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
        {paymentSuccess && (
          <p className="payment-success-message">Thanh toán thành công!</p>
        )}
        <form className="registration-form">
          <div className="form-columns">
            <div className="form-column left">
              <div className="form-group">
                <label htmlFor="business-name">Tên doanh nghiệp</label>
                <input
                  type="text"
                  id="business-name"
                  name="businessName"
                  placeholder="Nhập ..."
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="business-address">Địa chỉ</label>
                <input
                  type="text"
                  id="business-address"
                  name="businessAddress"
                  placeholder="Nhập ..."
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="business-description">Mô tả</label>
                <textarea
                  type="text"
                  id="business-description"
                  name="businessDescription"
                  placeholder="Nhập ..."
                  value={formData.businessDescription}
                  onChange={handleInputChange}
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
                {loading ? (
                  <p>Đang tải...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <select
                    id="business-type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Lựa chọn...</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="business-phone">Số điện thoại</label>
                <input
                  type="number"
                  id="business-phone"
                  name="businessPhone"
                  placeholder="Nhập ..."
                  value={formData.businessPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="operating-hours">Thời gian hoạt động</label>
                <div className="operating-hours-inputs">
                  <input
                    type="text"
                    id="operating-hours-from"
                    name="operatingHoursFrom"
                    placeholder="Từ ..."
                    value={formData.operatingHoursFrom}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    id="operating-hours-to"
                    name="operatingHoursTo"
                    placeholder="Đến ..."
                    value={formData.operatingHoursTo}
                    onChange={handleInputChange}
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
                    <button
                      type="button"
                      className="plan-btn"
                      onClick={() => handlePlanClick(stack._id)}
                    >
                      Chọn gói
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            Đăng ký
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default BusinessRegistrationPage;
