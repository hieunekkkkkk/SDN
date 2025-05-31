
import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { FaFacebookF, FaInstagram, FaGoogle } from 'react-icons/fa';
import ProductDetailModal from '../components/ProductDetailModal';
import '../css/BusinessPage.css';

const BusinessPage = () => {
  // --- BusinessDetail state ---
  const [selectedImage, setSelectedImage] = useState(0);
  const images = ['1.png', '2.png', '3.png', '4.png'];

  // --- BusinessProducts state ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const products = [
    { id: 1, name: 'Lorem Ipsum Ipsum', price: '$0.00', rating: 0, reviews: '000 Đánh giá', mainImage: '1.png', thumbnails: ['1.png', '2.png', '3.png'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', isSaved: true },
    { id: 2, name: 'Lorem Ipsum Ipsum', price: '$0.00', rating: 0, reviews: '000 Đánh giá', mainImage: '2.png', thumbnails: ['2.png', '2.png', '2.png'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', isSaved: true },
    { id: 3, name: 'Lorem Ipsum Ipsum', price: '$0.00', rating: 0, reviews: '000 Đánh giá', mainImage: '3.png', thumbnails: ['3.png', '3.png', '3.png'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', isSaved: false },
    { id: 4, name: 'Lorem Ipsum Ipsum', price: '$0.00', rating: 0, reviews: '000 Đánh giá', mainImage: '4.png', thumbnails: ['4.png', '4.png', '4.png'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', isSaved: true },
    { id: 5, name: 'Lorem Ipsum Ipsum', price: '$0.00', rating: 0, reviews: '000 Đánh giá', mainImage: '1.png', thumbnails: ['1.png', '1.png', '1.png'], description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', isSaved: true},
  ];
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

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
      content: 'Lorem Ipsumವ: Lorem ipsum is simply dummy text of the printing and typesetting industry.',
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
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      helpfulCount: 0,
      notHelpfulCount: 0,
      isVerified: true,
    },
  ];

  // BusinessDetail handlers
  const handleShare = () => console.log('Chia sẻ');
  const handleContact = () => console.log('Liên hệ');
  const handleShowOnMap = () => console.log('Hiển thị trên Google Maps');

  // BusinessProducts handlers
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index) => setCurrentSlide(index);
  const getCurrentProducts = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return products.slice(startIndex, startIndex + itemsPerSlide);
  };
  const handleViewDetails = (id) => {
    const product = products.find((p) => p.id === id);
    setSelectedProduct(product);
    setShowModal(true);
  };
  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  // BusinessFeedback handlers
  const handleWriteReview = () => console.log('Gửi nhận xét');
  const handleCancelReview = () => console.log('Hủy nhận xét');
  const handleShareReview = (id) => console.log('Chia sẻ review:', id);
  const handleHelpful = (id, isHelpful) => console.log(`Review ${id} is ${isHelpful ? 'helpful' : 'not helpful'}`);
  const handlePageChange = (page) => setCurrentPage(page);
  const renderPagination = () => {
    const pages = [];
    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="page-btn" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous page">
          ‹
        </button>
      );
    }
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
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
        <button key="next" className="page-btn" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next page">
          ›
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <Header />

      {/* Business Detail Section */}
      <section className="business-detail-section">
        <div className="business-detail">
          <div className="business-detail-container">
            <button className="back-button">
              <span className="back-icon">←</span> Quay Lại
            </button>
            <div className="business-content">
              <div className="business-images">
                <div className="main-image">
                  <img src={images[selectedImage]} alt={`Business main ${selectedImage + 1}`} className="main-img" />
                </div>
                <div className="thumbnail-images">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                      onClick={() => setSelectedImage(idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="business-info">
                <h1 className="business-title">Lorem Ipsum Lorem Ipsum Lorem Ipsum</h1>
                <div className="business-status">
                  <span className="status-badge open">Đang mở cửa</span>
                </div>
                <p className="business-description">
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </p>
                <p className="business-category">Danh gia loa nguoi dung</p>

                <div className="rating-section">
                  <div className="stars">{'★'.repeat(0)}{'☆'.repeat(5)}</div>
                  <span className="rating-count">000 lượt</span>
                </div>

                <div className="business-long-description">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </div>

                <div className="action-buttons">
                  <button className="contact-btn" onClick={handleContact}>
                    Liên hệ
                  </button>
                  <button className="map-btn" onClick={handleShowOnMap}>
                    Hiển thị trên GG map
                  </button>
                </div>

                <div className="share-section">
                  <button className="share-link" onClick={handleShare}>
                    <span className="share-icon">↗</span> Chia sẻ
                  </button>
                </div>

                <div className="social-icons">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                    <FaFacebookF />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Google">
                    <FaGoogle />
                  </a>
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

            <div className="products-carousel">
              <button className="carousel-btn prev-btn" onClick={prevSlide} disabled={totalSlides <= 1} aria-label="Previous Slide">
                ‹
              </button>

              <div className="products-grid">
                {getCurrentProducts().map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-images">
                      <div className="product-main-image">
                        <img src={product.mainImage} alt={product.name} />
                      </div>
                      <div className="product-thumbnails">
                        {product.thumbnails.map((thumb, idx) => (
                          <div key={idx} className="product-thumbnail">
                            <img src={thumb} alt={`${product.name} thumbnail ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">{product.price}</div>
                      <div className="product-rating">
                        <div className="stars">{renderStars(product.rating)}</div>
                        <span className="reviews-count">{product.reviews}</span>
                      </div>
                      <button className="view-details-btn" onClick={() => handleViewDetails(product.id)}>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="carousel-btn next-btn" onClick={nextSlide} disabled={totalSlides <= 1} aria-label="Next Slide">
                ›
              </button>
            </div>

            {totalSlides > 1 && (
              <div className="carousel-dots" role="tablist" aria-label="Carousel Pagination">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${currentSlide === idx ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                    aria-selected={currentSlide === idx}
                    role="tab"
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BusinessFeedback Section */}
      <section className="business-feedback-section">
        <div className="business-feedback">
          <div className="feedback-container">
            <h2 className="feedback-title">Feedback</h2>

            {/* Overall Rating */}
            <div className="overall-rating">
              <div className="rating-score">
                <span className="score">{overallRating}</span>
                <div className="stars">{renderStars(Math.floor(overallRating))}</div>
              </div>
                <span className="time-period">vài tháng gắn</span>

              <div className="review-actions">
                <button className="write-review-btn" onClick={handleWriteReview}>
                  Gửi nhận xét
                </button>
                <button className="cancel-review-btn" onClick={handleCancelReview}>
                  Hủy nhận xét
                </button>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="customer-reviews-section">
              <div className="reviews-header">
                <h3 className="reviews-title">Đánh giá của khách hàng</h3>
                <div className="reviews-summary">
                  <span className="total-reviews">{totalReviews}</span>
                  <select className="sort-dropdown" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort reviews">
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
                        <div className="reviewer-avatar" aria-label={`Avatar of ${review.userName}`}>
                          {review.avatar}
                          {review.isVerified && <span className="verified-badge" aria-label="Verified user">✓</span>}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">{review.userName}</span>
                          <div className="review-rating">
                            <span className="stars">{renderStars(review.rating)}</span>
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
                      <button className="share-btn" onClick={() => handleShareReview(review.id)}>
                        <span className="share-icon">↗</span> Chia sẻ
                      </button>

                      <div className="helpful-section">
                        <span className="helpful-text" aria-live="polite">
                          Bình luận này có hữu ích với bạn không?
                        </span>
                        <div className="helpful-buttons">
                          <button className="helpful-btn" onClick={() => handleHelpful(review.id, true)} aria-label={`Mark review ${review.id} as helpful`}>
                            👍 {review.helpfulCount}
                          </button>
                          <button className="helpful-btn" onClick={() => handleHelpful(review.id, false)} aria-label={`Mark review ${review.id} as not helpful`}>
                            👎 {review.notHelpfulCount}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" role="navigation" aria-label="Review Pagination">
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
