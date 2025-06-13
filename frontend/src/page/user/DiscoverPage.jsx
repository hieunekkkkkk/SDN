import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy search query từ landing page nếu có
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Sử dụng Promise.allSettled để không bị fail khi một API lỗi
        const results = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_BE_URL}/api/category`, {
            timeout: 10000,
          }),
          axios.get(`${import.meta.env.VITE_BE_URL}/api/business`, {
            timeout: 10000,
          })
        ]);

        const [categoryResult, businessResult] = results;

        // Xử lý categories
        if (categoryResult.status === 'fulfilled') {
          if (categoryResult.value.data.categories && Array.isArray(categoryResult.value.data.categories)) {
            setCategories(categoryResult.value.data.categories);
          } else {
            console.warn('Unexpected category response format:', categoryResult.value.data);
            setCategories([]);
          }
        } else {
          console.error('Category fetch failed:', categoryResult.reason);
          setCategories([]);
        }

        // Xử lý businesses
        if (businessResult.status === 'fulfilled') {
          if (businessResult.value.data.businesses && Array.isArray(businessResult.value.data.businesses)) {
            setBusinesses(businessResult.value.data.businesses);
          } else {
            console.warn('Unexpected business response format:', businessResult.value.data);
            setBusinesses([]);
          }
        } else {
          console.error('Business fetch failed:', businessResult.reason);
          setBusinesses([]);
        }

        // Chỉ báo lỗi nếu cả hai API đều fail
        if (categoryResult.status === 'rejected' && businessResult.status === 'rejected') {
          throw new Error('Không thể tải dữ liệu từ server');
        }

      } catch (err) {
        console.error('Fetch error details:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setCategories([]);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter businesses based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = businesses.filter(business =>
        business.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.business_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.business_category_id?.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    } else {
      setFilteredBusinesses([]);
    }
  }, [searchQuery, businesses]);

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

  const handleBusinessClick = (businessId) => {
    navigate(`/business/${businessId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search logic is handled by useEffect above
  };

  if (loading) {
    return (
      <>
        <Header />
        <LoadingScreen />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ff6b35', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer' 
          }}>
            Thử lại
          </button>
        </div>
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
          
          {/* Search Section */}
          {searchQuery && (
            <section className="search-results-section">
              <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
              <div className="discover-places-grid">
                {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map((business) => (
                    <div
                      key={business._id}
                      className="discover-place-card"
                      onClick={() => handleBusinessClick(business._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="discover-place-image">
                        <img
                          src={business.business_image?.[0] || '/placeholder.jpg'}
                          alt={business.business_name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/1.png';
                          }}
                        />
                      </div>
                      <div className="discover-place-info">
                        <h3>{business.business_name}</h3>
                        <p className="discover-place-location">{business.business_address}</p>
                        <div className="discover-place-meta">
                          <span className="discover-status">
                            {business.business_status ? 'Đang mở cửa' : 'Đã đóng cửa'}
                          </span>
                          <span className="discover-rating">⭐ {business.business_rating || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
                    <p>Không tìm thấy kết quả phù hợp với "{searchQuery}"</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        navigate('/discover', { replace: true });
                      }}
                      style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#ff6b35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Xem tất cả danh mục
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Categories Section - chỉ hiển thị khi không có search */}
          {!searchQuery && categories.map((cat) => (
            <section key={cat._id} className="discover-recommended-section">
              <h2 className="discover-recommended-title">{cat.category_name}</h2>
              <div className="discover-places-grid">
                {businesses
                  .filter(b => b.business_category_id?._id === cat._id)
                  .slice(0, 3)
                  .map((business) => (
                    <div
                      key={business._id}
                      className="discover-place-card"
                      onClick={() => handleBusinessClick(business._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="discover-place-image">
                        <img
                          src={business.business_image?.[0] || '/placeholder.jpg'}
                          alt={business.business_name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/1.png';
                          }}
                        />
                      </div>
                      <div className="discover-place-info">
                        <h3>{business.business_name}</h3>
                        <p className="discover-place-location">{business.business_address}</p>
                        <div className="discover-place-meta">
                          <span className="discover-status">
                            {business.business_status ? 'Đang mở cửa' : 'Đã đóng cửa'}
                          </span>
                          <span className="discover-rating">⭐ {business.business_rating || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Chỉ hiển thị nút "Xem thêm" nếu có nhiều hơn 3 businesses trong category */}
              {businesses.filter(b => b.business_category_id?._id === cat._id).length > 3 && (
                <div className="see-more-container">
                  <button
                    className="see-more-btn"
                    onClick={() => handleSeeMore(cat.category_name, cat._id)}
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </section>
          ))}

          {/* Empty state khi không có categories và không có search */}
          {!searchQuery && categories.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <h2 style={{ color: '#666', marginBottom: '20px' }}>Chưa có danh mục nào</h2>
              <p style={{ color: '#999' }}>Vui lòng quay lại sau để khám phá các địa điểm thú vị!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default DiscoverPage;