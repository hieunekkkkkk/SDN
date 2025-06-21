import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { convertFilesToBase64 } from '../utils/imageToBase64';
import '../css/ProductDetailModal.css'; // Using provided CSS for identical styling

const BusinessProductModal = ({
  showModal,
  setShowModal,
  selectedProduct,
  setSelectedProduct,
  products,
  reviews,
  overallRating,
  totalReviews,
  handleWriteReview,
  handleCancelReview,
  handleShareReview,
  handleHelpful,
  renderStars,
  enableEdit = true,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [editFields, setEditFields] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setEditFields({});
    setEditedValues({});
    setNewCars([]);
    setError(null);
  };

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => (document.body.style.overflow = '');
  }, [showModal]);

  const handleEdit = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: true }));
    setEditedValues((prev) => ({
      ...prev,
      [field]: selectedProduct[field] || '',
    }));
  };

  const handleChange = (e, field) => {
    setEditedValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = async (field) => {
    if (editedValues[field] !== selectedProduct[field]) {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BE_URL}/api/product/${selectedProduct.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: editedValues[field] }),
          }
        );
        if (!response.ok) throw new Error('Cập nhật thất bại');
        const updatedProduct = await response.json();
        setSelectedProduct((prev) => ({
          ...prev,
          [field]: updatedProduct[field],
        }));
        // Update products list to sync changes
        setSelectedProduct((prev) => {
          const updatedProducts = products.map((p) =>
            p._id === prev.id ? { ...p, [field]: updatedProduct[field] } : p
          );
          return { ...prev, [field]: updatedProduct[field] };
        });
      } catch (err) {
        console.error(`Error updating ${field}:`, err);
        setError(`Không thể cập nhật ${field}. Chi tiết: ${err.message}`);
      } finally {
        setLoading(false);
        setEditFields((prev) => ({ ...prev, [field]: false }));
      }
    } else {
      setEditFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleAddImage = async (event) => {
    const files = Array.from(event.target.files);
    try {
      const base64Images = await convertFilesToBase64(files);
      setNewImages((prevImages) => [...prevImages, ...base64Images]);
      setError(null);
    } catch (error) {
      console.error('Error converting images to base64:', error);
      setError('Không thể chuyển đổi ảnh. Vui lòng thử lại.');
    }
  };

  const handleSaveImages = async () => {
    if (newImages.length > 0 && selectedProduct) {
      setLoading(true);
      try {
        const updatedThumbnails = [
          ...(selectedProduct.thumbnails || []),
          ...newImages,
        ];
        const response = await fetch(
          `${import.meta.env.VITE_BE_URL}/api/product/${selectedProduct.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thumbnails: updatedThumbnails }),
          }
        );
        if (!response.ok) throw new Error('Cập nhật ảnh thất bại');
        const updatedProduct = await response.json();
        setSelectedProduct((prev) => ({
          ...prev,
          thumbnails: updatedProduct.thumbnails || updatedThumbnails,
        }));
        setSelectedProduct((prev) => {
          const updatedProducts = products.map((p) =>
            p._id === prev.id
              ? {
                  ...p,
                  product_image: updatedProduct.thumbnails || updatedThumbnails,
                }
              : p
          );
          return {
            ...prev,
            thumbnails: updatedProduct.thumbnails || updatedThumbnails,
          };
        });
        setNewImages([]);
        setError(null);
      } catch (err) {
        console.error('Error saving images:', err);
        setError(
          'Không thể lưu ảnh. Vui lòng kiểm tra kết nối hoặc liên hệ admin.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const allThumbnails = [...(selectedProduct?.thumbnails || []), ...newImages];

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

            <h1 className="modal-product-header">Chi tiết sản phẩm</h1>
            <div className="business-content">
              <div className="business-images">
                <div className="main-image">
                  <img
                    src={allThumbnails[selectedImage] || '1.png'}
                    alt={`${selectedProduct.name} main ${selectedImage + 1}`}
                    className="main-img"
                    onError={(e) => (e.target.src = '1.png')}
                  />
                </div>
                <div className="thumbnail-images">
                  {allThumbnails.map((thumb, idx) => (
                    <div
                      key={idx}
                      className={`thumbnail ${
                        selectedImage === idx ? 'active' : ''
                      }`}
                      onClick={() => setSelectedImage(idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={thumb || '1.png'}
                        alt={`${selectedProduct.name} thumbnail ${idx + 1}`}
                        onError={(e) => (e.target.src = '1.png')}
                      />
                    </div>
                  ))}
                  {enableEdit && (
                    <>
                      <label className="thumbnail add-image">
                        <FaPlus />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAddImage}
                          style={{ display: 'none' }}
                          multiple
                        />
                      </label>
                      {newImages.length > 0 && (
                        <button
                          onClick={handleSaveImages}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginTop: '0.5rem',
                          }}
                          disabled={loading}
                        >
                          {loading ? 'Đang lưu...' : 'Lưu ảnh'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="business-info">
                <div className="editable-field">
                  <h1
                    className="modal-product-title"
                    onMouseEnter={() =>
                      enableEdit &&
                      !editFields['name'] &&
                      setEditFields((prev) => ({ ...prev, hoverName: true }))
                    }
                    onMouseLeave={() =>
                      enableEdit &&
                      !editFields['name'] &&
                      setEditFields((prev) => ({ ...prev, hoverName: false }))
                    }
                  >
                    {editFields['name'] ? (
                      <input
                        type="text"
                        value={editedValues['name'] || ''}
                        onChange={(e) => handleChange(e, 'name')}
                        onBlur={() => handleBlur('name')}
                        autoFocus
                        disabled={loading}
                      />
                    ) : (
                      selectedProduct.name
                    )}
                  </h1>
                  {enableEdit &&
                    !editFields['name'] &&
                    editFields.hoverName && (
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit('name')}
                      >
                        Chỉnh sửa
                      </button>
                    )}
                </div>
                <div className="editable-field">
                  <div
                    className="business-status"
                    onMouseEnter={() =>
                      enableEdit &&
                      !editFields['price'] &&
                      setEditFields((prev) => ({ ...prev, hoverPrice: true }))
                    }
                    onMouseLeave={() =>
                      enableEdit &&
                      !editFields['price'] &&
                      setEditFields((prev) => ({ ...prev, hoverPrice: false }))
                    }
                  >
                    <span className="modal-product-price">
                      {editFields['price'] ? (
                        <input
                          type="text"
                          value={
                            editedValues['price'].replace(' VND', '') || ''
                          }
                          onChange={(e) => handleChange(e, 'price')}
                          onBlur={() => handleBlur('price')}
                          autoFocus
                          disabled={loading}
                        />
                      ) : (
                        `${selectedProduct.price} VND`
                      )}
                    </span>
                  </div>
                  {enableEdit &&
                    !editFields['price'] &&
                    editFields.hoverPrice && (
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit('price')}
                      >
                        Chỉnh sửa
                      </button>
                    )}
                </div>
                <p className="business-category">Đánh giá bởi người dùng</p>
                <div className="rating-section">
                  <div className="stars">
                    {renderStars(selectedProduct.rating)}
                  </div>
                  <span className="rating-count">
                    {selectedProduct.reviews}
                  </span>
                </div>
                <div className="editable-field">
                  <p
                    className="business-description"
                    onMouseEnter={() =>
                      enableEdit &&
                      !editFields['description'] &&
                      setEditFields((prev) => ({
                        ...prev,
                        hoverDescription: true,
                      }))
                    }
                    onMouseLeave={() =>
                      enableEdit &&
                      !editFields['description'] &&
                      setEditFields((prev) => ({
                        ...prev,
                        hoverDescription: false,
                      }))
                    }
                  >
                    {editFields['description'] ? (
                      <textarea
                        value={editedValues['description'] || ''}
                        onChange={(e) => handleChange(e, 'description')}
                        onBlur={() => handleBlur('description')}
                        autoFocus
                        disabled={loading}
                      />
                    ) : (
                      selectedProduct.description
                    )}
                  </p>
                  {enableEdit &&
                    !editFields['description'] &&
                    editFields.hoverDescription && (
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit('description')}
                      >
                        Chỉnh sửa
                      </button>
                    )}
                </div>
              </div>
            </div>

            <section className="business-feedback-section">
              <div className="business-feedback">
                <div className="feedback-container">
                  <h2 className="feedback-title">Feedback</h2>

                  <div className="overall-rating">
                    <div className="modal-product-rating">
                      <div className="modal-product-rating-score">
                        <span className="score">{overallRating}</span>
                        <div className="stars">
                          {renderStars(Math.floor(overallRating))}
                        </div>
                      </div>
                      <span className="time-period">vài tháng gần đây</span>
                    </div>
                    <div className="review-actions">
                      <button
                        className="write-review-btn"
                        onClick={handleWriteReview}
                      >
                        Gửi nhận xét
                      </button>
                      <button
                        className="cancel-review-btn"
                        onClick={handleCancelReview}
                      >
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
                              <div className="reviewer-avatar">
                                {review.avatar}
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
                            <div className="helpful-section">
                              <span className="helpful-text">
                                Bình luận này có hữu ích với bạn không?
                              </span>
                              <div className="helpful-buttons">
                                <button
                                  className="helpful-btn"
                                  onClick={() => handleHelpful(review.id, true)}
                                >
                                  👍 {review.helpfulCount}
                                </button>
                                <button
                                  className="helpful-btn"
                                  onClick={() =>
                                    handleHelpful(review.id, false)
                                  }
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export default BusinessProductModal;
