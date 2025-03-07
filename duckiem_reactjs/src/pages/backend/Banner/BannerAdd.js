import React, { useState } from 'react';
import BannerService from '../../../services/BannerServices';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaLink, FaTextWidth } from 'react-icons/fa';

const AddBanner = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('link', link);
    formData.append('image', image);
    formData.append('description', description);
    formData.append('position', position);
    formData.append('sort_order', sortOrder);
    formData.append('status', status);

    try {
      const response = await BannerService.insert(formData);
      if (response.status) {
        alert('Thêm banner thành công');
        navigate('/admin/banner');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Thêm Banner Mới</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex items-center border rounded-md shadow-sm">
          <div className="p-3 text-gray-500">
            <FaTextWidth />
          </div>
          <input
            type="text"
            placeholder="Tên Banner"
            className="border-none flex-1 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border rounded-md shadow-sm">
          <div className="p-3 text-gray-500">
            <FaLink />
          </div>
          <input
            type="url"
            placeholder="Liên Kết"
            className="border-none flex-1 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border rounded-md shadow-sm">
          <div className="p-3 text-gray-500">
            <FaImage />
          </div>
          <input
            type="file"
            className="border-none flex-1 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
          />
        </div>

        <div className="flex items-center border rounded-md shadow-sm">
          <textarea
            placeholder="Mô Tả"
            className="border-none flex-1 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
          />
        </div>

        <div className="flex items-center border rounded-md shadow-sm">
          <input
            type="text"
            placeholder="Vị Trí"
            className="border-none flex-1 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border rounded-md shadow-sm">
          <input
            type="number"
            placeholder="Thứ Tự Sắp Xếp"
            className="border-none flex-1 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border rounded-md shadow-sm">
          <select
            className="border-none flex-1 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value={1}>Kích hoạt</option>
            <option value={0}>Ngừng hoạt động</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Thêm Banner
        </button>
      </form>
    </div>
  );
};

export default AddBanner;
