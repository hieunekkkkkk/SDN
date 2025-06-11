import React, { useState } from 'react';
import HeroSectionAdmin from '../../components/HeroSectionAdmin';
import '../../css/AdminManagePage.css';
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoBanSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import Header from '../../components/Header';

function ManageUserPage() {
  const [businesses, setBusinesses] = useState([
    { name: 'Alice Johnson', owner: 'Alice J.', type: 'Restaurant', register: '2023-05-12', status: 'Active' },
    { name: 'Bob Smith', owner: 'Bob S.', type: 'Hotel', register: '2024-01-08', status: 'Pending' },
    { name: 'Carla Gomez', owner: 'Carla G.', type: 'Cafe', register: '2022-11-20', status: 'Deactivate' },
    { name: 'David Lee', owner: 'David L.', type: 'Motel', register: '2023-07-03', status: 'Active' },
    { name: 'Emily Chen', owner: 'Emily C.', type: 'Restaurant', register: '2023-03-15', status: 'Deactivate' },
    { name: 'Frank Ngu', owner: 'Frank N.', type: 'Hotel', register: '2024-02-17', status: 'Pending' },
    { name: 'Grace Park', owner: 'Grace P.', type: 'Cafe', register: '2023-12-01', status: 'Active' },
    { name: 'Henry Vu', owner: 'Henry V.', type: 'Restaurant', register: '2024-04-09', status: 'Pending' },
    { name: 'Isabel Wang', owner: 'Isabel W.', type: 'Motel', register: '2023-09-23', status: 'Active' },
    { name: 'Jake Tan', owner: 'Jake T.', type: 'Hotel', register: '2022-10-30', status: 'Deactivate' },
  ]);

  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState('All');

  const handleBan = (index, name) => {
    const updated = [...businesses];
    updated[index].status = 'Deactivate';
    setBusinesses(updated);
    toast.success(`Deactivated business "${name}" successfully!`);
  };

  const handleActivate = (index, name) => {
    const updated = [...businesses];
    updated[index].status = 'Active';
    setBusinesses(updated);
    toast.success(`Activated business "${name}" successfully!`);
  };

  const filteredBusinesses = businesses.filter((b) =>
    (b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.owner.toLowerCase().includes(search.toLowerCase())) &&
    (sortStatus === 'All' || b.status === sortStatus)
  );

  return (
    <>
      <Header />
      <HeroSectionAdmin message={<>Trang quản lý <br /> doanh nghiệp</>} />

      <div className="manage-container">
        <div className="manage-table-header">
          <div className="manage-search-bar">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc chủ doanh nghiệp"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="manage-sort-select">
            Sắp xếp:&nbsp;
            <select value={sortStatus} onChange={(e) => setSortStatus(e.target.value)}>
              <option value="All">Tất cả</option>
              <option value="Active">Kích hoạt</option>
              <option value="Deactivate">Vô hiệu hóa</option>
              <option value="Pending">Tạm chờ</option>
            </select>
          </div>
        </div>
        <div className='manage-table-container'>
          <table className='manage-table'>
            <thead>
              <tr>
                <th>Tên doanh nghiệp</th>
                <th>Tên chủ doanh nghiệp</th>
                <th>Loại doanh nghiệp</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((b, i) => (
                <tr key={i}>
                  <td>{b.name}</td>
                  <td>{b.owner}</td>
                  <td>{b.type}</td>
                  <td>{b.register}</td>
                  <td>
                    <span className={`manage-status ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'Deactivate' && (
                      <FaRegCircleCheck
                        className="manage-actions action-check"
                        onClick={() => handleActivate(i, b.name)}
                        title="Activate business"
                      />
                    )}
                    {b.status === 'Active' && (
                      <IoBanSharp
                        className="manage-actions action-ban"
                        onClick={() => handleBan(i, b.name)}
                        title="Deactivate business"
                      />
                    )}
                    {b.status === 'Pending' && (
                      <>
                        <FaRegCircleCheck
                          className="manage-actions action-check"
                          onClick={() => handleActivate(i, b.name)}
                          title="Approve business"
                        />
                        <IoBanSharp
                          className="manage-actions action-ban"
                          onClick={() => handleBan(i, b.name)}
                          title="Reject business"
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBusinesses.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Không tồn tại doanh nghiệp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="manage-pagination">
          &lt; <span className="page">1</span><span>2</span><span>3</span><span>4</span>
          <span>5</span><span>6</span><span>7</span><span>8</span> &gt;
        </div>
      </div>
    </>
  );
}

export default ManageUserPage;
