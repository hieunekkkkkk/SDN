import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSectionAdmin from '../../components/HeroSectionAdmin';
import '../../css/ManageBusinessPage.css';
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoBanSharp } from "react-icons/io5";
import { RiLoginCircleLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


function ManageBusinessPage() {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  useEffect(() => {
    fetchBusinesses(currentPage);
  }, [currentPage]);

  const fetchBusinesses = async (page) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BE_URL}/api/business/`, {
        params: { page, limit }
      });
      setBusinesses(res.data.businesses);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch businesses');
    }
  };

  const updateBusinessStatus = async (index, name, newStatus) => {
    try {
      const business = businesses[index];
      const updatedBusiness = { business_active: newStatus };

      await axios.put(`${import.meta.env.VITE_BE_URL}/api/business/${business._id}`, updatedBusiness);

      const updated = [...businesses];
      updated[index].business_active = newStatus;
      setBusinesses(updated);

      toast.success(
        `${newStatus === 'active' ? 'Kích hoạt' : 'Vô hiệu hóa'} doanh nghiệp "${name}" thành công!`
      );
    } catch (err) {
      console.error('PUT error:', err.response?.data || err.message);
      toast.error(`Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} "${name}"`);
    }
  };

  const handleBan = (index, name) => {
    updateBusinessStatus(index, name, 'inactive');
  };

  const handleActivate = (index, name) => {
    updateBusinessStatus(index, name, 'active');
  };

  const handleEnterBusiness = (index, id) => {
    navigate(`/business/${id}`)
  };

  const filteredBusinesses = businesses.filter((b) =>
    (b.business_name.toLowerCase().includes(search.toLowerCase()) ||
      b.owner_id.toLowerCase().includes(search.toLowerCase())) &&
    (sortStatus === 'All' || b.business_active === sortStatus.toLowerCase())
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Header />
      <HeroSectionAdmin message={<>Trang quản lý <br /> doanh nghiệp</>} />

      <div className="manage-business-container">
        <div className="manage-business-table-header">
          <div className="manage-business-search-bar">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc chủ doanh nghiệp"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="manage-business-sort-select">
            <label>Sắp xếp:</label>
            <select value={sortStatus} onChange={(e) => setSortStatus(e.target.value)}>
              <option value="All">Tất cả</option>
              <option value="Active">Kích hoạt</option>
              <option value="Inactive">Vô hiệu hóa</option>
              <option value="Pending">Tạm chờ</option>
            </select>
          </div>
        </div>

        <div className='manage-business-table-container'>
          <table className='manage-business-table'>
            <thead>
              <tr>
                <th>Tên doanh nghiệp</th>
                <th>Chủ doanh nghiệp</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {filteredBusinesses.map((b, i) => (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <td>{b.business_name}</td>
                    <td>{b.owner_id}</td>
                    <td>{b.business_category_id?.category_name}</td>
                    <td>
                      <span className={`manage-business-status ${b.business_active.toLowerCase()}`}>
                        {b.business_active == 'active' && <p>Hoạt động</p>}
                        {b.business_active == 'pending' && <p>Chờ kiểm duyệt</p>}
                        {b.business_active == 'inactive' && <p>Bị khóa</p>}
                      </span>
                    </td>
                    <td className='manage-business-actions-icons'>
                      {b.business_active === 'inactive' && (
                        <FaRegCircleCheck
                          className="manage-business-actions action-check"
                          onClick={() => handleActivate(i, b.business_name)}
                          title="Kích hoạt doanh nghiệp"
                        />
                      )}
                      {b.business_active === 'active' && (
                        <IoBanSharp
                          className="manage-business-actions action-ban"
                          onClick={() => handleBan(i, b.business_name)}
                          title="Vô hiệu hóa doanh nghiệp"
                        />
                      )}
                      {b.business_active === 'pending' && (
                        <>
                          <FaRegCircleCheck
                            className="manage-business-actions action-check"
                            onClick={() => handleActivate(i, b.business_name)}
                            title="Chấp nhận doanh nghiệp"
                          />
                          <IoBanSharp
                            className="manage-business-actions action-ban"
                            onClick={() => handleBan(i, b.business_name)}
                            title="Từ chối doanh nghiệp"
                          />
                        </>
                      )}
                      <RiLoginCircleLine 
                        className="manage-business-actions enter"
                        onClick={() => handleEnterBusiness(i, b._id)}
                        title="Truy cập doanh nghiệp"
                      />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="manage-business-pagination">
          <button className="nav-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="nav-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}

export default ManageBusinessPage;
