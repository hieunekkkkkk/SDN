import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaFacebookF, FaInstagram, FaGoogle } from 'react-icons/fa';
import ProductDetailModal from '../../components/ProductDetailModal';
import { Link } from 'react-router-dom';
import '../../css/MyBusinessPage.css';

const BusinessPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleStatus = () => {
    setIsOpen((prev) => !prev);
  };

  // --- BusinessDetail state ---
  const [selectedImage, setSelectedImage] = useState(0);
  const images = ['1.png', '2.png', '3.png', '4.png'];

  // --- BusinessProducts state ---
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const products = [
    {
      id: 1,
      name: 'Lorem Ipsum Ipsum',
      price: '$0.00',
      rating: 0,
      reviews: '000 Đánh giá',
      mainImage: '1.png',
      thumbnails: ['1.png', '2.png', '3.png'],
      description:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isSaved: true,
    },
    {
      id: 2,
      name: 'Lorem Ipsum Ipsum',
      price: '$0.00',
      rating: 0,
      reviews: '000 Đánh giá',
      mainImage: '2.png',
      thumbnails: ['2.png', '2.png', '2.png'],
      description:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isSaved: true,
    },
    {
      id: 3,
      name: 'Lorem Ipsum Ipsum',
      price: '$0.00',
      rating: 0,
      reviews: '000 Đánh giá',
      mainImage: '3.png',
      thumbnails: ['3.png', '3.png', '3.png'],
      description:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isSaved: false,
    },
    {
      id: 4,
      name: 'Lorem Ipsum Ipsum',
      price: '$0.00',
      rating: 0,
      reviews: '000 Đánh giá',
      mainImage: '4.png',
      thumbnails: ['4.png', '4.png', '4.png'],
      description:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isSaved: true,
    },
    {
      id: 5,
      name: 'Lorem Ipsum Ipsum',
      price: '$0.00',
      rating: 0,
      reviews: '000 Đánh giá',
      mainImage: '1.png',
      thumbnails: ['1.png', '1.png', '1.png'],
      description:
        'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      isSaved: true,
    },
  ];

  // --- BusinessFeedback state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Sort: Select');
  const overallRating = 4.0;
  const totalReviews = '000 Đánh giá';
  const totalPages = 8;
  const reviews = [
    {
      id: 1,
      userName: 'Lorem Ipsum',
      avatar: 'L',
      rating: 5,
      date: '06/12/21',
      title: 'Lorem Ipsum is simply dummy',
      content:
        'Lorem Ipsumವ: Lorem ipsum is simply dummy text of the printing and typesetting industry.',
      helpfulCount: 0,
      notHelpfulCount: 0,
      isVerified: true,
    },
    {
      id: 2,
      userName: 'Lorem Ipsum',
      avatar: 'S',
      rating: 5,
      date: '06/12/21',
      title: 'Lorem Ipsum is simply dummy',
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      helpfulCount: 0,
      notHelpfulCount: 0,
      isVerified: true,
    },
  ];

  // BusinessDetail handlers
  const handleEdit = () => console.log('Chỉnh sửa');

  // BusinessProducts handlers
  const handleViewDetails = (id) => {
    const product = products.find((p) => p.id === id);
    setSelectedProduct(product);
    setShowModal(true);
  };
  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const displayedProducts = isExpanded ? products : products.slice(0, 6);

  // BusinessFeedback handlers
  const handleWriteReview = () => console.log('Gửi nhận xét');
  const handleCancelReview = () => console.log('Hủy nhận xét');
  const handleShareReview = (id) => console.log('Chia sẻ review:', id);
  const handleHelpful = (id, isHelpful) =>
    console.log(`Review ${id} is ${isHelpful ? 'helpful' : 'not helpful'}`);
  const handlePageChange = (page) => setCurrentPage(page);
  const renderPagination = () => {
    const pages = [];
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Previous page"
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
            aria-current={currentPage === i ? 'page' : undefined}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={`dots-${i}`} className="page-dots" aria-hidden="true">
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
          aria-label="Next page"
        >
          ›
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      {/* Business Detail Section */}
      <section className="business-detail-section">
        <div className="business-detail">
          <div className="business-detail-container">
            <Link to="/" className="back-button">
              <span className="back-icon">←</span> Quay Lại
            </Link>
            <div className="business-content">
              <div className="business-images">
                <div className="main-image">
                  <img
                    src={images[selectedImage]}
                    alt={`Business main ${selectedImage + 1}`}
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
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="business-info">
                <h1 className="business-title">
                  Lorem Ipsum Lorem Ipsum Lorem Ipsum
                </h1>
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
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
                <p className="business-category">Đánh giá của người dùng</p>

                <div className="rating-section">
                  <div className="stars">
                    {'★'.repeat(0)}
                    {'☆'.repeat(5)}
                  </div>
                  <span className="rating-count">000 lượt</span>
                </div>

                <div className="business-long-description">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </div>

                <div className="contact-info">
                  <h3 className="contact-title">Thông tin liên hệ</h3>
                  <p className="contact-detail">
                    <strong>Phone:</strong> ...
                  </p>
                  <p className="contact-detail">
                    <strong>Address:</strong> ...
                  </p>
                  <p className="contact-detail">
                    <strong>Mô hình kinh doanh:</strong> ...
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
                <div key={product.id} className="product-card">
                  <div className="product-images">
                    <div className="product-main-image">
                      <img src={product.mainImage} alt={product.name} />
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">{product.price}</div>
                    <div className="product-rating">
                      <div className="stars">{renderStars(product.rating)}</div>
                      <span className="reviews-count">{product.reviews}</span>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetails(product.id)}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="product-actions">
              <button className="expand-btn" onClick={toggleExpand}>
                {isExpanded ? 'Thu gọn' : 'Mở rộng'}
              </button>
              <Link to="/product-registration" className="add-product-btn">
                Thêm sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BusinessFeedback Section */}
      <section className="business-feedback-section">
        <div className="business-feedback">
          <div className="feedback-container">
            <h2 className="feedback-title">Feedback</h2>

            {/* Customer Reviews Section */}
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
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div
                          className="reviewer-avatar"
                          aria-label={`Avatar of ${review.userName}`}
                        >
                          {review.avatar}
                          {review.isVerified && (
                            <span
                              className="verified-badge"
                              aria-label="Verified user"
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">
                            {review.userName}
                          </span>
                          <div className="review-rating">
                            <span className="stars">
                              {renderStars(review.rating)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>

                    <div className="review-content">
                      <h4 className="review-title">{review.title}</h4>
                      <p className="review-text">{review.content}</p>
                    </div>

                    <div className="review-footer">
                      <button
                        className="share-btn"
                        onClick={() => handleShareReview(review.id)}
                      >
                        <span className="share-icon">↗</span> Chia sẻ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
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
        reviews={reviews}
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

export default BusinessPage;
