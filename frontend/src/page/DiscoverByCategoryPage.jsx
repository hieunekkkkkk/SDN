import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import '../css/DiscoverByCategoryPage.css';

function DiscoverByCategoryPage() {
  const { category } = useParams();

  const categories = [
    { category_id: '1a2b3c4d-1111-1111-1111-abcdef123456', category_name: 'coffee' },
    { category_id: '2b3c4d5e-2222-2222-2222-fedcba654321', category_name: 'restaurant' },
  ];

  const businesses = [
    {
      business_id: 'b1f4b5b1-a1e2-4450-91c1-001',
      business_name: 'Coffee House A',
      business_address: '101 Coffee St',
      business_image: ['coffee1.jpg'],
      business_rating: 4.2,
      business_status: true,
      distance: 5,
      price: 40,
      rating: 4.2,
      location: 'Hanoi',
      status: 'Đang mở cửa',
      business_category_id: '1a2b3c4d-1111-1111-1111-abcdef123456',
    },
    {
      business_id: 'b1f4b5b1-a1e2-4450-91c1-002',
      business_name: 'Coffee Garden B',
      business_address: '102 Garden Ave',
      business_image: ['coffee2.jpg'],
      business_rating: 4.5,
      business_status: true,
      distance: 8,
      price: 60,
      rating: 4.5,
      location: 'Hanoi',
      status: 'Đang mở cửa',
      business_category_id: '1a2b3c4d-1111-1111-1111-abcdef123456',
    },
    {
      business_id: 'b2f4b5b1-a1e2-4450-91c1-003',
      business_name: 'Phở Việt',
      business_address: '123 Main St',
      business_image: ['pho.jpg'],
      business_rating: 5.0,
      business_status: true,
      distance: 3,
      price: 30,
      rating: 5.0,
      location: 'Hanoi',
      status: 'Đang mở cửa',
      business_category_id: '2b3c4d5e-2222-2222-2222-fedcba654321',
    },
  ];

  const slugToCategoryName = (slug) =>
    slug
      .replace(/-/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const normalizedSlug = slugToCategoryName(category);

  const matchedCategory = categories.find(
    (c) => c.category_name.toLowerCase() === normalizedSlug
  );

  const categoryBusinesses = matchedCategory
    ? businesses.filter((b) => b.business_category_id === matchedCategory.category_id)
    : [];

  const [filters, setFilters] = useState({
    distance: 0,
    price: 0,
    rating: 0,
  });

  const filteredBusinesses = categoryBusinesses.filter((b) => {
    return (
      (filters.distance === 0 || b.distance <= filters.distance) &&
      (filters.price === 0 || b.price <= filters.price) &&
      (filters.rating === 0 || b.rating >= filters.rating)
    );
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <>
      <Header />
      <HeroSection />

      <div className="discover-by-category-page">
        <div className="sidebar">
          <p className='filter-section-header'>Hãy lựa chọn yêu cầu của bạn:</p>
          <div className="filter-section">
            <h4>Vị trí</h4>
            {[5, 10, 15].map((d) => (
              <label key={d}>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange('distance', d)}
                />
                0 - {d} km
              </label>
            ))}
          </div>
          <div className="filter-section">
            <h4>Giá tiền</h4>
            {[50, 75, 100].map((p) => (
              <label key={p}>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange('price', p)}
                />
                0 - ${p}
              </label>
            ))}
          </div>
          <div className="filter-section">
            <h4>Đánh giá</h4>
            {[4.0, 4.5, 5.0].map((r) => (
              <label key={r}>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange('rating', r)}
                />
                {r} ★
              </label>
            ))}
          </div>
        </div>

        <div className="main-content">
          <h1>Danh sách {matchedCategory?.category_name || category}</h1>
          <div className="place-grid">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((b) => (
                <div key={b.business_id} className="place-card">
                  <div className="place-image">
                    <img src={b.business_image[0]} alt={b.business_name} />
                  </div>
                  <div className="place-info">
                    <h3>{b.business_name}</h3>
                    <p>{b.business_address}</p>
                    <div className="place-meta">
                      <span className="place-status">{b.status}</span>
                      <span className="place-rating">⭐ {b.business_rating}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có địa điểm nào phù hợp.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default DiscoverByCategoryPage;
