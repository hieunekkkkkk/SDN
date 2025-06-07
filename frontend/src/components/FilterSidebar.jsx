import React from 'react'
import '../css/DiscoverByCategoryPage.css';

function FilterSidebar({filters, handleFilterChange}) {
  return (
    <div className="sidebar">
          <p className="filter-section-header">Hãy lựa chọn yêu cầu của bạn:</p>

          <div className="filter-section">
            <h4>Vị trí (≤ {filters.distance} km)</h4>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={filters.distance}
              onChange={(e) => handleFilterChange('distance', Number(e.target.value))}
            />
            <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
              0 – {filters.distance} km
            </div>
          </div>

          <div className="filter-section">
            <h4>Giá tiền (≤ ${filters.price})</h4>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.price}
              onChange={(e) => handleFilterChange('price', Number(e.target.value))}
            />
            <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
              $0 – ${filters.price}
            </div>
          </div>

          <div className="filter-section">
            <h4>Đánh giá (≥ {filters.rating} ★)</h4>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
            />
            <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
              {filters.rating} ★ – 5 ★
            </div>
          </div>
        </div>
  )
}

export default FilterSidebar