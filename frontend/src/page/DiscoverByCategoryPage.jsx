import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import '../css/DiscoverByCategoryPage.css';
import { PuffLoader } from 'react-spinners';
import FilterSidebar from '../components/FilterSidebar';

function DiscoverByCategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState(location.state?.category_id || null);
  const [categoryName, setCategoryName] = useState(location.state?.category_name || null);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    distance: 15,
    price: 100,
    rating: 0,
  });

  useEffect(() => {
    if (!categoryId) {
      navigate('/discover');
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/business/category/${categoryId}`
        );
        if (!Array.isArray(response.data)) {
          throw new Error('Unexpected response format – expected an array');
        }

        const enriched = response.data.map((b) => ({
          ...b,
          distance: b.distance ?? 5,
          price: b.price ?? 50,
          rating: b.business_rating ?? 0,
          status: b.business_status ? 'Đang mở cửa' : 'Đã đóng cửa',
        }));

        setBusinesses(enriched);
      } catch (err) {
        console.error('Fetch error in DiscoverByCategoryPage:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const filteredBusinesses = businesses.filter((b) => {
    return (
      b.distance <= filters.distance &&
      b.price <= filters.price &&
      b.rating >= filters.rating
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <PuffLoader size={90} />
        <p style={{ marginTop: '16px', fontSize: '18px', color: '#333' }}>
          Đang tải...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'red',
        }}
      >
        <h2>Có lỗi xảy ra:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <HeroSection />

      <div className="discover-by-category-page">
        <FilterSidebar filters = {filters} handleFilterChange = {handleFilterChange}/>

        <div className="main-content">
          <h1>
            Danh sách <span className="place-header">{categoryName || '...'}</span>
          </h1>
          <div className="place-grid">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((b) => (
                <div key={b._id || b.business_id} className="place-card">
                  <div className="place-image">
                    <img
                      src={b.business_image?.[0] || 'placeholder.jpg'}
                      alt={b.business_name}
                    />
                  </div>
                  <div className="place-info">
                    <h3>{b.business_name}</h3>
                    <p>{b.business_address}</p>
                    <div className="place-meta">
                      <span className="place-status">{b.status}</span>
                      <span className="place-rating">⭐ {b.rating}</span>
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
