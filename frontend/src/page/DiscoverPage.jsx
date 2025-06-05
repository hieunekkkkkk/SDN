import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import '../css/DiscoverPage.css';
import { PuffLoader } from 'react-spinners';

function DiscoverPage() {
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch categories and businesses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryResponse = await axios.get(`${import.meta.env.VITE_BE_URL}/api/category`);
        if (categoryResponse.data.status === 'success') {
          setCategories(categoryResponse.data.data);
        } else {
          throw new Error('Failed to fetch categories');
        }

        const businessResponse = await axios.get(`${import.meta.env.VITE_BE_URL}/api/business`);
        if (Array.isArray(businessResponse.data)) {
          setBusinesses(businessResponse.data);
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
  }, []);

  const filteredBusinesses = category === 'All'
    ? businesses
    : businesses.filter(b => b.business_category === category);

  const handleSeeMore = (categoryName, categoryId) => {
  const slug = categoryName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');

  navigate(`/discover/${slug}`, {
    state: {
      category_id: categoryId,
      category_name: categoryName,
    },
  });
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
    )
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

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
                  .slice(0, 3) // 👈 limit to 3 businesses per category
                  .map((business) => (
                    <div
                      key={business.business_id}
                      className="discover-place-card"
                      onClick={() => window.location.href = '/business'}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="discover-place-image">
                        <img
                          src={business.business_image[0] || 'placeholder.jpg'}
                          alt={business.business_name}
                        />
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
                <button className="see-more-btn" onClick={() => handleSeeMore(cat.category_name, cat.category_id)}>
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