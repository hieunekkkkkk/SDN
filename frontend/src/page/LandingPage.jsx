import React, { useState } from 'react';
import '../css/LandingPage.css';
import Header from '../components/header';
import Footer from '../components/footer';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const categories = [
    { icon: '🏠', name: 'Nhà trọ' },
    { icon: '🍜', name: 'Quán ăn' },
    { icon: '🛒', name: 'Siêu thị' },
    { icon: '💊', name: 'Nhà thuốc' }
  ];

  const bestPlaces = [
    {
      title: 'Molokini and Turtle Town Snorkeling Adventure Aboard',
      location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
      status: 'Đang mở cửa',
      image: '1.png',
      rating: 4.8
    },
    {
      title: 'All Inclusive Ultimate Circle Island Day Tour with Lunch',
      location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
      status: 'Đang mở cửa',
      image: '1.png',
      rating: 4.9
    },
    {
      title: 'Clear Kayak Tour of Shell Key Preserve and Tampa Bay Area',
      location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
      status: 'Đang mở cửa',
      image: '1.png',
      rating: 4.7
    },
    {
      title: 'Mauna Kea Summit Sunset and Stars Free Astro Photos Hilo...',
      location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
      status: 'Đang mở cửa',
      image: '1.png',
      rating: 4.6
    }
  ];

  const services = [
    {
      title: 'Gợi ý hàng đầu cho các thực khách',
      subtitle: 'Những món ăn ngon nhất',
      description: 'Các mặt hàng đa dạng, Hệ thống siêu thị vô cùng tiện lợi',
      action: 'Xem thêm',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image: '1.png'
    },
    {
      title: 'Hệ thống siêu thị vô cùng tiện lợi',
      subtitle: 'Các mặt hàng đa dạng',
      description: 'Hệ thống siêu thị vô cùng tiện lợi',
      action: 'Xem thêm',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      image: '1.png'
    },
    {
      title: 'Tiết lộ những nơi ở tiện nghi',
      subtitle: 'Những căn phòng chỉ',
      description: 'Tiết lộ những nơi ở tiện nghi',
      action: 'Xem thêm',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      image: '1.png'
    }
  ];

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

  const stats = [
    { number: '932M', label: 'Total Donations' },
    { number: '24M', label: 'Campaigns Closed' },
    { number: '10M', label: 'Happy People' },
    { number: '65M', label: 'Our Volunteers' }
  ];

  const testimonials = [
    {
      text: 'I think Educraft is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance',
      author: 'Courtney Henry',
      role: 'Web Designer',
      avatar: '1.png'
    },
    {
      text: 'I think Educraft is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance',
      author: 'Courtney Henry',
      role: 'Web Designer',
      avatar: '1.png'
    },
    {
      text: 'I think Educraft is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance',
      author: 'Courtney Henry',
      role: 'Web Designer',
      avatar: '1.png'
    }
  ];

  return (
    <div className="landing-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src="1.png" alt="Mountains" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Lựa chọn điểm đến lý tưởng ở gần bạn</h1>
            <p>Cùng cập mới thông tin hữu ích</p>
          </div>

          <div className="search-form">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-btn">🔍</button>
            </div>
          </div>

          <div className="category-pills">
            <p>Đã đăng theo mục điều</p>
            <div className="pills-container">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-pill ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span className="pill-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Places Section */}
      <section className="best-places-section">
        <div className="container">
          <h2>Best of <span className="highlight">Hoa Lac</span></h2>
          <div className="places-grid">
            {bestPlaces.map((place, index) => (
              <div key={index} className="place-card" onClick={() => window.location.href = '/business'} style={{ cursor: 'pointer' }}>
                <div className="place-image">
                  <img src={place.image} alt={place.title} />
                  <button className="favorite-btn">❤️</button>
                </div>
                <div className="place-info">
                  <h3>{place.title}</h3>
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
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{ background: service.background }}>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p className="service-subtitle">{service.subtitle}</p>
                <p className="service-description">{service.description}</p>
                <button className="service-btn">{service.action}</button>
              </div>
              <div className="service-image">
                <img src={service.image} alt={service.title} />
              </div>
            </div>
          ))}
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
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">
                    {index === 0 && '📍'}
                    {index === 1 && '🔗'}
                    {index === 2 && '👤'}
                    {index === 3 && '🤝'}
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-section">
        <div className="container">
          <h2>Feedback</h2>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <span className="testimonial-rating">Great Work</span>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.author} />
                  <div>
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="feedback-stats">
            <div className="feedback-stat">
              <h3>4.9</h3>
              <p>1000+ reviews on TripAdvisor, Certificate of Excellence</p>
            </div>
            <div className="feedback-stat">
              <h3>16M</h3>
              <p>Happy Customers</p>
            </div>
            <div className="feedback-stat">
              <h3>Award winner</h3>
              <p>G2's 2021 Best Software Awards</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;