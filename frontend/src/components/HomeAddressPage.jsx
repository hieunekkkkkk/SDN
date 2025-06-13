// HomeAddressPage.jsx
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import '../css/HomeAddressPage.css';
import { toast } from 'react-toastify';

const HomeAddressPage = () => {
  const { user, isLoaded } = useUser();
  const [address, setAddress] = useState(() => {
    const addr = user?.unsafeMetadata?.homeAddress || {};
    return {
      city: addr.city || '',
      district: addr.district || '',
      ward: addr.ward || '',
      house_number: addr.house_number || '',
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!isLoaded) return;
    try {
      await user.update({
        unsafeMetadata: {
          homeAddress: address,
        },
      });
      toast.success('Địa chỉ cập nhật thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Error updating address:', err);
      toast.error('Địa chỉ cập nhật thất bài', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="address-container">
      <p className="address-header">Địa chỉ</p>
      <form className="address-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="form-group">
          <label htmlFor="city">Tỉnh/Thành phố:</label>
          <input id="city" name="city" value={address.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="district">Quận/Huyện</label>
          <input id="district" name="district" value={address.district} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="ward">Phường/Xã</label>
          <input id="ward" name="ward" value={address.ward} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="house_number">Tên Đường, Tòa nhà, Số nhà</label>
          <input id="house_number" name="house_number" value={address.house_number} onChange={handleChange} />
        </div>
        <div className="save-button-container">
          <button type="submit" className="save-button">Lưu địa chỉ</button>
        </div>
      </form>
    </div>

  );
};

export default HomeAddressPage;
