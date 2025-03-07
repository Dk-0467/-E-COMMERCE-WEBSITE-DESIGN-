import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BannerService from '../../../services/BannerServices';

const EditBanner = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState(1); 
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await BannerService.show(id); 
        const banner = response.banner;
        setName(banner.name);
        setLink(banner.link);
        setDescription(banner.description);
        setPosition(banner.position);
        setSortOrder(banner.sort_order);
        setStatus(banner.status);
        setCurrentImage(banner.image); 
      } catch (error) {
        console.error('Lỗi khi lấy thông tin banner:', error);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('link', link);
    if (image) {
      formData.append('image', image); 
    }
    formData.append('description', description);
    formData.append('position', position);
    formData.append('sort_order', sortOrder);
    formData.append('status', status);

    try {
      const response = await BannerService.update(formData, id);
      if (response.status) {
        alert('Cập nhật banner thành công');
        navigate('/admin/banner'); 
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-center text-3xl font-bold mb-6">Chỉnh Sửa Banner</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-4">
        {/* Grid for two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tên Banner</label>
            <input
              type="text"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Liên Kết</label>
            <input
              type="url"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Vị Trí</label>
            <input
              type="text"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Thứ Tự Sắp Xếp</label>
            <input
              type="number"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Mô Tả</label>
            <textarea
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Trạng Thái</label>
            <select
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value={1}>Kích hoạt</option>
              <option value={0}>Ngừng hoạt động</option>
            </select>
          </div>
        </div>

        {/* Image input field */}
        <div className="mt-6 flex items-center">
          <div className="flex-none w-1/3">
            <label className="block text-sm font-medium mb-2">Hình Ảnh</label>
            {currentImage && (
              <div className="mb-2">
                <img
                  src={`http://127.0.0.1:8000/images/banner/${currentImage}`}
                  alt={name}
                  className="h-20 w-20 object-cover rounded-lg border border-gray-300 mb-2"
                />
              </div>
            )}
            <input
              type="file"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full"
        >
          Cập Nhật Banner
        </button>
      </form>
    </div>
  );
};

export default EditBanner;
