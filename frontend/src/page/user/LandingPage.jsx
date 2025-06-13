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
  const [searchQuery, setSearchQuery] = useState('');
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

  // Debug log để kiểm tra dữ liệu categories
  useEffect(() => {
    console.log('Categories loaded:', categories);
    console.log('Businesses loaded:', businesses.length);
    console.log('Best businesses loaded:', bestBusinesses.length);
  }, [categories, businesses, bestBusinesses]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sử dụng Promise.allSettled để không bị fail khi một API lỗi
      const results = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_BE_URL}/api/business?limit=30`),
        axios.get(`${import.meta.env.VITE_BE_URL}/api/business/rating?page=1&limit=8`),
        axios.get(`${import.meta.env.VITE_BE_URL}/api/category`),
        axios.get(`${import.meta.env.VITE_BE_URL}/api/feedback`)
      ]);

      const [businessesResult, bestBusinessesResult, categoriesResult, feedbacksResult] = results;

      // Xử lý kết quả businesses
      if (businessesResult.status === 'fulfilled') {
        const data = businessesResult.value.data;
        setBusinesses(data?.businesses || data || []);
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
        setCategories(data?.categories || data || []);
      } else {
        console.warn('Failed to load categories:', categoriesResult.reason);
      }

      // Xử lý kết quả feedbacks
      if (feedbacksResult.status === 'fulfilled') {
        const data = feedbacksResult.value.data;
        setFeedbacks(data?.data || data || []);
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

    console.log('Navigating to:', `/discover/${slug}`, 'with state:', {
      category_id: categoryId,
      category_name: categoryName,
    });

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

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Tìm kiếm trong businesses hiện tại hoặc chuyển đến trang discover với query
      navigate('/discover', { 
        state: { searchQuery: searchQuery.trim() }
      });
    }
  }, [searchQuery, navigate]);

  // Helper function để convert icon name thành emoji đơn giản
  const getCategoryIcon = (iconName, categoryName) => {
    // Dựa vào icon name hoặc category name để return emoji
    if (iconName === 'FaCoffee' || categoryName === 'Coffee') return '☕';
    if (iconName === 'MdFoodBank' || categoryName === 'Hàng ăn') return '🍜';
    if (iconName === 'RiHotelLine' || categoryName === 'Nhà trọ') return '🏨';
    if (iconName === 'FaStore' || categoryName === 'Siêu thị') return '🏪';
    if (iconName === 'FaPills' || categoryName === 'Nhà thuốc') return '💊';
    return '📍';
  };

  // ✨ Process feedbacks từ API backend với giới hạn 10 feedback
  const processedTestimonials = useMemo(() => {
    return feedbacks
      .filter(feedback => feedback.feedback_type === 'business' && feedback.feedback_comment)
      .slice(0, 10) // Giới hạn tối đa 10 feedback
      .map(feedback => ({
        id: feedback._id,
        rating: Math.min(5, Math.max(1, Math.floor(Math.random() * 2) + 4)),
        text: feedback.feedback_comment,
        author: {
          name: feedback.user_id || "Người dùng ẩn danh",
          role: "Khách hàng",
          avatar: "/1.png"
        }
      }));
  }, [feedbacks]);

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
            <p>Đã đăng theo mục điều</p>
            <div className="pills-container">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                <span className="pill-icon">🏠</span>
                Tất cả
              </button>
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className={`category-pill ${selectedCategory === category._id ? 'active' : ''}`}
                >
                  <span className="pill-icon">{getCategoryIcon(category.icon, category.category_name)}</span>
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

          {/* Services Grid */}
          <section className="services-section-new">
            <div className="services-grid-new">
              {categories && categories.length > 0 ? (
                categories.slice(0, 3).map((category, index) => (
                  <ServiceCard 
                    key={category._id} 
                    category={category} 
                    businesses={businesses}
                    onSeeMore={handleSeeMore}
                    index={index}
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
          </section>

          {/* Why Choose Section */}
          <WhyChooseSection />

          {/* Stats Section */}
          <StatsSection
            businessesCount={businesses.length}
            categoriesCount={categories.length}
            feedbacksCount={feedbacks.length}
          />

          {/* ✨ Feedback Section - Hiển thị 3 feedback một lần với navigation */}
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
                  <h3>4.8/5</h3>
                  <p>Điểm đánh giá trung bình từ hơn {feedbacks.length} người dùng</p>
                </div>
                <div className="feedback-stat">
                  <h3>95%</h3>
                  <p>Người dùng hài lòng với dịch vụ</p>
                </div>
                <div className="feedback-stat">
                  <h3>{businesses.length}+</h3>
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

// Place Card Component
const PlaceCard = React.memo(({ business, onClick }) => {
  const businessName = business.business_name || 'Tên không có';
  const businessAddress = business.business_address || 'Địa chỉ không có';
  const businessStatus = business.business_status;
  const businessImage = business.business_image;
  const businessRating = business.business_rating || 0;

  const handleClick = useCallback(() => {
    onClick(business._id);
  }, [business._id, onClick]);

  let imageUrl = '/1.png';
  if (businessImage && Array.isArray(businessImage) && businessImage.length > 0) {
    imageUrl = businessImage[0];
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

// Service Card Component
const ServiceCard = React.memo(({ category, businesses, onSeeMore, index }) => {
  const categoryBusinesses = businesses.filter(b => 
    b.business_category_id?._id === category._id
  );

  const backgroundImages = [
    '/1.png',
    '/2.png', 
    '/3.png'
  ];

  const gradients = [
    'linear-gradient(135deg, rgba(255,107,53,0.8) 0%, rgba(255,107,53,0.6) 100%)',
    'linear-gradient(135deg, rgba(103,92,231,0.8) 0%, rgba(103,92,231,0.6) 100%)',
    'linear-gradient(135deg, rgba(52,168,83,0.8) 0%, rgba(52,168,83,0.6) 100%)'
  ];

  const handleSeeMore = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to category:', category.category_name, 'ID:', category._id);
    onSeeMore(category.category_name, category._id);
  }, [category.category_name, category._id, onSeeMore]);

  const handleCardClick = useCallback((e) => {
    e.preventDefault();
    console.log('Card clicked - Category:', category.category_name, 'ID:', category._id);
    onSeeMore(category.category_name, category._id);
  }, [category.category_name, category._id, onSeeMore]);

  return (
    <div className="service-card-new" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="service-background">
        <img 
          src={backgroundImages[index] || '/1.png'} 
          alt={category.category_name}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/1.png';
          }}
        />
        <div 
          className="service-gradient" 
          style={{ background: gradients[index] }}
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

// ✨ Testimonial Card Component cho feedback từ API
const TestimonialCard = React.memo(({ rating, text, author }) => (
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

// Stats Section
const StatsSection = React.memo(({ businessesCount, categoriesCount, feedbacksCount }) => (
  <section className="stats-section">
    <div className="stats-grid">
      <div className="stat-item">
        <div className="stat-icon">🏢</div>
        <h3>{businessesCount}+</h3>
        <p>Doanh nghiệp đã tham gia</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">📍</div>
        <h3>{categoriesCount}+</h3>
        <p>Danh mục đa dạng</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">👥</div>
        <h3>1000+</h3>
        <p>Người dùng tin tưởng</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">⭐</div>
        <h3>4.8</h3>
        <p>Đánh giá trung bình</p>
      </div>
    </div>
  </section>
));

export default LandingPage;