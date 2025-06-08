// HomeAddressPage.jsx
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import '../css/HomeAddressPage.css';
import { toast } from 'react-toastify';

const HomeAddressPage = () => {
  const vietnamAddressData = {
    "Hồ Chí Minh": {
      "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành"],
      "Quận 3": ["Phường 1", "Phường 2"],
    },
    "Hà Nội": {
      "Ba Đình": ["Phường Phúc Xá", "Phường Trúc Bạch"],
      "Đống Đa": ["Phường Cát Linh", "Phường Văn Miếu"],
    },
    "Đà Nẵng": {
      "Hải Châu": ["Phường Hải Châu 1", "Phường Hải Châu 2"],
      "Sơn Trà": ["Phường An Hải Bắc", "Phường An Hải Đông"],
    },
  };

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

    if (name === "city") {
      setAddress({ city: value, district: '', ward: '', house_number: address.house_number });
    } else if (name === "district") {
      setAddress({ ...address, district: value, ward: '' });
    } else {
      setAddress({ ...address, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!isLoaded) return;

    const currentAddress = user?.unsafeMetadata?.homeAddress || {};

    const isSameAddress = (
      currentAddress.city === address.city &&
      currentAddress.district === address.district &&
      currentAddress.ward === address.ward &&
      currentAddress.house_number === address.house_number
    );

    if (isSameAddress) {
      toast.info('Không có thay đổi nào để lưu.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await user.update({
        unsafeMetadata: {
          homeAddress: address,
        },
      });
      toast.success('Địa chỉ cập nhật thành công!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Error updating address:', err);
      toast.error('Địa chỉ cập nhật thất bại', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


  const cities = Object.keys(vietnamAddressData);
  const districts = vietnamAddressData[address.city]
    ? Object.keys(vietnamAddressData[address.city])
    : [];

  const wards = vietnamAddressData[address.city]?.[address.district] || [];


  return (
    <div className="address-container">
      <p className="address-header">Địa chỉ</p>
      <form className="address-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="address-form-group">
          <label htmlFor="city">Tỉnh/Thành phố:</label>
          <select id="city" name="city" value={address.city} onChange={handleChange} required>
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="address-form-group">
          <label htmlFor="district">Quận/Huyện:</label>
          <select id="district" name="district" value={address.district} onChange={handleChange} disabled={!address.city} required>
            <option value="">-- Chọn Quận/Huyện --</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="address-form-group">
          <label htmlFor="ward">Phường/Xã:</label>
          <select id="ward" name="ward" value={address.ward} onChange={handleChange} disabled={!address.district} required>
            <option value="">-- Chọn Phường/Xã --</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        </div>
        <div className="address-form-group">
          <label htmlFor="house_number">Tên Đường, Tòa nhà, Số nhà:</label>
          <input id="house_number" name="house_number" value={address.house_number} onChange={handleChange} required />
        </div>
        <div className="address-save-button-container">
          <button type="submit" className="address-save-button">Lưu địa chỉ</button>
        </div>
      </form>
    </div>
  );
};

export default HomeAddressPage;