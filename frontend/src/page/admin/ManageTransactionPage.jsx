import React, { useState, useEffect, useRef } from 'react';
import HeroSectionAdmin from '../../components/HeroSectionAdmin';
import Footer from '../../components/Footer';
import '../../css/ManageTransactionPage.css';
import { toast } from 'react-toastify';
import Chart from 'chart.js/auto';

function ManageTransactionPage() {
  const [transactions, setTransactions] = useState([
    { id: 'TXN4823', from: 'Hector Hugo', value: '100,000 VND', datetime: '2025-06-08 12:05', to: 'Hector Hugo' },
    { id: 'TXN4824', from: 'Alice Johnson', value: '250,000 VND', datetime: '2025-06-08 11:30', to: 'Café Central' },
    { id: 'TXN4825', from: 'Bob Smith', value: '150,000 VND', datetime: '2025-06-08 10:15', to: 'Hotel Paradise' },
    { id: 'TXN4826', from: 'Carla Gomez', value: '320,000 VND', datetime: '2025-06-08 09:45', to: 'Restaurant Saigon' },
    { id: 'TXN4827', from: 'David Lee', value: '180,000 VND', datetime: '2025-06-08 08:20', to: 'Motel Sunshine' },
    { id: 'TXN4828', from: 'Emily Chen', value: '95,000 VND', datetime: '2025-06-07 16:30', to: 'Café Blue Moon' },
    { id: 'TXN4829', from: 'Frank Ngu', value: '400,000 VND', datetime: '2025-06-07 15:45', to: 'Hotel Golden' },
  ]);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Sắp xếp: Chọn');
  const monthlyChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const monthlyChartInstance = useRef(null);
  const categoryChartInstance = useRef(null);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.id.toLowerCase().includes(search.toLowerCase()) ||
    transaction.from.toLowerCase().includes(search.toLowerCase()) ||
    transaction.to.toLowerCase().includes(search.toLowerCase())
  );

  const getTotalValue = () => {
    const total = transactions.reduce((sum, transaction) => {
      const value = parseInt(transaction.value.replace(/[^0-9]/g, ''));
      return sum + value;
    }, 0);
    return (total / 1000000).toFixed(1) + 'M';
  };

  useEffect(() => {
    // Biểu đồ giao dịch hàng tháng
    if (monthlyChartRef.current) {
      const ctx = monthlyChartRef.current.getContext('2d');

      if (monthlyChartInstance.current) {
        monthlyChartInstance.current.destroy();
      }

      monthlyChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
          datasets: [{
            label: 'Giao dịch',
            data: [20, 35, 25, 40, 30, 35],
            borderColor: '#E91E63',
            backgroundColor: 'rgba(233, 30, 99, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#E91E63',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f1f3f4'
              },
              ticks: {
                color: '#6c757d'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6c757d'
              }
            }
          }
        }
      });
    }

    // Biểu đồ danh mục
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext('2d');

      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }

      categoryChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Dịch vụ', 'Nhà trọ', 'Siêu thị', 'Quán cà phê', 'Cung ứng'],
          datasets: [{
            data: [80, 65, 70, 85, 60],
            backgroundColor: [
              '#4FC3F7',
              '#29B6F6',
              '#03A9F4',
              '#0288D1',
              '#0277BD'
            ],
            borderRadius: 5,
            borderSkipped: false,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                color: '#f1f3f4'
              },
              ticks: {
                color: '#6c757d'
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6c757d'
              }
            }
          }
        }
      });
    }

    return () => {
      if (monthlyChartInstance.current) {
        monthlyChartInstance.current.destroy();
      }
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }
    };
  }, []);

  const businessRevenues = [
    { name: 'Trà Dương Linh', height: 60 },
    { name: 'Trà Dương Linh', height: 120 },
    { name: 'Trà Dương Linh', height: 150 },
    { name: 'Trà Dương Linh', height: 80 },
    { name: 'Trà Dương Linh', height: 180 },
    { name: 'Trà Dương Linh', height: 200 },
    { name: 'Trà Dương Linh', height: 100 },
  ];

  return (
    <>
      <HeroSectionAdmin message={<>Trang quản lý <br /> giao dịch</>} />

      <div className="manage-transaction-container">
        {/* Phần tìm kiếm và lọc */}
        <div className="transaction-header">
          <div className="transaction-search-bar">
            <input
              type="text"
              placeholder="Tìm theo mã GD, người gửi, người nhận"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="transaction-filter-section">
            <div className="total-value">
              Tổng giá trị: {getTotalValue()} VND
            </div>
            <div className="sort-select">
              Sắp xếp:&nbsp;
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Chọn</option>
                <option>Giá trị cao nhất</option>
                <option>Giá trị thấp nhất</option>
                <option>Mới nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bảng giao dịch */}
        <div className="transaction-table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Từ</th>
                <th>Giá trị</th>
                <th>Ngày/Giờ</th>
                <th>Đến</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td data-label="Mã GD">
                    <span className="tx-id">{transaction.id}</span>
                  </td>
                  <td data-label="Từ">{transaction.from}</td>
                  <td data-label="Giá trị">
                    <span className="transaction-amount">{transaction.value}</span>
                  </td>
                  <td data-label="Ngày/Giờ">{transaction.datetime}</td>
                  <td data-label="Đến">{transaction.to}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-data">
                    Không tìm thấy giao dịch phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="manage-pagination">
          &lt; <span className="page">1</span><span>2</span><span>3</span><span>4</span>
          <span>5</span><span>6</span><span>7</span><span>8</span> &gt;
        </div>

        {/* Phần biểu đồ */}
        <div className="charts-section">
          {/* Biểu đồ giao dịch hàng tháng */}
          <div className="chart-container">
            <h3 className="chart-title">Giao dịch hàng tháng</h3>
            <p className="chart-subtitle">
              Thống kê lượng giao dịch hàng tháng<br />của hệ thống
            </p>
            <div className="chart-wrapper">
              <canvas ref={monthlyChartRef}></canvas>
            </div>
          </div>

          {/* Thống kê danh mục */}
          <div className="chart-container">
            <h3 className="chart-title">Thống kê lượng giao dịch mỗi danh mục kinh doanh</h3>
            <p className="chart-subtitle">Các danh mục phổ biến nhất</p>
            <div className="chart-wrapper">
              <canvas ref={categoryChartRef}></canvas>
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#4FC3F7' }}></div>
                <span>Dịch vụ</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#29B6F6' }}></div>
                <span>Nhà trọ</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#03A9F4' }}></div>
                <span>Siêu thị</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#0288D1' }}></div>
                <span>Quán cà phê</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#0277BD' }}></div>
                <span>Cung ứng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ doanh thu doanh nghiệp */}
        <div className="business-revenue-section">
          <div className="revenue-chart-header">
            <h3 className="revenue-chart-title">
              📊 Top doanh nghiệp có lượng giao dịch nhiều nhất
            </h3>
            <div className="sort-select">
              <select>
                <option>Sắp xếp: Chọn</option>
                <option>Cao nhất</option>
                <option>Thấp nhất</option>
              </select>
            </div>
          </div>

          <div className="revenue-bars">
            {businessRevenues.map((business, index) => (
              <div key={index} className="revenue-bar-container">
                <div
                  className="revenue-bar"
                  style={{ height: `${business.height}px` }}
                ></div>
                <div className="business-name">{business.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ManageTransactionPage;