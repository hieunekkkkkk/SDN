import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import '../css/ProductDetailModal.css';

const ProductDetailModal = ({
  showModal,
  setShowModal,
  selectedProduct,
  setSelectedProduct,
  reviews,
  overallRating,
  totalReviews,
  handleWriteReview,
  handleCancelReview,
  handleShareReview,
  handleHelpful,
  renderStars,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => (document.body.style.overflow = '');
  }, [showModal]);

  const modalRoot = document.getElementById('modal-root') || document.body;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {showModal && selectedProduct && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeModal}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-product-exit"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>

            <h1 className="modal-product-header">Chi tiết</h1>
            <div className="business-content">
              <div className="business-images">
                <div className="main-image">
                  <img
                    src={selectedProduct.thumbnails[selectedImage]}
                    alt={`${selectedProduct.name} main ${selectedImage + 1}`}
                    className="main-img"
                  />
                </div>
                <div className="thumbnail-images">
                  {selectedProduct.thumbnails.map((thumb, idx) => (
                    <div
                      key={idx}
                      className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                      onClick={() => setSelectedImage(idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={thumb} alt={`${selectedProduct.name} thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="business-info">
                <h1 className="modal-product-title">{selectedProduct.name}</h1>
                <div className="business-status">
                  <span className="modal-product-price">{selectedProduct.price} VND</span>
                </div>
                <p className="business-category">Đánh giá bởi người dùng</p>
                <div className="rating-section">
                  <div className="stars">{renderStars(selectedProduct.rating)}</div>
                  <span className="rating-count">{selectedProduct.reviews}</span>
                </div>
                <p className="business-description">{selectedProduct.description}</p>
              </div>
            </div>

            {/* Feedback Section */}
            <section className="business-feedback-section">
              <div className="business-feedback">
                <div className="feedback-container">
                  <h2 className="feedback-title">Feedback</h2>

                  <div className="overall-rating">
                    <div className="modal-product-rating">
                      <div className="modal-product-rating-score">
                        <span className="score">{overallRating}</span>
                        <div className="stars">{renderStars(Math.floor(overallRating))}</div>
                      </div>
                      <span className="time-period">vài tháng gần đây</span>
                    </div>
                    <div className="review-actions">
                      <button className="write-review-btn" onClick={handleWriteReview}>
                        Gửi nhận xét
                      </button>
                      <button className="cancel-review-btn" onClick={handleCancelReview}>
                        Hủy nhận xét
                      </button>
                    </div>
                  </div>

                  <div className="customer-reviews-section">
                    <div className="reviews-header">
                      <h3 className="reviews-title">Đánh giá của khách hàng</h3>
                      <div className="reviews-summary">
                        <span className="total-reviews">{totalReviews}</span>
                      </div>
                    </div>

                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="reviewer-avatar">{review.avatar}</div>
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
                              <span className="helpful-text">Bình luận này có hữu ích với bạn không?</span>
                              <div className="helpful-buttons">
                                <button
                                  className="helpful-btn"
                                  onClick={() => handleHelpful(review.id, true)}
                                >
                                  👍 {review.helpfulCount}
                                </button>
                                <button
                                  className="helpful-btn"
                                  onClick={() => handleHelpful(review.id, false)}
                                >
                                  👎 {review.notHelpfulCount}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export default ProductDetailModal;
