import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../../css/PersonalizedPage.css';


function PersonalizedPage() {
    const [type, setType] = useState('Boarding');
    const [budget, setBudget] = useState('50,000');
    const [rating, setRating] = useState(5);
    const navigate = useNavigate();

    const bestPlaces = [
        {
            id: 1,
            title: 'Molokini and Turtle Town Snorkeling Adventure Aboard',
            location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
            status: 'Đang mở cửa',
            image: '1.png',
            rating: 4.8
        },
        {
            id: 2,
            title: 'All Inclusive Ultimate Circle Island Day Tour with Lunch',
            location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
            status: 'Đang mở cửa',
            image: '1.png',
            rating: 4.9
        },
        {
            id: 3,
            title: 'Clear Kayak Tour of Shell Key Preserve and Tampa Bay Area',
            location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
            status: 'Đang mở cửa',
            image: '1.png',
            rating: 4.7
        },
        {
            id: 4,
            title: 'Mauna Kea Summit Sunset and Stars Free Astro Photos Hilo...',
            location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
            status: 'Đang mở cửa',
            image: '1.png',
            rating: 4.6
        },
        {
            id: 5,
            title: 'Clear Kayak Tour of Shell Key Preserve and Tampa Bay Area',
            location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
            status: 'Đang mở cửa',
            image: '1.png',
            rating: 4.7
        },
        {
            id: 6,
            title: 'Clear Kayak Tour of Shell Key Preserve and Tampa Bay Area',
            location: 'Thon 3 Thach Hoa Thach Thi Ha Noi',
            status: 'Đang mở cửa',
            image: '1.png',
            rating: 4.7
        },
    ];

    return (
        <>
            <Header />

            <div className="personalized-page">
                {/* Welcome Section */}
                <div className="personalized-welcome-section">
                    {/* Left Text Section */}
                    <div className="personalized-welcome-text">
                        <h1 className="personalized-welcome-title">
                            Chào mừng đến với trợ lý tìm kiếm hoàn hảo!
                        </h1>

                        <div className="personalized-welcome-content">
                            <div className="personalized-welcome-item">
                                <span className="personalized-icon">🎫</span>
                                <div>
                                    <p className="personalized-item-title">
                                        Tìm kiếm nhu cầu - đúng người, đúng thời điểm
                                    </p>
                                    <p className="personalized-item-description">
                                        Hỗ trợ người dùng thông qua lựa chọn tiêu chí và ngành cần tìm kiếm (như địa điểm, mức tiêu, số đích), để đưa xu hướng kết quả phù hợp tối ưu theo từng cá nhân, không cần phải lọc công.
                                    </p>
                                </div>
                            </div>

                            <div className="personalized-welcome-item">
                                <span className="personalized-icon">🎈</span>
                                <div>
                                    <p className="personalized-item-title">
                                        Giao diện thông minh - kết hợp giữa chatbot và tùy chọn linh hoạt
                                    </p>
                                    <p className="personalized-item-description">
                                        Người dùng có thể tương tác nhanh qua chatbot hoặc sử dụng các tùy chọn sẵn có để tìm kiếm chính xác.
                                    </p>
                                </div>
                            </div>

                            <div className="personalized-welcome-item">
                                <span className="personalized-icon">💎</span>
                                <div>
                                    <p className="personalized-item-title">
                                        Đồng cơ để xuất thông minh - học từ nhân viên, liên tục tối ưu
                                    </p>
                                    <p className="personalized-item-description">
                                        Hệ thống AI để học hành vi người dùng: các tìm kiếm trước, lượt nhấn, thời gian xem,... để đưa dự đoán ra gợi ý thông minh và sát với nhu cầu hơn theo thời gian.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="personalized-welcome-image">
                        <div className="personalized-image-placeholder">
                            <img src="../public/1.png" alt="Welcome Image" />
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="personalized-search-section">
                    {/* Filter Section */}
                    <div className="personalized-filter-container">
                        <h2 className="personalized-search-title">
                            Trở lãi ở giúp tìm kiếm theo yêu cầu của bạn!
                        </h2>
                        <p className="personalized-search-subtitle">
                            Giúp tìm kiếm theo nhu cầu của cá nhân hóa, thêm vào danh sách yêu thích để chia.
                        </p>
                        <p className="personalized-filter-info">
                            <span className="personalized-filter-label">Tiêu chí của bạn:</span> Lựa chọn tiêu chí giúp trở lý AI đưa ra lựa chọn phù hợp nhất cho bạn!
                        </p>

                        {/* Type Filter */}
                        <div className="personalized-filter-group">
                            <label className="personalized-filter-label">Type:</label>
                            <div className="personalized-filter-options">
                                {['Boarding', 'Restaurant', 'Pharmacy', 'Other...'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setType(option)}
                                        className={`personalized-filter-button ${type === option ? 'personalized-active' : ''}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget Filter */}
                        <div className="personalized-filter-group">
                            <label className="personalized-filter-label">Budget:</label>
                            <div className="personalized-filter-options">
                                {['50,000', '100,000', '500,000', '1,500,000', 'Above...'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setBudget(option)}
                                        className={`personalized-filter-button ${budget === option ? 'personalized-active' : ''}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="personalized-filter-group">
                            <label className="personalized-filter-label">Ratings:</label>
                            <div className="personalized-rating-options">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`personalized-star-rating ${star <= rating ? 'personalized-active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Chatbot Prompt */}
                        <div className="personalized-chatbot-prompt">
                            <span className="personalized-prompt-icon">❤️ Câu hỏi nổi bật:</span>
                            <p className="personalized-prompt-text">
                                📍Lựa chọn tiêu chí giúp trợ lý AI đưa ra lựa chọn phù hợp nhất cho bạn!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Best Places Section */}
                <section className="personalized-best-places-section">
                    <div className="container">
                        <h2>Địa điểm gợi ý</h2>
                        <div className="personalized-places-grid">
                            {bestPlaces.map((place, index) => (
                                <div key={index} className="personalized-place-card" onClick={() => navigate('/business')} style={{ cursor: 'pointer' }}>
                                    <div className="personalized-place-image">
                                        <img src={place.image} alt={place.title} />
                                        <button className="personalized-favorite-btn">❤️</button>
                                    </div>
                                    <div className="personalized-place-info">
                                        <h3>{place.title}</h3>
                                        <p className="personalized-place-location">{place.location}</p>
                                        <div className="personalized-place-meta">
                                            <span className="personalized-status">{place.status}</span>
                                            <span className="personalized-rating">⭐ {place.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <style>
                    {`
          
        `}
                </style>
            </div>
            <Footer />
        </>
    );
}

export default PersonalizedPage;