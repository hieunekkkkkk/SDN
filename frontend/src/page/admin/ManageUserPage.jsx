import React, { useState } from 'react';
import HeroSectionAdmin from '../../components/HeroSectionAdmin';
import Footer from '../../components/Footer';
import '../../css/AdminManagePage.css';
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoBanSharp } from "react-icons/io5";
import { toast } from 'react-toastify';

function ManageUserPage() {
  const [users, setUsers] = useState([
    { id: 'U001', name: 'Alice Johnson', role: 'Owner', status: 'Active' },
    { id: 'U002', name: 'Bob Smith', role: 'User', status: 'Pending' },
    { id: 'U003', name: 'Carla Gomez', role: 'Admin', status: 'Deactivate' },
    { id: 'U004', name: 'David Lee', role: 'Owner', status: 'Active' },
    { id: 'U005', name: 'Emily Chen', role: 'User', status: 'Deactivate' },
    { id: 'U006', name: 'Frank Ngu', role: 'User', status: 'Pending' },
    { id: 'U007', name: 'Grace Park', role: 'Admin', status: 'Active' },
    { id: 'U008', name: 'Henry Vu', role: 'Owner', status: 'Pending' },
    { id: 'U009', name: 'Isabel Wang', role: 'User', status: 'Active' },
    { id: 'U010', name: 'Jake Tan', role: 'Owner', status: 'Deactivate' },
  ]);

  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState('All');

  const handleBan = (index, id) => {
    const updated = [...users];
    updated[index].status = 'Deactivate';
    setUsers(updated);
    toast.success(`Vô hiệu hóa người dùng ${id} thành công!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleActivate = (index, id) => {
    const updated = [...users];
    updated[index].status = 'Active';
    setUsers(updated);
    toast.success(`Kích hoạt người dùng ${id} thành công!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const filteredUsers = users.filter((user) =>
    (user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase())) &&
    (sortStatus === 'All' || user.status === sortStatus)
  );

  return (
    <>
      <HeroSectionAdmin message={<>Trang quản lý <br /> người dùng</>} />

      <div className="manage-container">
        <div className="manage-table-header">
          <div className="manage-search-bar">
            <input
              type="text"
              placeholder="Tìm theo ID, tên"
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
                <th>Tên người dùng</th>
                <th>ID</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={i}>
                  <td>{user.name}</td>
                  <td>{user.id}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`manage-status ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    {user.status === 'Deactivate' && (
                      <FaRegCircleCheck
                        className="manage-actions action-check"
                        onClick={() => handleActivate(i, user.id)}
                        title="Activate user"
                      />
                    )}
                    {user.status === 'Active' && (
                      <IoBanSharp
                        className="manage-actions action-ban"
                        onClick={() => handleBan(i, user.id)}
                        title="Deactivate user"
                      />
                    )}
                    {user.status === 'Pending' && (
                      <>
                        <FaRegCircleCheck
                          className="manage-actions action-check"
                          onClick={() => handleActivate(i, user.id)}
                          title="Approve user"
                        />
                        <IoBanSharp
                          className="manage-actions action-ban"
                          onClick={() => handleBan(i, user.id)}
                          title="Reject user"
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    Không tồn tại người dùng.
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

      <Footer />
    </>
  );
}

export default ManageUserPage;
