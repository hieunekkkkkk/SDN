import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import '../css/DiscoverByCategoryPage.css';
import { PuffLoader } from 'react-spinners';

function DiscoverByCategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState(location.state?.category_id || null);
  const [categoryName, setCategoryName] = useState(location.state?.category_name || null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    distance: 0,
    price: 0,
    rating: 0,
  });

  // Fallback: fetch category info by slug if not passed via state
  useEffect(() => {
    if (!categoryId) {
      navigate('/discover');
    }
  }, [categoryId, navigate]);

  // Fetch businesses once categoryId is resolved
  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api/business`);
        if (Array.isArray(response.data)) {
          const enriched = response.data.map((b) => ({
            ...b,
            distance: b.distance || 5,
            price: b.price || 50,
            rating: b.business_rating || 0,
            status: b.business_status ? 'Đang mở cửa' : 'Đã đóng cửa',
          }));

          const filteredByCategory = enriched.filter(b => b.business_category_id === categoryId);
          setBusinesses(filteredByCategory);
        } else {
          throw new Error('Unexpected business response format');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const filteredBusinesses = businesses.filter((b) => {
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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <PuffLoader size={90} />
        <p style={{ marginTop: '16px', fontSize: '18px', color: '#333' }}></p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <HeroSection />

      <div className="discover-by-category-page">
        <div className="sidebar">
          <p className="filter-section-header">Hãy lựa chọn yêu cầu của bạn:</p>
          <div className="filter-section">
            <h4>Vị trí</h4>
            {[5, 10, 15].map((d) => (
              <label key={d}>
                <input type="checkbox" onChange={() => handleFilterChange('distance', d)} />
                0 - {d} km
              </label>
            ))}
          </div>
          <div className="filter-section">
            <h4>Giá tiền</h4>
            {[50, 75, 100].map((p) => (
              <label key={p}>
                <input type="checkbox" onChange={() => handleFilterChange('price', p)} />
                0 - ${p}
              </label>
            ))}
          </div>
          <div className="filter-section">
            <h4>Đánh giá</h4>
            {[4.0, 4.5, 5.0].map((r) => (
              <label key={r}>
                <input type="checkbox" onChange={() => handleFilterChange('rating', r)} />
                {r} ★
              </label>
            ))}
          </div>
        </div>

        <div className="main-content">
          <h1>Danh sách <span className='place-header'>{categoryName}</span></h1>
          <div className="place-grid">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((b) => (
                <div key={b.business_id} className="place-card">
                  <div className="place-image">
                    <img src={b.business_image[0] || 'placeholder.jpg'} alt={b.business_name} />
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
