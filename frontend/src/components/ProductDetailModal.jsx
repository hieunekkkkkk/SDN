import React, { useState } from 'react';
import Modal from 'react-modal';
import '../css/ProductDetailModal.css';


// Bind modal to app element for accessibility
Modal.setAppElement('#root');

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
    // State for image selection
    const [selectedImage, setSelectedImage] = useState(0);

    // Modal handler
    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Modal styles
    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px 40px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
        },
    };

    return (
        <Modal
            isOpen={showModal}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Product Details Modal"
        >
            {selectedProduct && (
                <div className="relative">
                    <button
                        className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl"
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
                                <span className="modal-product-price">{selectedProduct.price}</span>
                            </div>
                            <p className="business-category">Đánh giá bởi người dùng</p>
                            <div className="rating-section">
                                <div className="stars">{renderStars(selectedProduct.rating)}</div>
                                <span className="rating-count">{selectedProduct.reviews}</span>
                            </div>
                            <p className="business-description">{selectedProduct.description}</p>


                            <div className="business-long-description">
                                {/* Placeholder for additional product details if needed */}
                            </div>

                            <div className="action-buttons">
                                <button
                                    className={`modal-save-product-btn ${selectedProduct.isSaved ? 'modal-product-saved' : ''}`}
                                    onClick={() => {
                                        const updatedProduct = {
                                            ...selectedProduct,
                                            isSaved: !selectedProduct.isSaved,
                                        };
                                        setSelectedProduct(updatedProduct);
                                    }}
                                >
                                    {selectedProduct.isSaved ? 'Đã yêu thích' : 'Yêu thích'}
                                </button>

                            </div>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <section className="business-feedback-section">
                        <div className="business-feedback">
                            <div className="feedback-container">
                                <h2 className="feedback-title">Feedback</h2>

                                {/* Overall Rating */}
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

                                {/* Customer Reviews Section */}
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
                                                            <button
                                                                className="helpful-btn"
                                                                onClick={() => handleHelpful(review.id, true)}
                                                                aria-label={`Mark review ${review.id} as helpful`}
                                                            >
                                                                👍 {review.helpfulCount}
                                                            </button>
                                                            <button
                                                                className="helpful-btn"
                                                                onClick={() => handleHelpful(review.id, false)}
                                                                aria-label={`Mark review ${review.id} as not helpful`}
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
                </div>
            )}
        </Modal>
    );
};

export default ProductDetailModal;