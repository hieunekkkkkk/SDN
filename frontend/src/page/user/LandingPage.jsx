import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/LandingPage.css';
import Footer from '../../components/Footer';
import LoadingScreen from '../../components/LoadingScreen';
import Header from '../../components/Header';

function LandingPage() {
  const [businesses, setBusinesses] = useState([]);
  const [bestBusinesses, setBestBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentFeedbackPage, setCurrentFeedbackPage] = useState(0);
  const [currentServicePage, setCurrentServicePage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalCategories: 0,
    totalFeedbacks: 0,
    averageRating: 4.8
  });
  const navigate = useNavigate();

  // Memoize filtered businesses để tránh re-calculation
  const filteredBusinesses = useMemo(() => {
    if (selectedCategory === 'all') {
      return bestBusinesses;
    }
    return bestBusinesses.filter(business => 
      business.business_category_id?._id === selectedCategory
    );
  }, [bestBusinesses, selectedCategory]);

  // Load data từ API khi component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sử dụng Promise.allSettled để không bị fail khi một API lỗi
      const results = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_BE_URL}/api/business?limit=50`),
        axios.get(`${import.meta.env.VITE_BE_URL}/api/business/rating?page=1&limit=8`),
        axios.get(`${import.meta.env.VITE_BE_URL}/api/category`),
        axios.get(`${import.meta.env.VITE_BE_URL}/api/feedback`)
      ]);

      const [businessesResult, bestBusinessesResult, categoriesResult, feedbacksResult] = results;

      // Xử lý kết quả businesses
      if (businessesResult.status === 'fulfilled') {
        const data = businessesResult.value.data;
        const businessData = data?.businesses || data || [];
        setBusinesses(businessData);
        
        // Cập nhật stats từ businesses
        setStats(prev => ({
          ...prev,
          totalBusinesses: businessData.length
        }));
      } else {
        console.warn('Failed to load businesses:', businessesResult.reason);
      }

      // Xử lý kết quả best businesses
      if (bestBusinessesResult.status === 'fulfilled') {
        const data = bestBusinessesResult.value.data;
        setBestBusinesses(data?.businesses || data || []);
      } else {
        console.warn('Failed to load best businesses:', bestBusinessesResult.reason);
      }

      // Xử lý kết quả categories
      if (categoriesResult.status === 'fulfilled') {
        const data = categoriesResult.value.data;
        const categoryData = data?.categories || data || [];
        setCategories(categoryData);
        
        // Cập nhật stats từ categories
        setStats(prev => ({
          ...prev,
          totalCategories: categoryData.length
        }));
      } else {
        console.warn('Failed to load categories:', categoriesResult.reason);
      }

      // Xử lý kết quả feedbacks
      if (feedbacksResult.status === 'fulfilled') {
        const data = feedbacksResult.value.data;
        const feedbackData = data?.data || data || [];
        setFeedbacks(feedbackData);
        
        // Cập nhật stats từ feedbacks và tính rating trung bình
        const totalFeedbacks = feedbackData.length;
        const avgRating = totalFeedbacks > 0 
          ? feedbackData.reduce((sum, feedback) => sum + (feedback.feedback_rating || 5), 0) / totalFeedbacks
          : 4.8;
        
        setStats(prev => ({
          ...prev,
          totalFeedbacks: totalFeedbacks,
          averageRating: avgRating
        }));
      } else {
        console.warn('Failed to load feedbacks:', feedbacksResult.reason);
      }

      // Chỉ báo lỗi nếu tất cả API đều fail
      const allFailed = results.every(result => result.status === 'rejected');
      if (allFailed) {
        throw new Error('Không thể tải dữ liệu từ server');
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      // Đặt giá trị mặc định để trang vẫn hiển thị được
      setBusinesses([]);
      setBestBusinesses([]);
      setCategories([]);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = useCallback((categoryId) => {
    setSelectedCategory(prev => prev === categoryId ? 'all' : categoryId);
  }, []);

  const handleSeeMore = useCallback((categoryName, categoryId) => {
    console.log('handleSeeMore called with:', { categoryName, categoryId });
    
    if (!categoryName || !categoryId) {
      console.error('Missing category data:', { categoryName, categoryId });
      return;
    }

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
  }, [navigate]);

  const handleBusinessClick = useCallback((businessId) => {
    navigate(`/business/${businessId}`);
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/discover?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Helper function để convert icon name thành emoji
  const getCategoryIcon = (iconName, categoryName) => {
    // Mapping từ tên category hoặc icon name
    const iconMap = {
      'Coffee': '☕',
      'Hàng ăn': '🍜',
      'Nhà trọ': '🏨',
      'Siêu thị': '🏪',
      'Nhà thuốc': '💊',
      'Vật liệu xây dựng': '🧱',
      'Cafe': '☕',
      'Restaurant': '🍽️',
      'Hotel': '🏨',
      'Pharmacy': '💊',
      'Store': '🏪',
      'Construction': '🧱',
      'Building Materials': '🧱',
      'FaCoffee': '☕',
      'MdFoodBank': '🍜',
      'RiHotelLine': '🏨',
      'FaStore': '🏪',
      'FaPills': '💊',
      'FaHammer': '🧱',
      'MdConstruction': '🧱'
    };
    
    return iconMap[iconName] || iconMap[categoryName] || '📍';
  };

  // Process feedbacks từ API backend
  const processedTestimonials = useMemo(() => {
    return feedbacks
      .filter(feedback => feedback.feedback_comment && feedback.feedback_comment.trim() !== '')
      .slice(0, 10) // Giới hạn tối đa 10 feedback
      .map(feedback => ({
        id: feedback._id,
        rating: Math.min(5, Math.max(1, 5)), // Mặc định 5 sao vì API không có rating
        text: feedback.feedback_comment,
        author: {
          name: feedback.user_id || "Người dùng ẩn danh",
          role: "Khách hàng",
          avatar: "/1.png"
        },
        date: new Date(feedback.feedback_date).toLocaleDateString('vi-VN')
      }));
  }, [feedbacks]);

  // Service navigation handlers
  const handlePrevService = useCallback(() => {
    const totalServicePages = Math.ceil(categories.length / 4);
    setCurrentServicePage(prev => 
      prev === 0 ? totalServicePages - 1 : prev - 1
    );
  }, [categories.length]);

  const handleNextService = useCallback(() => {
    const totalServicePages = Math.ceil(categories.length / 4);
    setCurrentServicePage(prev => 
      prev === totalServicePages - 1 ? 0 : prev + 1
    );
  }, [categories.length]);

  // Get visible services for current page
  const visibleServices = useMemo(() => {
    const startIndex = currentServicePage * 4;
    return categories.slice(startIndex, startIndex + 4);
  }, [categories, currentServicePage]);

  const handlePrevFeedback = useCallback(() => {
    const totalPages = Math.ceil(processedTestimonials.length / 3);
    setCurrentFeedbackPage(prev => 
      prev === 0 ? totalPages - 1 : prev - 1
    );
  }, [processedTestimonials.length]);

  const handleNextFeedback = useCallback(() => {
    const totalPages = Math.ceil(processedTestimonials.length / 3);
    setCurrentFeedbackPage(prev => 
      prev === totalPages - 1 ? 0 : prev + 1
    );
  }, [processedTestimonials.length]);

  const visibleTestimonials = useMemo(() => {
    const startIndex = currentFeedbackPage * 3;
    return processedTestimonials.slice(startIndex, startIndex + 3);
  }, [processedTestimonials, currentFeedbackPage]);

  // Tính toán có hiển thị navigation buttons hay không
  const showFeedbackNav = processedTestimonials.length > 3;
  const showServiceNav = categories.length > 4;

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
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section-landing">
        <div className="hero-background">
          <img src="/1.png" alt="Mountains" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Lựa chọn điểm đến lý tưởng</h1>
            <p>Cùng cập nhật thông tin hữu ích</p>
          </div>

          <div className="search-form">
            <form className="search-box" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Tìm kiếm</button>
            </form>
          </div>

          <div className="category-pills">
            <p>Đã đăng theo danh mục</p>
            <div className="pills-container" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => handleCategoryClick('all')}
                className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                <span className="pill-icon">🏠</span>
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className={`category-pill ${selectedCategory === category._id ? 'active' : ''}`}
                >
                  <span className="pill-icon">
                    {getCategoryIcon(category.icon, category.category_name)}
                  </span>
                  {category.category_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <div className="landing-page-new">
        <div className="container">
          {/* Best Places Section */}
          <section className="best-places-section">
            <h2>Best of LocalLink</h2>
            
            <div className="places-grid-new">
              {filteredBusinesses.slice(0, 8).map((business) => (
                <PlaceCard 
                  key={business._id} 
                  business={business} 
                  onClick={handleBusinessClick}
                />
              ))}
            </div>
          </section>

          {/* Services Grid với Navigation - Hiển thị 4 thẻ/dòng */}
          <section className="services-section-new">
            <h2>Danh mục dịch vụ</h2>
            <div className="services-container" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
              {showServiceNav && (
                <button 
                  className="service-nav-btn prev-btn"
                  onClick={handlePrevService}
                  aria-label="Xem danh mục trước"
                  style={{
                    position: 'absolute',
                    left: '-25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#ff6b35',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  ←
                </button>
              )}

              <div className="services-grid-new" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem',
                padding: showServiceNav ? '0 50px' : '0',
                marginBottom: '2rem'
              }}>
                {visibleServices.length > 0 ? (
                  visibleServices.map((category, index) => (
                    <ServiceCard 
                      key={category._id} 
                      category={category} 
                      businesses={businesses}
                      onSeeMore={handleSeeMore}
                      index={(currentServicePage * 4) + index}
                    />
                  ))
                ) : (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '2rem',
                    color: '#666' 
                  }}>
                    <p>Đang tải danh mục...</p>
                  </div>
                )}
              </div>

              {showServiceNav && (
                <button 
                  className="service-nav-btn next-btn"
                  onClick={handleNextService}
                  aria-label="Xem danh mục tiếp theo"
                  style={{
                    position: 'absolute',
                    right: '-25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#ff6b35',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  →
                </button>
              )}

              {/* Dots indicator nếu có nhiều trang */}
              {showServiceNav && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '2rem'
                }}>
                  {Array.from({ length: Math.ceil(categories.length / 4) }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`service-dot ${currentServicePage === idx ? 'active' : ''}`}
                      onClick={() => setCurrentServicePage(idx)}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: 'none',
                        background: currentServicePage === idx ? '#ff6b35' : '#ddd',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (currentServicePage !== idx) {
                          e.target.style.background = '#999';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentServicePage !== idx) {
                          e.target.style.background = '#ddd';
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Why Choose Section */}
          <WhyChooseSection />

          {/* Stats Section với dữ liệu thực từ API */}
          <StatsSection stats={stats} />

          {/* Feedback Section với dữ liệu thực từ API */}
          {processedTestimonials.length > 0 && (
            <section className="feedback-section">
              <h2>Phản hồi từ người dùng</h2>

              <div className="testimonials-container">
                {showFeedbackNav && (
                  <button 
                    className="feedback-nav-btn prev-btn"
                    onClick={handlePrevFeedback}
                    aria-label="Xem phản hồi trước"
                  >
                    ←
                  </button>
                )}

                <div className="testimonials-grid">
                  {visibleTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      rating={testimonial.rating}
                      text={testimonial.text}
                      author={testimonial.author}
                      date={testimonial.date}
                    />
                  ))}
                </div>

                {showFeedbackNav && (
                  <button 
                    className="feedback-nav-btn next-btn"
                    onClick={handleNextFeedback}
                    aria-label="Xem phản hồi tiếp theo"
                  >
                    →
                  </button>
                )}
              </div>

              <div className="feedback-stats">
                <div className="feedback-stat">
                  <h3>{stats.averageRating.toFixed(1)}/5</h3>
                  <p>Điểm đánh giá trung bình từ hơn {stats.totalFeedbacks} người dùng</p>
                </div>
                <div className="feedback-stat">
                  <h3>95%</h3>
                  <p>Người dùng hài lòng với dịch vụ</p>
                </div>
                <div className="feedback-stat">
                  <h3>{stats.totalBusinesses}+</h3>
                  <p>Doanh nghiệp đã tham gia</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

// Place Card Component với dữ liệu thực từ API
const PlaceCard = React.memo(({ business, onClick }) => {
  const businessName = business.business_name || 'Tên không có';
  const businessAddress = business.business_address || 'Địa chỉ không có';
  const businessRating = business.business_rating || 0;

  const handleClick = useCallback(() => {
    onClick(business._id);
  }, [business._id, onClick]);

  let imageUrl = '/1.png';
  if (business.business_image && Array.isArray(business.business_image) && business.business_image.length > 0) {
    imageUrl = business.business_image[0];
  }

  return (
    <div className="place-card-new" onClick={handleClick}>
      <div className="place-image-new">
        <img 
          src={imageUrl} 
          alt={businessName}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/1.png';
          }}
        />
        <div className="place-overlay">
          <div className="place-info-overlay">
            <h3>{businessName}</h3>
            <p>{businessAddress}</p>
            <div className="rating-overlay">⭐ {businessRating.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Service Card Component với dữ liệu thực từ API - hỗ trợ nhiều background
const ServiceCard = React.memo(({ category, businesses, onSeeMore, index }) => {
  const categoryBusinesses = businesses.filter(b => 
    b.business_category_id?._id === category._id
  );

  // Mở rộng danh sách background images cho 5 categories
  const backgroundImages = [
    '/1.png',
    '/2.png', 
    '/3.png',
    '/1.png', // Tái sử dụng cho category thứ 4
    '/2.png'  // Tái sử dụng cho category thứ 5
  ];

  // Mở rộng danh sách gradients cho 5 categories
  const gradients = [
    'linear-gradient(135deg, rgba(255,107,53,0.8) 0%, rgba(255,107,53,0.6) 100%)',
    'linear-gradient(135deg, rgba(103,92,231,0.8) 0%, rgba(103,92,231,0.6) 100%)',
    'linear-gradient(135deg, rgba(52,168,83,0.8) 0%, rgba(52,168,83,0.6) 100%)',
    'linear-gradient(135deg, rgba(233,30,99,0.8) 0%, rgba(233,30,99,0.6) 100%)',   // Pink
    'linear-gradient(135deg, rgba(255,152,0,0.8) 0%, rgba(255,152,0,0.6) 100%)'    // Orange
  ];

  const handleSeeMore = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSeeMore(category.category_name, category._id);
  }, [category.category_name, category._id, onSeeMore]);

  const handleCardClick = useCallback((e) => {
    e.preventDefault();
    onSeeMore(category.category_name, category._id);
  }, [category.category_name, category._id, onSeeMore]);

  return (
    <div className="service-card-new" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="service-background">
        <img 
          src={backgroundImages[index % backgroundImages.length] || '/1.png'} 
          alt={category.category_name}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/1.png';
          }}
        />
        <div 
          className="service-gradient" 
          style={{ background: gradients[index % gradients.length] }}
        ></div>
      </div>
      <div className="service-content-new">
        <h3>{category.category_name}</h3>
        <p>{categoryBusinesses.length} địa điểm</p>
        <button className="service-btn-new" onClick={handleSeeMore}>
          Khám phá →
        </button>
      </div>
    </div>
  );
});

// Why Choose Section
const WhyChooseSection = React.memo(() => (
  <section className="why-choose-section-new">
    <div className="why-choose-content-new">
      <div className="why-choose-left-new">
        <h2>Tại sao chọn LocalLink</h2>
        <div className="features-list-new">
          <div className="feature-item-new">
            <div className="feature-icon-new">📍</div>
            <div className="feature-content-new">
              <h4>Vị trí hoàn hảo</h4>
              <p>Tìm kiếm chính xác các địa điểm theo nhu cầu và vị trí của bạn với công nghệ GPS hiện đại</p>
            </div>
          </div>
          <div className="feature-item-new">
            <div className="feature-icon-new">🔥</div>
            <div className="feature-content-new">
              <h4>Thông tin đầy đủ</h4>
              <p>Cập nhật liên tục thông tin mới nhất về dịch vụ, giá cả, giờ mở cửa và đánh giá từ người dùng</p>
            </div>
          </div>
          <div className="feature-item-new">
            <div className="feature-icon-new">⭐</div>
            <div className="feature-content-new">
              <h4>Đánh giá tin cậy</h4>
              <p>Hệ thống đánh giá minh bạch từ người dùng thực tế giúp bạn đưa ra quyết định đúng đắn</p>
            </div>
          </div>
        </div>
      </div>
      <div className="why-choose-right-new">
        <img src="/1.png" alt="Tại sao chọn chúng tôi" loading="lazy" />
      </div>
    </div>
  </section>
));

// Testimonial Card Component với ngày tháng thực
const TestimonialCard = React.memo(({ rating, text, author, date }) => (
  <div className="testimonial-card">
    <div className="testimonial-header">
      <div className="testimonial-rating">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </div>
      <span className="testimonial-date">{date}</span>
    </div>
    <p className="testimonial-text">"{text}"</p>
    <div className="testimonial-author">
      <img 
        src={author.avatar} 
        alt={author.name}
        loading="lazy"
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
));

// Stats Section với dữ liệu thực từ API
const StatsSection = React.memo(({ stats }) => (
  <section className="stats-section">
    <div className="stats-grid">
      <div className="stat-item">
        <div className="stat-icon">🏢</div>
        <h3>{stats.totalBusinesses}+</h3>
        <p>Doanh nghiệp đã tham gia</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">📍</div>
        <h3>{stats.totalCategories}+</h3>
        <p>Danh mục đa dạng</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">👥</div>
        <h3>1000+</h3>
        <p>Người dùng tin tưởng</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">⭐</div>
        <h3>{stats.averageRating.toFixed(1)}</h3>
        <p>Đánh giá trung bình</p>
      </div>
    </div>
  </section>
));

export default LandingPage;
