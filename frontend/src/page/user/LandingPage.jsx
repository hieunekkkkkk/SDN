import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/LandingPage.css';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import LoadingScreen from '../../components/LoadingScreen';

function LandingPage() {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // Load data từ API khi component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API để lấy dữ liệu
      const [businessesResponse, categoriesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BE_URL}/api/business`),
        axios.get(`${import.meta.env.VITE_BE_URL}/api/category`)
      ]);

      // Xử lý response từ businesses API
      if (businessesResponse.data && businessesResponse.data.businesses) {
        setBusinesses(businessesResponse.data.businesses);
      } else if (Array.isArray(businessesResponse.data)) {
        setBusinesses(businessesResponse.data);
      } else {
        setBusinesses([]);
      }

      // Xử lý response từ categories API
      if (categoriesResponse.data && categoriesResponse.data.categories) {
        setCategories(categoriesResponse.data.categories);
      } else if (Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      } else {
        setCategories([]);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      
      // Fallback to empty arrays if API fails
      setBusinesses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? 'all' : categoryId);
  };

  const getFilteredBusinesses = () => {
    if (selectedCategory === 'all') {
      return businesses;
    }
    return businesses.filter(business => 
      business.business_category_id === selectedCategory
    );
  };

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
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>{error}</p>
        <button onClick={loadInitialData} className="btn">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      
      <div className="landing-page2">
        <div className="container">
          {/* Category Filter Section */}
          <section className="category-filter-section">
            <div className="category-filter-container">
              <h2 className="category-filter-title">Khám phá theo danh mục</h2>
              <p className="category-filter-subtitle">
                Chọn danh mục để tìm kiếm địa điểm phù hợp với nhu cầu của bạn
              </p>
              
              <div className="category-filter-options">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`category-filter-button ${selectedCategory === 'all' ? 'category-active' : ''}`}
                >
                  Tất cả
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className={`category-filter-button ${selectedCategory === category._id ? 'category-active' : ''}`}
                  >
                    <span className="category-icon">{category.icon || '📍'}</span>
                    {category.category_name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Best Places Section */}
          <section className="best-places-section">
            <h2>
              Khám phá những địa điểm <span className="highlight">phổ biến</span> gần bạn
            </h2>
            
            <div className="places-grid">
              {getFilteredBusinesses().slice(0, 8).map((business) => (
                <PlaceCard 
                  key={business._id} 
                  business={business} 
                  onClick={() => navigate('/business')}
                />
              ))}
            </div>
            
            {getFilteredBusinesses().length === 0 && (
              <div className="no-results">
                <p>Không tìm thấy địa điểm nào trong danh mục này.</p>
              </div>
            )}
          </section>

          {/* Services Grid */}
          <section className="services-section">
            <h2>Dịch vụ nổi bật</h2>
            <div className="services-grid">
              {categories.slice(0, 4).map((category) => (
                <ServiceCard 
                  key={category._id} 
                  category={category} 
                  businesses={businesses}
                  onSeeMore={() => handleSeeMore(category.category_name, category._id)}
                />
              ))}
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="why-choose-section">
            <div className="why-choose-content">
              <div className="why-choose-left">
                <h2>Tại sao chọn LocalLink?</h2>
                <div className="features-list">
                  <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <div className="feature-content">
                      <h3>Tìm kiếm chính xác</h3>
                      <p>Định vị chính xác các địa điểm gần bạn với thông tin cập nhật realtime.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">⭐</div>
                    <div className="feature-content">
                      <h3>Đánh giá tin cậy</h3>
                      <p>Hệ thống đánh giá từ người dùng thực giúp bạn lựa chọn tốt nhất.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🚀</div>
                    <div className="feature-content">
                      <h3>Trải nghiệm mượt mà</h3>
                      <p>Giao diện thân thiện, tìm kiếm nhanh chóng và dễ sử dụng.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="why-choose-right">
                <img src="/1.png" alt="Why choose us" className="choose-image" />
              </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">🏢</div>
                  <h3>{businesses.length}+</h3>
                  <p>Doanh nghiệp</p>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">📍</div>
                  <h3>{categories.length}+</h3>
                  <p>Danh mục</p>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <h3>1000+</h3>
                  <p>Người dùng</p>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⭐</div>
                  <h3>4.8</h3>
                  <p>Đánh giá trung bình</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="feedback-section">
            <h2>Phản hồi từ người dùng</h2>
            
            <div className="testimonials-grid">
              <TestimonialCard
                rating={5}
                text="LocalLink giúp tôi tìm được quán cà phê yêu thích chỉ trong vài phút. Rất tiện lợi!"
                author={{
                  name: "Nguyễn Văn A",
                  role: "Khách hàng thường xuyên",
                  avatar: "/avatar1.jpg"
                }}
              />
              <TestimonialCard
                rating={5}
                text="Thông tin luôn chính xác và cập nhật. Tôi không bao giờ lo lắng về việc tìm địa điểm nữa."
                author={{
                  name: "Trần Thị B",
                  role: "Du khách",
                  avatar: "/avatar2.jpg"
                }}
              />
              <TestimonialCard
                rating={4}
                text="Giao diện đẹp, dễ sử dụng. Đặc biệt thích tính năng lọc theo khoảng cách."
                author={{
                  name: "Lê Văn C",
                  role: "Người địa phương",
                  avatar: "/avatar3.jpg"
                }}
              />
            </div>

            <div className="feedback-stats">
              <div className="feedback-stat">
                <h3>4.8/5</h3>
                <p>Điểm đánh giá trung bình từ hơn 1000 người dùng</p>
              </div>
              <div className="feedback-stat">
                <h3>95%</h3>
                <p>Người dùng hài lòng với dịch vụ</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

// Component PlaceCard
function PlaceCard({ business, onClick }) {
  const businessName = business.business_name || 'Tên không có';
  const businessAddress = business.business_address || 'Địa chỉ không có';
  const businessStatus = business.business_status;
  const businessImage = business.business_image;
  const businessRating = business.business_rating || 0;

  const getStatusText = (status) => {
    return status ? 'Đang mở cửa' : 'Đã đóng cửa';
  };

  const getStatusClass = (status) => {
    return status ? 'status-open' : 'status-closed';
  };

  let imageUrl = '/1.png';
  if (businessImage && Array.isArray(businessImage) && businessImage.length > 0) {
    imageUrl = businessImage[0];
  }

  return (
    <div className="place-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="place-image">
        <img 
          src={imageUrl} 
          alt={businessName}
          onError={(e) => {
            e.target.src = '/1.png';
          }}
        />
        <button className="favorite-btn">❤️</button>
      </div>
      <div className="place-info">
        <h3>{businessName}</h3>
        <p className="place-location">{businessAddress}</p>
        <div className="place-meta">
          <span className={`status ${getStatusClass(businessStatus)}`}>
            {getStatusText(businessStatus)}
          </span>
          <span className="rating">⭐ {businessRating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

// Component ServiceCard
function ServiceCard({ category, businesses, onSeeMore }) {
  const categoryBusinesses = businesses.filter(b => 
    b.business_category_id === category._id
  );

  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="service-card" style={{ background: randomColor }}>
      <div className="service-content">
        <h3>{category.category_name}</h3>
        <p className="service-subtitle">{categoryBusinesses.length} địa điểm</p>
        <p className="service-description">
          Khám phá các {category.category_name.toLowerCase()} tốt nhất trong khu vực
        </p>
        <button className="service-btn" onClick={onSeeMore}>
          Xem thêm
        </button>
      </div>
      <div className="service-image">
        <span style={{ fontSize: '3rem' }}>{category.icon || '📍'}</span>
      </div>
    </div>
  );
}

// Component TestimonialCard
function TestimonialCard({ rating, text, author }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <div className="testimonial-rating">
          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </div>
      </div>
      <p className="testimonial-text">"{text}"</p>
      <div className="testimonial-author">
        <img 
          src={author.avatar} 
          alt={author.name}
          onError={(e) => {
            e.target.src = '/1.png';
          }}
        />
        <div>
          <h4>{author.name}</h4>
          <p>{author.role}</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;