import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaFacebookF, FaInstagram, FaGoogle } from 'react-icons/fa';
import ProductDetailModal from '../../components/ProductDetailModal';
import { getCurrentUserId } from '../../utils/useCurrentUserId'; // Giả sử file này trả về owner_id
import '../../css/MyBusinessPage.css';

const MyBusinessPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [selectedImage, setSelectedImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Sort: Select');

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) {
        setError('Người dùng chưa đăng nhập.');
        setLoading(false);
        return;
      }

      const ownerId = getCurrentUserId(); // Sử dụng owner_id thay vì user_id
      console.log('Owner ID:', ownerId);

      try {
        setLoading(true);
        setError(null);

        // Gọi API để lấy tất cả doanh nghiệp
        const businessesResponse = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/business`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        let businesses = businessesResponse.data;

        // Kiểm tra và điều chỉnh cấu trúc dữ liệu
        if (!Array.isArray(businesses)) {
          if (businesses.data && Array.isArray(businesses.data)) {
            businesses = businesses.data;
          } else if (
            businesses.businesses &&
            Array.isArray(businesses.businesses)
          ) {
            businesses = businesses.businesses;
          } else {
            throw new Error('Dữ liệu từ API không phải là mảng doanh nghiệp.');
          }
        }

        console.log('API Response:', businessesResponse);
        console.log('Businesses data:', businesses);

        if (!businesses || businesses.length === 0) {
          setError(
            'Không tìm thấy doanh nghiệp nào từ API. Vui lòng kiểm tra kết nối hoặc dữ liệu.'
          );
          setLoading(false);
          return;
        }

        // Filter doanh nghiệp theo owner_id
        const userBusiness = businesses.find((b) => b.owner_id === ownerId);
        console.log('User Business found:', userBusiness);
        if (!userBusiness) {
          const availableOwnerIds = businesses
            .map((b) => b.owner_id)
            .join(', ');
          setError(
            `Không tìm thấy doanh nghiệp nào cho owner với ID: ${ownerId}. Các owner_id trong database: ${
              availableOwnerIds || 'Không có'
            }. Vui lòng kiểm tra hoặc liên hệ admin để gán doanh nghiệp.`
          );
          setLoading(false);
          return;
        }

        const businessId = userBusiness._id;

        // Fetch business details, products, and feedbacks in parallel
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
          setIsOpen(businessResult.value.data.business_status || false);
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
        console.error(
          'Error fetching business data:',
          err.response ? err.response.data : err.message
        );
        setError(
          `Không thể tải dữ liệu doanh nghiệp. Chi tiết: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  // Business detail handlers
  const toggleStatus = () => setIsOpen((prev) => !prev);

  const handleEdit = () => console.log('Chỉnh sửa');
  const handleViewDetails = (id) => {
    const product = products.find((p) => p._id === id);
    if (product) {
      const transformedProduct = {
        id: product._id,
        name: product.product_name,
        price: product.product_price || '$0.00',
        rating: product.product_rating || 0,
        reviews: `${product.product_total_vote || 0} Đánh giá`,
        mainImage: product.product_image?.[0] || '1.png',
        thumbnails: product.product_image || ['1.png', '2.png', '3.png'],
        description: product.product_description || 'Không có mô tả',
        isSaved: true,
      };
      setSelectedProduct(transformedProduct);
      setShowModal(true);
    }
  };

  const renderStars = (rating) =>
    '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

  const displayedProducts = isExpanded ? products : products.slice(0, 6);

  // Feedback handlers
  const handleWriteReview = () => console.log('Gửi nhận xét');
  const handleCancelReview = () => console.log('Hủy nhận xét');
  const handleShareReview = (id) => console.log('Chia sẻ review:', id);
  const handleHelpful = (id, isHelpful) =>
    console.log(`Review ${id} is ${isHelpful ? 'helpful' : 'not helpful'}`);
  const handlePageChange = (page) => setCurrentPage(page);

  const renderPagination = () => {
    const totalPages = Math.ceil(feedbacks.length / 2);
    const pages = [];
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ‹
        </button>
      );
    }
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            className={`page-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={`dots-${i}`} className="page-dots">
            ...
          </span>
        );
      }
    }
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ›
        </button>
      );
    }
    return pages;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !business) {
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
              backgroundColor: '#ff6b35',
              color: 'white',
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

  const images =
    business.business_image && business.business_image.length > 0
      ? business.business_image
      : ['1.png'];
  const overallRating = business.business_rating || 0;
  const totalReviews = `${business.business_total_vote || 0} Đánh giá`;

  return (
    <>
      <Header />
      {/* Business Detail Section */}
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
                    src={images[selectedImage]}
                    alt={`${business.business_name} main ${selectedImage + 1}`}
                    className="main-img"
                  />
                </div>
                <div className="thumbnail-images">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`thumbnail ${
                        selectedImage === idx ? 'active' : ''
                      }`}
                      onClick={() => setSelectedImage(idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={img}
                        alt={`${business.business_name} thumbnail ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="business-info">
                <h1 className="business-title">{business.business_name}</h1>
                <div className="business-status">
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={isOpen}
                      onChange={toggleStatus}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className={`status-text ${isOpen ? 'open' : 'closed'}`}>
                    {isOpen ? 'Đang mở cửa' : 'Đang đóng cửa'}
                  </span>
                </div>
                <p className="business-description">
                  {business.business_detail || 'Không có mô tả'}
                </p>
                <p className="business-category">Đánh giá của người dùng</p>
                <div className="rating-section">
                  <div className="stars">{renderStars(overallRating)}</div>
                  <span className="rating-count">{totalReviews}</span>
                </div>
                <div className="business-long-description">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </div>
                <div className="contact-info">
                  <h3 className="contact-title">Thông tin liên hệ</h3>
                  <p className="contact-detail">
                    <strong>Phone:</strong> {business.business_phone || '...'}
                  </p>
                  <p className="contact-detail">
                    <strong>Address:</strong>{' '}
                    {business.business_address || '...'}
                  </p>
                  <p className="contact-detail">
                    <strong>Mô hình kinh doanh:</strong>{' '}
                    {business.business_category_id?.category_name || '...'}
                  </p>
                </div>
                <div className="social-icons">
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
                <div className="action-buttons">
                  <button className="edit-btn" onClick={handleEdit}>
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BusinessProducts Section */}
      <section className="business-products-section">
        <div className="business-products">
          <div className="products-container">
            <h2 className="products-title">Sản phẩm kinh doanh</h2>
            <div className="products-list">
              {displayedProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-images">
                    <div className="product-main-image">
                      <img
                        src={product.product_image?.[0] || '1.png'}
                        alt={product.product_name}
                      />
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.product_name}</h3>
                    <div className="product-price">
                      {product.product_price || '$0.00'}
                    </div>
                    <div className="product-rating">
                      <div className="stars">
                        {renderStars(product.product_rating || 0)}
                      </div>
                      <span className="reviews-count">
                        {product.product_total_vote || '000'} Đánh giá
                      </span>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetails(product._id)}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="product-actions">
              <button
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Thu gọn' : 'Mở rộng'}
              </button>
              <a href="/product-registration" className="add-product-btn">
                Thêm sản phẩm
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BusinessFeedback Section */}
      <section className="business-feedback-section">
        <div className="business-feedback">
          <div className="feedback-container">
            <h2 className="feedback-title">Feedback</h2>
            <div className="customer-reviews-section">
              <div className="reviews-header">
                <h3 className="reviews-title">Đánh giá của khách hàng</h3>
                <div className="reviews-summary">
                  <span className="total-reviews">{totalReviews}</span>
                  <select
                    className="sort-dropdown"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort reviews"
                  >
                    <option value="Sort: Select">Sort: Select</option>
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="highest">Đánh giá cao nhất</option>
                    <option value="lowest">Đánh giá thấp nhất</option>
                  </select>
                </div>
              </div>
              <div className="reviews-list">
                {feedbacks
                  .slice((currentPage - 1) * 2, currentPage * 2)
                  .map((feedback) => (
                    <div key={feedback._id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div
                            className="reviewer-avatar"
                            aria-label={`Avatar of ${feedback.user_id}`}
                          >
                            {feedback.user_id.charAt(0).toUpperCase()}
                          </div>
                          <div className="reviewer-details">
                            <span className="reviewer-name">
                              {feedback.user_id || 'Người dùng ẩn danh'}
                            </span>
                            <div className="review-rating">
                              <span className="stars">{renderStars(5)}</span>
                            </div>
                          </div>
                        </div>
                        <span className="review-date">
                          {new Date(feedback.feedback_date).toLocaleDateString(
                            'vi-VN'
                          )}
                        </span>
                      </div>
                      <div className="review-content">
                        <p className="review-text">
                          {feedback.feedback_comment}
                        </p>
                      </div>
                      <div className="review-footer">
                        <button
                          className="share-btn"
                          onClick={() => handleShareReview(feedback._id)}
                        >
                          <span className="share-icon">↗</span> Chia sẻ
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {Math.ceil(feedbacks.length / 2) > 1 && (
                <div
                  className="pagination"
                  role="navigation"
                  aria-label="Review Pagination"
                >
                  {renderPagination()}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductDetailModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        products={products}
        reviews={feedbacks}
        overallRating={overallRating}
        totalReviews={totalReviews}
        handleWriteReview={handleWriteReview}
        handleCancelReview={handleCancelReview}
        handleShareReview={handleShareReview}
        handleHelpful={handleHelpful}
        renderStars={renderStars}
      />

      <Footer />
    </>
  );
};

export default MyBusinessPage;
