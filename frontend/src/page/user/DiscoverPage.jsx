import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import LoadingScreen from '../../components/LoadingScreen';
import '../../css/DiscoverPage.css';

function DiscoverPage() {
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('VITE_BE_URL:', import.meta.env.VITE_BE_URL);
        console.log('Category API URL:', `${import.meta.env.VITE_BE_URL}/api/category`);

        // Fetch categories
        const categoryResponse = await axios.get(`${import.meta.env.VITE_BE_URL}/api/category`, {
          timeout: 10000,
        });
        console.log('Category Response:', categoryResponse.data);
        if (categoryResponse.data.categories && Array.isArray(categoryResponse.data.categories)) {
          setCategories(categoryResponse.data.categories);
        } else {
          throw new Error(`Unexpected category response format: ${JSON.stringify(categoryResponse.data)}`);
        }

        // Fetch businesses
        console.log('Business API URL:', `${import.meta.env.VITE_BE_URL}/api/business`);
        const businessResponse = await axios.get(`${import.meta.env.VITE_BE_URL}/api/business`, {
          timeout: 10000,
        });
        console.log('Business Response:', businessResponse.data);
        if (businessResponse.data.businesses && Array.isArray(businessResponse.data.businesses)) {
          setBusinesses(businessResponse.data.businesses);
        } else {
          throw new Error(`Unexpected business response format: ${JSON.stringify(businessResponse.data)}`);
        }
      } catch (err) {
        console.error('Fetch error details:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message || err.message : 'An error occurred while fetching data');
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
      <>
        <Header />
        <LoadingScreen />
        <Footer />
      </>
    )
  }

  if (error || categories.length === 0) {
    return (
      <>
        <Header />
        <LoadingScreen />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <HeroSection />

      <div className="discover-page">
        <div className="container">
          {categories.map((cat) => (
            <section key={cat._id} className="discover-recommended-section">
              <h2 className="discover-recommended-title">{cat.category_name}</h2>
              <div className="discover-places-grid">
                {businesses // Use businesses directly, filter by category ID
                  .filter(b => b.business_category_id._id === cat._id)
                  .slice(0, 3) // Limit to 3 businesses per category
                  .map((business) => (
                    <div
                      key={business._id} // Use _id instead of business_id
                      className="discover-place-card"
                      onClick={() => navigate(`/business/${business._id}`)} // Dynamic routing
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="discover-place-image">
                        <img
                          src={business.business_image[0] || '/placeholder.jpg'} // Ensure valid path
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
                <button
                  className="see-more-btn"
                  onClick={() => handleSeeMore(cat.category_name, cat._id)}
                >
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