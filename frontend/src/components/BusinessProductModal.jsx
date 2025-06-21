import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { convertFilesToBase64 } from '../utils/imageToBase64';
import '../css/ProductDetailModal.css';
import MyBusinessProductFeedback from './MyBusinessProductFeedback';


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
  businessId,
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
    setNewImages([]);
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
    console.log(editFields);
    console.log(editedValues);

  };

  const handleBlur = async (field) => {
    console.log(JSON.stringify({ [field]: editedValues[field] }));
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
                      className={`thumbnail ${selectedImage === idx ? 'active' : ''
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
                <div
                  className="editable-field"
                  onMouseEnter={() =>
                    enableEdit &&
                    !editFields['product_name'] &&
                    setEditFields((prev) => ({ ...prev, hoverName: true }))
                  }
                  onMouseLeave={() =>
                    enableEdit &&
                    !editFields['product_name'] &&
                    setEditFields((prev) => ({ ...prev, hoverName: false }))
                  }
                >
                  <h1 className="modal-product-title">
                    {editFields['product_name'] ? (
                      <input
                        type="text"
                        value={editedValues['product_name'] || ''}
                        onChange={(e) => handleChange(e, 'product_name')}
                        onBlur={() => handleBlur('product_name')}
                        autoFocus
                        disabled={loading}
                      />
                    ) : (
                      selectedProduct.name
                    )}
                  </h1>
                  {enableEdit &&
                    !editFields['product_name'] &&
                    editFields.hoverName && (
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit('product_name')}
                      >
                        Chỉnh sửa
                      </button>
                    )}
                </div>
                <div
                  className="editable-field"
                  onMouseEnter={() =>
                    enableEdit &&
                    !editFields['product_price'] &&
                    setEditFields((prev) => ({ ...prev, hoverPrice: true }))
                  }
                  onMouseLeave={() =>
                    enableEdit &&
                    !editFields['product_price'] &&
                    setEditFields((prev) => ({ ...prev, hoverPrice: false }))
                  }
                >
                  <div className="business-status">
                    <span className="modal-product-price">
                      {editFields['product_price'] ? (
                        <input
                          type="text"
                          value={
                            editedValues['product_price'].replace(' VND', '') || ''
                          }
                          onChange={(e) => handleChange(e, 'product_price')}
                          onBlur={() => handleBlur('product_price')}
                          autoFocus
                          disabled={loading}
                        />
                      ) : (
                        `${selectedProduct.price} VND`
                      )}
                    </span>
                  </div>
                  {enableEdit &&
                    !editFields['product_price'] &&
                    editFields.hoverPrice && (
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit('product_price')}
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
                <div
                  className="editable-field"
                  onMouseEnter={() =>
                    enableEdit &&
                    !editFields['product_description'] &&
                    setEditFields((prev) => ({
                      ...prev,
                      hoverDescription: true,
                    }))
                  }
                  onMouseLeave={() =>
                    enableEdit &&
                    !editFields['product_description'] &&
                    setEditFields((prev) => ({
                      ...prev,
                      hoverDescription: false,
                    }))
                  }
                >
                  <p className="business-description">
                    {editFields['product_description'] ? (
                      <textarea
                        value={editedValues['product_description'] || ''}
                        onChange={(e) => handleChange(e, 'product_description')}
                        onBlur={() => handleBlur('product_description')}
                        autoFocus
                        disabled={loading}
                      />
                    ) : (
                      selectedProduct.description
                    )}
                  </p>
                  {enableEdit &&
                    !editFields['product_description'] &&
                    editFields.hoverDescription && (
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit('product_description')}
                      >
                        Chỉnh sửa
                      </button>
                    )}
                </div>
              </div>
            </div>

            <MyBusinessProductFeedback
              productId={selectedProduct.id}
              businessId={businessId}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export default BusinessProductModal;
