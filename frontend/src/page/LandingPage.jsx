// LandingPage.js
import React, { useState, useEffect } from 'react';
import '../index.css';
import Header from '../components/header';
import Footer from '../components/footer';
import { useUser, useAuth } from '@clerk/clerk-react';

function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  //clerk return jwt
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const token = await getToken({ template: 'node-backend' });
        console.log("JWT từ Clerk:", token);
      }
    };

    fetchToken();
  }, [isSignedIn, getToken]);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    alert(`Đã chọn danh mục: ${categoryName}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Tìm kiếm: ${searchQuery}`);
  };

  return (
    <>
      <Header />
      <div className="app">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        <CategorySection
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
        />

        <h1>Khám phá những địa điểm phổ biến gần bạn</h1>

        <PopularPlaces />

        <HowItWorks />

        <WhatsHot />
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

function CategorySection({ selectedCategory, handleCategoryClick }) {
  const categories = [
    { name: 'Khách sạn', icon: '🏨' },
    { name: 'Giải trí', icon: '🎭' },
    { name: 'Bệnh viện', icon: '🏥' },
    { name: 'Nhà hàng', icon: '🍽️' },
    { name: 'Cây xăng', icon: '⛽' },
    { name: 'Mua sắm', icon: '🛒' },
    { name: 'Cà phê', icon: '☕' },
    { name: 'Công viên', icon: '🏞️' },
  ];

  return (
    <div className="categories">
      {categories.map((category, index) => (
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

function PlaceCard({ place }) {
  const { name, location, status, image, isNew } = place;

  const getStatusClass = () => {
    switch (status) {
      case 'Mở cửa':
        return 'status-open';
      case 'Đóng cửa':
        return 'status-closed';
      case 'Đông':
        return 'status-busy';
      default:
        return '';
    }
  };

  return (
    <div className="place-card">
      {isNew && <div className="new-tag">Mới</div>}
      <img src={image} alt={name} className="place-image" />
      <div className="place-details">
        <h3 className="place-name">{name}</h3>
        <p className="place-location">{location}</p>
        <span className={`status ${getStatusClass()}`}>{status}</span>
      </div>
    </div>
  );
}

function PopularPlaces() {
  const places = [
    {
      name: 'Công viên Thống Nhất',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
    },
    {
      name: 'Highlands Coffee',
      location: 'Hà Nội, Việt Nam',
      status: 'Đóng cửa',
      image: '/1.png',
    },
    {
      name: 'Thư viện Quốc gia',
      location: 'Hà Nội, Việt Nam',
      status: 'Đông',
      image: '/1.png',
    },
    {
      name: 'AEON Mall',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
    },
  ];

  return (
    <div className="places-grid">
      {places.map((place, index) => (
        <PlaceCard key={index} place={place} />
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
          đóng cửa hoặc đông khách.
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

function WhatsHot() {
  const hotPlaces = [
    {
      name: 'Highlands Coffee',
      location: 'Hà Nội, Việt Nam',
      status: 'Đông',
      image: '/1.png',
      isNew: true,
    },
    {
      name: 'Nhà hàng Biển',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
      isNew: false,
    },
    {
      name: 'Khách sạn Mường Thanh',
      location: 'Hà Nội, Việt Nam',
      status: 'Mở cửa',
      image: '/1.png',
      isNew: true,
    },
  ];

  return (
    <div className="whats-hot">
      <h2>Điểm đến hot nhất hiện nay</h2>

      <div className="hot-grid">
        {hotPlaces.map((place, index) => (
          <PlaceCard key={index} place={place} />
        ))}
      </div>
    </div>
  );
}

export default LandingPage;