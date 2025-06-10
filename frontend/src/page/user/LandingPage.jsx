// LandingPage.js với API tích hợp
import React, { useState, useEffect } from 'react';
import '../../index.css';
import Footer from '../../components/Footer';

// API configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API helper function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  // Load data từ API khi component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter businesses khi selectedCategory thay đổi
  useEffect(() => {
    filterBusinessesByCategory();
  }, [selectedCategory, businesses]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API để lấy dữ liệu
      const [businessesData, categoriesData] = await Promise.all([
        apiRequest('/business'),
        apiRequest('/category')
      ]);

      setBusinesses(businessesData || []);
      setCategories(categoriesData || []);
      setFilteredBusinesses(businessesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      
      // Fallback to default data if API fails
      setBusinesses([]);
      setFilteredBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinessesByCategory = () => {
    if (!selectedCategory) {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter(business => 
        business.business_category === selectedCategory
      );
      setFilteredBusinesses(filtered);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredBusinesses(businesses);
      return;
    }

    try {
      setLoading(true);
      
      // Tìm kiếm local first
      const filtered = businesses.filter(business => 
        business.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.business_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.business_category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Lỗi khi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && businesses.length === 0) {
    return (
      <div className="app">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={loadInitialData} className="btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        <CategorySection
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
          categories={categories}
          businesses={businesses}
        />

        <h1>Khám phá những địa điểm phổ biến gần bạn</h1>

        <PopularPlaces 
          businesses={filteredBusinesses}
          loading={loading}
        />

        <HowItWorks />

        <WhatsHot businesses={businesses} />
      </div>

      <Footer />
    </>
  );
}

// Các component phụ
function SearchBar({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <div className="search-container">
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm địa điểm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Tìm kiếm
        </button>
      </form>
    </div>
  );
}

function CategorySection({ selectedCategory, handleCategoryClick, categories, businesses }) {
  // Default categories
  const defaultCategories = [
    { name: 'Khách sạn', icon: '🏨' },
    { name: 'Giải trí', icon: '🎭' },
    { name: 'Bệnh viện', icon: '🏥' },
    { name: 'Nhà hàng', icon: '🍽️' },
    { name: 'Cây xăng', icon: '⛽' },
    { name: 'Mua sắm', icon: '🛒' },
    { name: 'Cà phê', icon: '☕' },
    { name: 'Công viên', icon: '🏞️' },
  ];

  // Category icons mapping
  const categoryIcons = {
    'Khách sạn': '🏨',
    'Giải trí': '🎭',
    'Bệnh viện': '🏥',
    'Nhà hàng': '🍽️',
    'Cây xăng': '⛽',
    'Mua sắm': '🛒',
    'Cà phê': '☕',
    'Công viên': '🏞️',
  };

  // Lấy unique categories từ businesses hoặc dùng default
  let displayCategories = [];
  
  if (businesses && businesses.length > 0) {
    const businessCategories = [...new Set(businesses
      .map(business => business.business_category)
      .filter(cat => cat)
    )];
    
    displayCategories = businessCategories.map(cat => ({
      name: cat,
      icon: categoryIcons[cat] || '📍'
    }));
  }
  
  // Nếu không có categories từ API, dùng default
  if (displayCategories.length === 0) {
    displayCategories = defaultCategories;
  }

  return (
    <div className="categories">
      {displayCategories.map((category, index) => (
        <div
          key={index}
          className={`category ${selectedCategory === category.name ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category.name)}
        >
          <div className="category-icon">{category.icon}</div>
          <span className="category-name">{category.name}</span>
        </div>
      ))}
    </div>
  );
}

function PlaceCard({ business }) {
  // Handle both API data and fallback data
  const businessName = business.business_name || business.name || 'Tên không có';
  const businessAddress = business.business_address || business.location || 'Địa chỉ không có';
  const businessStatus = business.business_status !== undefined ? business.business_status : business.status;
  const businessImage = business.business_image || business.image;
  const businessRating = business.business_rating || business.rating;
  const businessView = business.business_view || business.view;

  const getStatusText = (status) => {
    if (status === true || status === 'true' || status === 'Mở cửa') return 'Mở cửa';
    if (status === false || status === 'false' || status === 'Đóng cửa') return 'Đóng cửa';
    if (status === 'Đông') return 'Đông';
    return 'Không rõ';
  };

  const getStatusClass = (status) => {
    if (status === true || status === 'true' || status === 'Mở cửa') return 'status-open';
    if (status === false || status === 'false' || status === 'Đóng cửa') return 'status-closed';
    if (status === 'Đông') return 'status-busy';
    return 'status-busy';
  };

  // Handle image URL
  let imageUrl = '/1.png'; // Default image
  if (businessImage) {
    if (Array.isArray(businessImage) && businessImage.length > 0) {
      imageUrl = businessImage[0];
    } else if (typeof businessImage === 'string') {
      imageUrl = businessImage;
    }
  }

  return (
    <div className="place-card">
      <img 
        src={imageUrl} 
        alt={businessName} 
        className="place-image"
        onError={(e) => {
          e.target.src = '/1.png'; // Fallback image
        }}
      />
      <div className="place-details">
        <h3 className="place-name">{businessName}</h3>
        <p className="place-location">{businessAddress}</p>
        <span className={`status ${getStatusClass(businessStatus)}`}>
          {getStatusText(businessStatus)}
        </span>
        {businessRating && (
          <div className="rating" style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ff9800', fontWeight: '500' }}>
            <span>⭐ {typeof businessRating === 'number' ? businessRating.toFixed(1) : businessRating}</span>
          </div>
        )}
        {businessView && (
          <div className="views" style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
            <span>👁️ {businessView} lượt xem</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PopularPlaces({ businesses, loading }) {
  if (loading) {
    return (
      <div className="places-grid">
        <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
          <p>Đang tải địa điểm...</p>
        </div>
      </div>
    );
  }

  // Fallback data nếu API không có dữ liệu
  const fallbackPlaces = [
    {
      _id: '1',
      name: 'Công viên Thống Nhất',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
    },
    {
      _id: '2',
      name: 'Highlands Coffee',
      location: 'Hà Nội, Việt Nam',
      status: 'Đóng cửa',
      image: '/1.png',
    },
    {
      _id: '3',
      name: 'Thư viện Quốc gia',
      location: 'Hà Nội, Việt Nam',
      status: 'Đông',
      image: '/1.png',
    },
    {
      _id: '4',
      name: 'AEON Mall',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
    },
  ];

  const displayPlaces = businesses.length > 0 ? businesses.slice(0, 8) : fallbackPlaces;

  if (displayPlaces.length === 0) {
    return (
      <div className="places-grid">
        <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
          <p>Không tìm thấy địa điểm nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="places-grid">
      {displayPlaces.map((business) => (
        <PlaceCard key={business._id || business.id} business={business} />
      ))}
    </div>
  );
}

function HowItWorks() {
  const examplePlaces = [
    {
      name: 'Quán Bar Trendy',
      status: 'Đông',
      image: '/1.png',
    },
    {
      name: 'Nhà hàng Biển',
      status: 'Mở cửa',
      image: '/1.png',
    },
  ];

  return (
    <div className="how-it-works">
      <div className="how-it-works-text">
        <h2>Cách thức hoạt động</h2>
        <p>
          Tìm kiếm một địa điểm để xem trạng thái thực tế của nó, chẳng hạn như đang mở cửa,
          đóng cửa hoặc đông khách. Tất cả dữ liệu được cập nhật từ hệ thống.
        </p>
      </div>

      <div className="example-cards">
        {examplePlaces.map((place, index) => (
          <div key={index} className="example-card">
            <img src={place.image} alt={place.name} className="place-image" />
            <div className="place-details">
              <h3 className="place-name">{place.name}</h3>
              <span
                className={`status status-${place.status === 'Đông' ? 'busy' : 'open'}`}
              >
                {place.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsHot({ businesses }) {
  // Fallback data
  const fallbackHotPlaces = [
    {
      _id: 'hot1',
      name: 'Highlands Coffee',
      location: 'Hà Nội, Việt Nam',
      status: 'Đông',
      image: '/1.png',
      isNew: true,
    },
    {
      _id: 'hot2',
      name: 'Nhà hàng Biển',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
      isNew: false,
    },
    {
      _id: 'hot3',
      name: 'Khách sạn Mường Thanh',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
      isNew: true,
    },
  ];

  // Lấy các địa điểm có rating cao hoặc view nhiều từ API
  let hotPlaces = [];
  if (businesses && businesses.length > 0) {
    hotPlaces = businesses
      .filter(business => 
        (business.business_rating && business.business_rating > 4) || 
        (business.business_view && business.business_view > 100)
      )
      .slice(0, 6);
  }

  // Nếu không có dữ liệu từ API, dùng fallback
  if (hotPlaces.length === 0) {
    hotPlaces = fallbackHotPlaces;
  }

  return (
    <div className="whats-hot">
      <h2>Điểm đến hot nhất hiện nay</h2>

      <div className="hot-grid">
        {hotPlaces.map((business) => (
          <div key={business._id || business.id} className="place-card" style={{ position: 'relative' }}>
            <div 
              className="new-tag" 
              style={{ 
                position: 'absolute', 
                top: '8px', 
                left: '8px', 
                backgroundColor: '#ff4444', 
                color: 'white', 
                padding: '4px 8px', 
                fontSize: '12px', 
                fontWeight: '500', 
                borderRadius: '4px', 
                zIndex: 1 
              }}
            >
              Hot
            </div>
            <PlaceCard business={business} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;