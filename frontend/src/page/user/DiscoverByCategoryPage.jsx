import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import FilterSidebar from '../../components/FilterSidebar';
import LoadingScreen from '../../components/LoadingScreen';
import '../../css/DiscoverByCategoryPage.css';

function DiscoverByCategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState(location.state?.category_id || null);
  const [categoryName, setCategoryName] = useState(location.state?.category_name || null);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    distance: 50,
    price: {
      cheapest: false,
      mostExpensive: false,
      opening: false,
    },
    rating: {
      lowest: false,
      highest: false,
      fourStars: false,
      fiveStars: false,
    },
  });

  // Navigate back if no category
  useEffect(() => {
    if (!categoryId) {
      navigate('/discover');
    }
  }, [categoryId, navigate]);

  // Fetch businesses by distance and category
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!categoryId) return;

      setLoading(true);
      setError(null);

      try {
        const storedLocation = JSON.parse(localStorage.getItem('userLocation'));
        if (!storedLocation?.latitude || !storedLocation?.longitude) {
          throw new Error('Không tìm thấy vị trí người dùng trong localStorage');
        }

        const { latitude, longitude } = storedLocation;

        const response = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/business/near`,
          {
            params: {
              latitude,
              longitude,
              maxDistance: filters.distance * 1000, // convert km to meters
            },
            timeout: 10000,
          }
        );

        if (Array.isArray(response.data)) {
          const filtered = response.data.filter(
            (b) => b.business_category_id?._id === categoryId
          );

          const enriched = filtered.map((b) => ({
            ...b,
            price: b.business_stack_id?.stack_price
              ? parseFloat(b.business_stack_id.stack_price)
              : 50000,
            rating: b.business_rating ?? 0,
            status: b.business_status ? 'Đang mở cửa' : 'Đã đóng cửa',
          }));

          setBusinesses(enriched);
        } else {
          throw new Error(`Unexpected response format: ${JSON.stringify(response.data)}`);
        }
      } catch (err) {
        console.error('Fetch error:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [categoryId, filters.distance]);

  // Local filtering for price and rating
  const filteredBusinesses = businesses.filter((b) => {
    const { price, rating, status } = b;

    const { cheapest, mostExpensive, opening } = filters.price;
    const { lowest, highest, fourStars, fiveStars } = filters.rating;

    let pricePass =
      (!cheapest || price <= 50000) &&
      (!mostExpensive || price >= 50000) &&
      (!opening || status === 'Đang mở cửa');

    let ratingPass =
      (!lowest || rating <= 2) &&
      (!highest || rating >= 4) &&
      (!fourStars || rating >= 4) &&
      (!fiveStars || rating >= 5);

    return pricePass && ratingPass;
  });

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  if (loading) {
    return (
      <>
        <Header />
        <HeroSection />
        <div className="discover-by-category-page">
          <FilterSidebar filters={filters} handleFilterChange={handleFilterChange} />
          <div className="main-content">
            <h1>
              Danh sách <span className="place-header">{categoryName || '...'}</span>
            </h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-message">Error: {error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <HeroSection />

      <div className="discover-by-category-page">
        <FilterSidebar filters={filters} handleFilterChange={handleFilterChange} />

        <div className="main-content">
          <h1>
            Danh sách <span className="place-header">{categoryName || '...'}</span>
          </h1>

          <div className="place-grid">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((b) => (
                <div
                  key={b._id}
                  className="place-card"
                  onClick={() => navigate(`/business/${b._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="place-image">
                    <img
                      src={b.business_image?.[0] || '/placeholder.jpg'}
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
