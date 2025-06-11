import React, { useState, useEffect } from 'react';
import '../../css/LandingPage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen';


const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState({
    topBusinesses: [],
    categories: [],
    stats: {
      totalBusinesses: 0,
      activeBusinesses: 0,
      totalCategories: 0,
      totalProducts: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/home');
        setPageData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: '💳',
      title: 'Ultimate flexibility',
      description: "You're in control, with free cancellation and payment."
    },
    {
      icon: '🎯',
      title: 'Memorable experiences',
      description: 'Browse and book tours and activities so incredible.'
    },
    {
      icon: '💎',
      title: 'Quality at our core',
      description: 'High quality standards. Millions of reviews.'
    }
  ];

  if (loading) {
    return (
      <>
        <Header />
        <LoadingScreen />
        <Footer />
      </>
    )
  }

  if (error) {
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
      <div className="landing-page">
        <HeroSection />

        {/* Best Places Section */}
        <section className="best-places-section">
          <div className="container">
            <h2>Best of <span className="highlight">Hoa Lac</span></h2>
            <div className="places-grid">
              {pageData.topBusinesses.map((place, index) => (
                <div key={index} className="place-card" onClick={() => navigate('/business')} style={{ cursor: 'pointer' }}>
                  <div className="place-image">
                    <img src={place.images[0] || '1.png'} alt={place.name} />
                    <button className="favorite-btn">❤️</button>
                  </div>
                  <div className="place-info">
                    <h3>{place.name}</h3>
                    <p className="place-location">{place.location}</p>
                    <div className="place-meta">
                      <span className="status">{place.status}</span>
                      <span className="rating">⭐ {place.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <div className="services-grid">
              {pageData.categories.map((category, index) => (
                <div key={index} className="service-card" style={{ background: `linear-gradient(135deg, ${getRandomGradient(index)})` }}>
                  <div className="service-content">
                    <h3>{category.name}</h3>
                    <p className="service-description">{category.description}</p>
                    <button className="service-btn">Xem thêm</button>
                  </div>
                  <div className="service-image">
                    <img src={category.image || '1.png'} alt={category.name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="why-choose-section">
          <div className="container">
            <div className="why-choose-content">
              <div className="why-choose-left">
                <h2>Why choose <span className="highlight">Tourz</span></h2>
                <div className="features-list">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">{feature.icon}</div>
                      <div className="feature-content">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="why-choose-right">
                <img src="1.png" alt="Hot air balloons" className="choose-image" />
              </div>
            </div>

            <div className="stats-section">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">📍</div>
                  <div className="stat-number">{pageData.stats.totalBusinesses}</div>
                  <div className="stat-label">Total Businesses</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🔗</div>
                  <div className="stat-number">{pageData.stats.activeBusinesses}</div>
                  <div className="stat-label">Active Businesses</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">👤</div>
                  <div className="stat-number">{pageData.stats.totalCategories}</div>
                  <div className="stat-label">Categories</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🤝</div>
                  <div className="stat-number">{pageData.stats.totalProducts}</div>
                  <div className="stat-label">Total Products</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

// Helper function to generate random gradients
const getRandomGradient = (index) => {
  const gradients = [
    '#667eea 0%, #764ba2 100%',
    '#f093fb 0%, #f5576c 100%',
    '#4facfe 0%, #00f2fe 100%'
  ];
  return gradients[index % gradients.length];
};

export default LandingPage;