import React, { useState, useEffect, useRef } from 'react';
import HeroSectionAdmin from '../../components/HeroSectionAdmin';
import Footer from '../../components/Footer';
import '../../css/ManageTransactionPage.css';
import { toast } from 'react-toastify';
import Chart from 'chart.js/auto';
import Header from '../../components/Header';

function ManageTransactionPage() {
  const [payments, setPayments] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const monthlyChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const monthlyChartInstance = useRef(null);
  const categoryChartInstance = useRef(null);

  // Fetch dữ liệu từ APIs
  useEffect(() => {
    fetchAllData();
  }, [pagination.currentPage]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const baseURL = import.meta.env.VITE_BE_URL;

      // Fetch payments
      const paymentsResponse = await fetch(
        `${baseURL}/api/payment?page=${pagination.currentPage}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData.data.payments || []);
        setPagination({
          currentPage: paymentsData.data.currentPage || 1,
          totalPages: paymentsData.data.totalPages || 1,
          totalItems: paymentsData.data.totalItems || 0
        });
      }

      // Fetch stacks
      const stacksResponse = await fetch(`${baseURL}/api/stack`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (stacksResponse.ok) {
        const stacksData = await stacksResponse.json();
        setStacks(stacksData.stacks || []);
      }

      // Fetch categories  
      const categoriesResponse = await fetch(`${baseURL}/api/category`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Filter và sort payments
  const getFilteredAndSortedPayments = () => {
    let filtered = payments.filter((payment) =>
      payment.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
      payment.user_id?.toLowerCase().includes(search.toLowerCase())
    );

    // Sort theo sortBy
    switch (sortBy) {
      case 'amount_high':
        filtered.sort((a, b) => b.payment_amount - a.payment_amount);
        break;
      case 'amount_low':
        filtered.sort((a, b) => a.payment_amount - b.payment_amount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredPayments = getFilteredAndSortedPayments();

  // Tính tổng giá trị giao dịch
  const getTotalValue = () => {
    const total = payments.reduce((sum, payment) => sum + payment.payment_amount, 0);
    return (total / 1000000).toFixed(1) + 'M';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Get stack name by ID
  const getStackName = (stackId) => {
    const stack = stacks.find(s => s._id === stackId);
    return stack ? stack.stack_name : 'Unknown';
  };

  // Tạo dữ liệu thống kê cho charts
  const getMonthlyData = () => {
    const monthlyStats = {};
    payments.forEach(payment => {
      const month = new Date(payment.payment_date).getMonth();
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });

    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    return months.map((month, index) => monthlyStats[index] || 0);
  };

  const getStackStats = () => {
    const stackStats = {};
    payments.forEach(payment => {
      const stackName = getStackName(payment.payment_stack);
      stackStats[stackName] = (stackStats[stackName] || 0) + 1;
    });
    return stackStats;
  };

  // Render charts
  useEffect(() => {
    if (loading || payments.length === 0) return;

    // Monthly transactions chart
    if (monthlyChartRef.current) {
      const ctx = monthlyChartRef.current.getContext('2d');

      if (monthlyChartInstance.current) {
        monthlyChartInstance.current.destroy();
      }

      const monthlyData = getMonthlyData();

      monthlyChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          datasets: [{
            label: 'Giao dịch',
            data: monthlyData,
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

    // Stack statistics chart
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext('2d');

      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }

      const stackStats = getStackStats();
      const stackLabels = Object.keys(stackStats);
      const stackData = Object.values(stackStats);

      categoryChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: stackLabels,
          datasets: [{
            data: stackData,
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
  }, [payments, stacks, loading]);

  // Stack revenue data for bar chart
  const getStackRevenues = () => {
    const revenueData = {};
    payments.forEach(payment => {
      const stackName = getStackName(payment.payment_stack);
      revenueData[stackName] = (revenueData[stackName] || 0) + payment.payment_amount;
    });

    return Object.entries(revenueData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 7)
      .map(([name, amount]) => ({
        name,
        height: Math.max(60, (amount / Math.max(...Object.values(revenueData))) * 200)
      }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return (
      <>
        <Header />
        <HeroSectionAdmin message={<>Trang quản lý <br /> giao dịch</>} />
        <div className="manage-transaction-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>Đang tải dữ liệu...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <HeroSectionAdmin message={<>Trang quản lý <br /> giao dịch</>} />

      <div className="manage-transaction-container">
        {/* Header với search và filter */}
        <div className="transaction-header">
          <div className="transaction-search-bar">
            <input
              type="text"
              placeholder="Tìm theo mã GD, user ID"
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
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="amount_high">Giá trị cao nhất</option>
                <option value="amount_low">Giá trị thấp nhất</option>
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
                <th>User ID</th>
                <th>Giá trị</th>
                <th>Ngày/Giờ</th>
                <th>Gói dịch vụ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td data-label="Mã GD">
                    <span className="tx-id">{payment.transaction_id}</span>
                  </td>
                  <td data-label="User ID">{payment.user_id}</td>
                  <td data-label="Giá trị">
                    <span className="transaction-amount">
                      {formatCurrency(payment.payment_amount)}
                    </span>
                  </td>
                  <td data-label="Ngày/Giờ">{formatDate(payment.payment_date)}</td>
                  <td data-label="Gói dịch vụ">{getStackName(payment.payment_stack)}</td>
                  <td data-label="Trạng thái">
                    <span className={`status ${payment.payment_status === 'completed' ? 'status-open' : 
                      payment.payment_status === 'pending' ? 'status-busy' : 'status-closed'}`}>
                      {payment.payment_status === 'completed' ? 'Hoàn thành' :
                       payment.payment_status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-data">
                    Không tìm thấy giao dịch phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="transaction-pagination">
          {pagination.currentPage > 1 && (
            <span onClick={() => handlePageChange(pagination.currentPage - 1)}>
              &lt;
            </span>
          )}
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <span
              key={page}
              className={pagination.currentPage === page ? 'page-active' : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </span>
          ))}
          
          {pagination.currentPage < pagination.totalPages && (
            <span onClick={() => handlePageChange(pagination.currentPage + 1)}>
              &gt;
            </span>
          )}
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

          {/* Thống kê gói dịch vụ */}
          <div className="chart-container">
            <h3 className="chart-title">Thống kê giao dịch theo gói dịch vụ</h3>
            <p className="chart-subtitle">Các gói dịch vụ phổ biến nhất</p>
            <div className="chart-wrapper">
              <canvas ref={categoryChartRef}></canvas>
            </div>

            <div className="legend">
              {stacks.map((stack, index) => (
                <div key={stack._id} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ 
                      background: ['#4FC3F7', '#29B6F6', '#03A9F4', '#0288D1', '#0277BD'][index % 5] 
                    }}
                  ></div>
                  <span>{stack.stack_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Biểu đồ doanh thu theo gói */}
        <div className="business-revenue-section">
          <div className="revenue-chart-header">
            <h3 className="revenue-chart-title">
              📊 Top gói dịch vụ có doanh thu cao nhất
            </h3>
            <div className="sort-select">
              <select>
                <option>Sắp xếp: Cao nhất</option>
                <option>Thấp nhất</option>
              </select>
            </div>
          </div>

          <div className="revenue-bars">
            {getStackRevenues().map((stack, index) => (
              <div key={index} className="revenue-bar-container">
                <div
                  className="revenue-bar"
                  style={{ height: `${stack.height}px` }}
                  title={`Doanh thu: ${formatCurrency(
                    payments
                      .filter(p => getStackName(p.payment_stack) === stack.name)
                      .reduce((sum, p) => sum + p.payment_amount, 0)
                  )}`}
                ></div>
                <div className="business-name">{stack.name}</div>
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