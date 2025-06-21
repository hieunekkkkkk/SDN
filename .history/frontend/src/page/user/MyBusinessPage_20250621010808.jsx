import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const MyBusinessPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) {
        setError('Người dùng chưa đăng nhập.');
        setLoading(false);
        return;
      }

      const userId = user.id; // Lấy user_id từ Clerk

      try {
        setLoading(true);
        setError(null);

        // Bước 1: Lấy toàn bộ danh sách doanh nghiệp
        const businessesResponse = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/business`
        );
        const businesses = businessesResponse.data;

        if (!businesses || businesses.length === 0) {
          setError('Không tìm thấy doanh nghiệp nào.');
          setLoading(false);
          return;
        }

        // Bước 2: Filter doanh nghiệp theo owner_id
        const userBusiness = businesses.find((b) => b.owner_id === userId);
        if (!userBusiness) {
          setError('Không tìm thấy doanh nghiệp nào cho user này.');
          setLoading(false);
          return;
        }

        const businessId = userBusiness._id;

        // Bước 3: Lấy chi tiết doanh nghiệp, sản phẩm và phản hồi
        const results = await Promise.allSettled([
          axios.get(
            `${import.meta.env.VITE_BE_URL}/api/business/${businessId}`
          ),
          axios.get(
            `${import.meta.env.VITE_BE_URL}/api/product/business/${businessId}`
          ),
          axios.get(
            `${import.meta.env.VITE_BE_URL}/api/feedback/business/${businessId}`
          ),
        ]);

        const [businessResult, productsResult, feedbacksResult] = results;

        if (businessResult.status === 'fulfilled') {
          setBusiness(businessResult.value.data);
        } else {
          throw new Error('Không thể tải thông tin doanh nghiệp');
        }

        if (productsResult.status === 'fulfilled') {
          setProducts(productsResult.value.data?.products || []);
        } else {
          console.warn('Could not load products:', productsResult.reason);
          setProducts([]);
        }

        if (feedbacksResult.status === 'fulfilled') {
          setFeedbacks(feedbacksResult.value.data?.data || []);
        } else {
          console.warn('Could not load feedbacks:', feedbacksResult.reason);
          setFeedbacks([]);
        }
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError(err.message || 'Không thể tải dữ liệu doanh nghiệp');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  if (loading) return <div>Đang tải...</div>;
  if (error) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Lỗi: {error}</h2>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#ccc',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            Quay lại
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Hiển thị dữ liệu động
  return (
    <>
      <Header />
      <section className="business-detail-section">
        <div className="business-detail">
          <div className="business-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
              <span className="back-icon">←</span> Quay Lại
            </button>
            <div className="business-content">
              <div className="business-images">
                <div className="main-image">
                  <img
                    src={business.business_image?.[0] || '1.png'}
                    alt={`${business.business_name} main`}
                    className="main-img"
                  />
                </div>
                {/* Thumbnails nếu có */}
              </div>
              <div className="business-info">
                <h1 className="business-title">{business.business_name}</h1>
                <p className="business-description">
                  {business.business_detail || 'Không có mô tả'}
                </p>
                <div className="rating-section">
                  <span className="rating-count">
                    {business.business_total_vote || 0} Đánh giá
                  </span>
                </div>
                {/* Thêm các trường khác như status, location, v.v. */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Hiển thị products */}
      <section className="product-section">
        <h2>Sản phẩm</h2>
        {products.length > 0 ? (
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                <img
                  src={product.product_image?.[0] || 'default.png'}
                  alt={product.product_name}
                />
                <h3>{product.product_name}</h3>
                <p>Giá: {product.stack_price || 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </section>
      {/* Hiển thị feedbacks */}
      <section className="feedback-section">
        <h2>Phản hồi</h2>
        {feedbacks.length > 0 ? (
          <div className="feedback-list">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="feedback-item">
                <p>{feedback.feedback_content || 'Không có nội dung'}</p>
                <span>Đánh giá: {feedback.rating || 0}/5</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có phản hồi nào.</p>
        )}
      </section>
      <Footer />
    </>
  );
};

export default MyBusinessPage;
