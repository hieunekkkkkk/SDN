import React, { useState } from 'react';
import '../css/HeroSection.css';


const HeroSection = () => {
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

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src="../public/1.png" alt="Mountains" className="hero-bg-image" />
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
            <button onClick={handleSearch} className="search-btn">Tìm kiếm</button>
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
  );
};

export default HeroSection;