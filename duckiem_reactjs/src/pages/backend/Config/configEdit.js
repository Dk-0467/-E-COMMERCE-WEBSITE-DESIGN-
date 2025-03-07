import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfigService from '../../../services/ConfigServices';

const EditConfig = () => {
  const { id } = useParams(); // Lấy ID cấu hình từ URL
  const navigate = useNavigate(); // Dùng để điều hướng sau khi chỉnh sửa thành công

  // Khởi tạo state cho các trường của cấu hình
  const [siteName, setSiteName] = useState('');
  const [email, setEmail] = useState('');
  const [phones, setPhones] = useState('');
  const [address, setAddress] = useState('');
  const [hotline, setHotline] = useState('');
  const [zalo, setZalo] = useState('');
  const [facebook, setFacebook] = useState('');
  const [status, setStatus] = useState(1); // Trạng thái mặc định là 1 (active)

  // Lấy thông tin chi tiết của cấu hình khi load trang
  useEffect(() => {
    (async () => {
      try {
        const response = await ConfigService.show(id); // Lấy thông tin cấu hình hiện tại
        const config = response.config;
        console.error(' Cau hinh:', config);
        setSiteName(config.site_name);
        setEmail(config.email);
        setPhones(config.phones);
        setAddress(config.address);
        setHotline(config.hotline);
        setZalo(config.zalo);
        setFacebook(config.facebook);
        setStatus(config.status);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cấu hình:', error);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('site_name', siteName);
    formData.append('email', email);
    formData.append('phones', phones);
    formData.append('address', address);
    formData.append('hotline', hotline);
    formData.append('zalo', zalo);
    formData.append('facebook', facebook);
    formData.append('status', status);
  
    try {
      const response = await ConfigService.update(formData, id);
      if (response.status) {
        alert('Cập nhật cấu hình thành công');
        navigate('/admin/config');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-gray-50 p-6 mt-8 shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-semibold mb-6 text-gray-700">Chỉnh sửa Cấu Hình</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phones</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={phones}
            onChange={(e) => setPhones(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hotline</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={hotline}
            onChange={(e) => setHotline(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zalo</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={zalo}
            onChange={(e) => setZalo(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
        >
          Cập nhật Cấu Hình
        </button>
      </form>
    </div>
  );
};

export default EditConfig;
