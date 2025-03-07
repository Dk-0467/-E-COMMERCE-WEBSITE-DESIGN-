import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BrandService from '../../../services/BrandServices';

const BrandEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await BrandService.show(id);
        if (response.status) {
          setBrand(response.brand);
          setName(response.brand.name);
          setSlug(response.brand.slug);
          setDescription(response.brand.description);
          setSortOrder(response.brand.sort_order);
          setStatus(response.brand.status);
          setCurrentImage(response.brand.image);
        } else {
          alert(response.message);
          navigate('/admin/brand'); // Chuyển hướng nếu không tìm thấy
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin thương hiệu:', error);
        alert('Có lỗi xảy ra khi lấy dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('sort_order', sortOrder);
    formData.append('status', status);
    
    // Chỉ thêm hình ảnh mới nếu có
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('currentImage', currentImage);
    }

    try {
      const response = await BrandService.update(formData, id);
      if (response.status) {
        alert('Cập nhật thương hiệu thành công');
        navigate('/admin/brand'); // Chuyển hướng đến danh sách
      } else {
        alert('Có lỗi xảy ra: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center">Đang tải dữ liệu...</div>;
  }

  if (!brand) {
    return <div className="text-center">Không tìm thấy thương hiệu.</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-center text-3xl font-semibold mb-8 text-gray-800">Chỉnh Sửa Thương Hiệu</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Tên</label>
          <input
            type="text"
            className="border border-gray-300 w-full p-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Slug</label>
          <input
            type="text"
            className="border border-gray-300 w-full p-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Mô Tả</label>
          <textarea
            className="border border-gray-300 w-full p-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Thứ Tự Sắp Xếp</label>
          <input
            type="number"
            className="border border-gray-300 w-full p-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Trạng Thái</label>
          <select
            className="border border-gray-300 w-full p-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value={1}>Kích hoạt</option>
            <option value={0}>Ngừng hoạt động</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Hình Ảnh</label>
          {currentImage && (
            <div className="mb-2">
              <img
                src={`http://127.0.0.1:8000/images/brands/${currentImage}`}
                alt={name}
                className="h-32 w-32 object-cover rounded-md mb-2"
              />
            </div>
          )}
          <input
            type="file"
            className="border border-gray-300 w-full p-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Cập nhật Thương Hiệu
        </button>
      </form>
    </div>
  );
};

export default BrandEdit;
