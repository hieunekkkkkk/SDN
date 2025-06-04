import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import '../css/DiscoverPage.css';

function DiscoverPage() {
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const categories = [
    { category_id: '1a2b3c4d-1111-1111-1111-abcdef123456', category_name: 'coffee', icon: 'FaCoffee' },
  ];

  // Simulated businesses
  const businesses = [
    {
      business_id: 'b1f4b5b1-a1e2-4450-91c1-001',
      owner_id: 'owner-001',
      business_name: 'Coffee House A',
      business_address: '101 Coffee St',
      business_location: {},
      business_category: 'coffee',
      business_category_id: '1a2b3c4d-1111-1111-1111-abcdef123456',
      business_detail: 'Great espresso.',
      business_time: {},
      business_phone: '0123456781',
      business_status: true,
      business_rating: 4.2,
      business_view: 321,
      business_image: ['coffee1.jpg'],
      business_product: 5,
      business_active: true,
    },
    {
      business_id: 'b1f4b5b1-a1e2-4450-91c1-002',
      owner_id: 'owner-002',
      business_name: 'Coffee Garden B',
      business_address: '102 Garden Ave',
      business_location: {},
      business_category: 'coffee',
      business_category_id: '1a2b3c4d-1111-1111-1111-abcdef123456',
      business_detail: 'Peaceful garden cafe.',
      business_time: {},
      business_phone: '0123456782',
      business_status: true,
      business_rating: 4.5,
      business_view: 210,
      business_image: ['coffee2.jpg'],
      business_product: 3,
      business_active: true,
    },
    // Add more business entries if needed
  ];

  // Filter businesses by category if selected
  const filteredBusinesses = category === 'All'
    ? businesses
    : businesses.filter(b => b.business_category === category);

  const handleSeeMore = (categoryName) => {
    const normalized = categoryName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
    navigate(`/discover/${normalized}`);
  };

  return (
    <>
      <Header />
      <HeroSection />

      <div className="discover-page">
        <div className="container">
          {categories.map((cat) => (
            <section key={cat.category_id} className="discover-recommended-section">
              <h2 className="discover-recommended-title">{cat.category_name}</h2>
              <div className="discover-places-grid">
                {filteredBusinesses
                  .filter(b => b.business_category_id === cat.category_id)
                  .map((business) => (
                    <div
                      key={business.business_id}
                      className="discover-place-card"
                      onClick={() => window.location.href = '/business'}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="discover-place-image">
                        <img src={business.business_image[0]} alt={business.business_name} />
                      </div>
                      <div className="discover-place-info">
                        <h3>{business.business_name}</h3>
                        <p className="discover-place-location">{business.business_address}</p>
                        <div className="discover-place-meta">
                          <span className="discover-status">
                            {business.business_status ? 'Đang mở cửa' : 'Đã đóng cửa'}
                          </span>
                          <span className="discover-rating">⭐ {business.business_rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="see-more-container">
                <button className="see-more-btn" onClick={() => handleSeeMore(cat.category_name)}>
                  Xem thêm
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default DiscoverPage;
