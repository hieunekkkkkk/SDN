import React, { useState } from 'react';
import HeroSectionAdmin from '../../components/HeroSectionAdmin';
import '../../css/ManageUserPage.css';
import { FaSearch } from "react-icons/fa";

function ManageUserPage() {
  const initialUsers = [
    { name: 'Hector Hugo', id: 'xxxxxx', role: 'Owner', status: 'Active' },
    { name: 'Hector Hugo1', id: 'xxxxxx', role: 'Owner', status: 'Active' },
    { name: 'Hector Hugo2', id: 'xxxxxx', role: 'Owner', status: 'Deactivate' },
    { name: 'Hector Hugo3', id: 'xxxxxx', role: 'User', status: 'Deactivate' },
    { name: 'Hector Hugo4', id: 'xxxxxx', role: 'Owner', status: 'Pending' },
    { name: 'Hector Hugo5', id: 'xxxxxx', role: 'Owner', status: 'Pending' },
    { name: 'Hector Hugo6', id: 'xxxxxx', role: 'Owner', status: 'Active' },
  ];

  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState('All');

  const filteredUsers = initialUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) &&
    (sortStatus === 'All' || user.status === sortStatus)
  );

  return (
    <>
      <HeroSectionAdmin message="Trang quản lý người dùng" />

      <div className="manage-user-table-container">
        <div className="manage-user-table-header">
          <div className="manage-user-search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="manage-user-sort-select">
            Sort:&nbsp;
            <select value={sortStatus} onChange={(e) => setSortStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Deactivate">Deactivate</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr key={i}>
                <td>{user.name}</td>
                <td>{user.id}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`manage-user-status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.status === 'Deactivate' || user.status === 'Pending' ? '✅' : '🚫'}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="manage-user-pagination">
          &lt; <span className="page">1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span> &gt;
        </div>
      </div>
    </>
  );
}

export default ManageUserPage;
