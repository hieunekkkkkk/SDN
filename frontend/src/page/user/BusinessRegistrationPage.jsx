import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../css/BusinessRegistrationPage.css';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUserId } from '../../utils/useCurrentUserId';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import useGeolocation from '../../utils/useGeolocation';

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState(() => {
    const savedImages = localStorage.getItem('businessImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [stacks, setStacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('businessFormData');
    return savedData
      ? JSON.parse(savedData)
      : {
        businessName: '',
        businessAddress: '',
        businessDescription: '',
        businessType: '',
        businessPhone: '',
        operatingHoursFrom: '',
        operatingHoursTo: '',
      };
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentStack, setPaymentStack] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { location, fetchLocation } = useGeolocation();
  const [paymentError, setPaymentError] = useState(false);

  const userId = getCurrentUserId();

  useEffect(() => {
    const fetchStacks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/stack`);
        setStacks(response.data.stacks || []);
      } catch (err) {
        console.error('Error fetching stacks:', err);
        setError('Không thể tải dữ liệu gói đăng ký.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/category`);
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải dữ liệu loại hình kinh doanh.');
      } finally {
        setLoading(false);
      }
    };

    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/payment/userid/${userId}`);
        const completedPayment = response.data.data.find(payment => payment.payment_status === 'completed');
        setPaymentStatus(completedPayment.payment_status);
        setPaymentStack(completedPayment.payment_stack._id);
      } catch (err) {
        console.error('Error checking payment status:', err);
        setPaymentError(true); // trigger blur
      }
    };


    fetchStacks();
    fetchCategories();
    checkPaymentStatus();

  }, [userId]);


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
      setLoadingPayment(true);
      const selectedStack = stacks.find((stack) => stack._id === stackId);
      if (!selectedStack) {
        alert('Không tìm thấy gói đăng ký.');
        setLoadingPayment(false);
        return;
      }

      const paymentResponse = await axios.post(`${import.meta.env.VITE_BE_URL}/api/payment`, {
        user_id: userId,
        stack_id: stackId,
      });

      if (paymentResponse.data && paymentResponse.data.url) {
        window.open(paymentResponse.data.url, '_blank');
        setLoadingPayment(false);
      } else {
        throw new Error('Thanh toán thất bại.');
      }
    } catch (err) {
      console.error('Error during payment:', err.response ? err.response.data : err.message);
      alert(`Thanh toán thất bại. Vui lòng thử lại. Chi tiết: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentStatus !== 'completed') {
      toast.error('Vui lòng hoàn tất thanh toán trước khi đăng ký.');
      return;
    }

    if (!formData.businessAddress || !formData.businessAddress.trim()) {
      toast.error('Địa chỉ doanh nghiệp là bắt buộc và phải có nội dung.');
      return;
    }

    if (!location) {
      toast.error('Vui lòng lấy vị trí địa lý (kinh độ/vĩ độ) trước khi đăng ký.');
      return;
    }

    try {
      const businessData = {
        owner_id: userId,
        business_name: formData.businessName,
        business_address: formData.businessAddress,
        business_location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude], // [lng, lat]
        },
        business_category_id: formData.businessType,
        business_detail: formData.businessDescription,
        business_time: {
          open: formData.operatingHoursFrom,
          close: formData.operatingHoursTo,
        },
        business_phone: formData.businessPhone,
        business_image: images,
        business_stack_id: paymentStack,
        business_total_vote: 0,
        business_rating: 0,
        business_view: 0,
        business_status: false,
        business_active: 'pending',
      };

      await axios.post(`${import.meta.env.VITE_BE_URL}/api/business`, businessData);

      await axios.put(`${import.meta.env.VITE_BE_URL}/api/user/${userId}`, {
        "publicMetadata": {
          "role": "owner"
        }
      });

      toast.success('Doanh nghiệp đã được tạo thành công và đang chờ phê duyệt.');
      // navigate('/');
      localStorage.removeItem('businessFormData');
      localStorage.removeItem('businessImages');
    } catch (err) {
      console.error('Error creating business:', err.response ? err.response.data : err.message);
      toast.error(`Không thể tạo doanh nghiệp. Chi tiết: ${err.message}`);
    }
  };


  const formatPrice = (price) => {
    if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)}B / tháng`;
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M / tháng`;
    if (price >= 1000) return `${(price / 1000).toFixed(1)}K / tháng`;
    return `${price}/tháng`;
  };

  return (
    <>
      <Header />
      <main className="business-register-container">
        <div className="business-register-intro-card">
          <h2 className="business-register-intro-title">
            Chào mừng các doanh nghiệp đến với hệ thống LocalLink!
          </h2>
          <div className="business-register-intro-section">
            <div className="business-register-intro-text">
              <strong>Chính sách đăng tải nội dung và sản phẩm</strong>
              <ul>
                <li>Chỉ cho phép đăng các sản phẩm và dịch vụ hợp pháp theo quy định pháp luật của Việt Nam.</li>
                <li>Cấm quảng cáo sai sự thật, thông tin gây hiểu lầm hoặc gian lận.</li>
                <li>Không được đăng sản phẩm vi phạm pháp luật như hàng giả, hàng cấm, vũ khí, nội dung nhạy cảm, ...</li>
                <li>Hình ảnh và mô tả sản phẩm phải chính xác, rõ ràng và do doanh nghiệp sở hữu.</li>
              </ul>
              <strong>Chính sách ứng xử của người dùng và doanh nghiệp</strong>
              <ul>
                <li>Cấm hành vi spam, quấy rối, hoặc sử dụng hình thức tiếp thị quá mức gây phiền hà.</li>
                <li>Doanh nghiệp tự chịu trách nhiệm về dịch vụ khách hàng và xử lý khiếu nại.</li>
                <li>Vi phạm nhiều lần có thể bị khóa tài khoản vĩnh viễn.</li>
              </ul>
            </div>
            <div className="business-register-intro-image">
              <img src="/1.png" alt="Product Illustration" />
            </div>
          </div>
        </div>

        <div className="business-register-pricing-plans">
          <h3 className="business-register-plan-title-step">Bước 1</h3>
          <h2 className="business-register-plan-title">Lựa chọn gói đăng ký</h2>
          {loadingPayment ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              opacity: 0.3,
              height: '428px'
            }}>
              <PuffLoader size={90} />
              <p style={{ marginTop: '16px', fontSize: '18px', color: '#333' }}></p>
            </div>
          ) : loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="business-register-plan-options">
              {stacks.map((stack) => (
                <div key={stack._id} className="business-register-plan-card">
                  <h3>{stack.stack_name}</h3>
                  <p>
                    <strong>{formatPrice(stack.stack_price)}</strong>
                  </p>
                  <p>{stack.stack_detail}</p>
                  {paymentStack !== stack._id ? (
                    <button
                      type="button"
                      className="business-register-plan-btn"
                      onClick={() => handlePlanClick(stack._id)}
                    >
                      Chọn gói
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="business-register-plan-btn inactive"
                      onClick={() => handlePlanClick(stack._id)}
                    >
                      Đang dùng
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <h3 className="business-register-plan-title-step">Bước 2</h3>
        <h2 className="business-register-page-title">Điền thông tin doanh nghiệp</h2>
        <form className="business-register-form" onSubmit={handleSubmit}>
          <div className={`business-register-form-wrapper ${paymentError ? 'blurred' : ''}`}>
            <div className="business-register-form-columns">
              <div className="business-register-form-column left">
                <div className="business-register-form-group">
                  <label htmlFor="business-name">Tên doanh nghiệp</label>
                  <input
                    type="text"
                    id="business-name"
                    name="businessName"
                    placeholder="Nhập tên doanh nghiệp..."
                    value={formData.businessName}
                    onChange={handleInputChange}
                    disabled={paymentError}
                    required
                  />
                </div>
                <div className="business-register-form-group">
                  <label htmlFor="business-address">Địa chỉ</label>
                  <input
                    type="text"
                    id="business-address"
                    name="businessAddress"
                    placeholder="Nhập địa chỉ..."
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    disabled={paymentError}
                    required
                  />
                </div>
                <div className="business-register-form-group">
                  <label htmlFor="business-description">Mô tả</label>
                  <textarea
                    id="business-description"
                    name="businessDescription"
                    placeholder="Nhập mô tả..."
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows="6"
                    disabled={paymentError}
                  />
                </div>
                <div className="business-register-form-group">
                  <label htmlFor="business-image">Hình ảnh</label>
                  <div className="business-register-image-upload">
                    {images.map((image, index) => (
                      <div key={index} className="business-register-image-preview">
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            const newImages = [...images];
                            newImages.splice(index, 1);
                            setImages(newImages);
                          }}
                          disabled={paymentError}
                        >
                          ×
                        </button>
                        <img src={image} alt={`Preview ${index + 1}`} />
                      </div>
                    ))}
                    <input
                      type="file"
                      id="add-image-input"
                      className="business-register-add-image-input"
                      accept="image/*"
                      multiple
                      onChange={handleAddImage}
                      disabled={paymentError}
                    />
                    <button
                      type="button"
                      className="business-register-add-image-btn"
                      onClick={() => document.getElementById('add-image-input').click()}
                      disabled={paymentError}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="business-register-form-column right">
                <div className="business-register-form-group">
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
                      disabled={paymentError}
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
                <div className="business-register-form-group">
                  <label htmlFor="geolocate">Kinh độ/Vĩ độ</label>
                  <div className="business-register-geolocate">
                    <input
                      type="text"
                      value={
                        location
                          ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                          : ''
                      }
                      readOnly
                      disabled={paymentError}
                    />
                    <button
                      type="button"
                      className="business-register-geolocate-btn"
                      onClick={fetchLocation}
                      disabled={paymentError}
                    >
                      Lấy Kinh độ/Vĩ độ
                    </button>
                  </div>
                </div>
                <div className="business-register-form-group">
                  <label htmlFor="business-phone">Số điện thoại</label>
                  <input
                    type="number"
                    id="business-phone"
                    name="businessPhone"
                    placeholder="Nhập số điện thoại..."
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    disabled={paymentError}
                    required
                  />
                </div>
                <div className="business-register-form-group">
                  <label htmlFor="operating-hours">Thời gian hoạt động</label>
                  <div className="business-register-operating-hours-inputs">
                    <input
                      type="time"
                      id="operating-hours-from"
                      name="operatingHoursFrom"
                      placeholder="Từ ..."
                      value={formData.operatingHoursFrom}
                      onChange={handleInputChange}
                      disabled={paymentError}
                    />
                    <input
                      type="time"
                      id="operating-hours-to"
                      name="operatingHoursTo"
                      placeholder="Đến ..."
                      value={formData.operatingHoursTo}
                      onChange={handleInputChange}
                      disabled={paymentError}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='business-register-submit-btn-container'>
              <button
                type="submit"
                className="business-register-submit-btn"
                disabled={paymentStatus !== 'completed' || paymentError}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </form>
      </main >
      <Footer />
    </>
  );
};

export default BusinessRegistrationPage;
