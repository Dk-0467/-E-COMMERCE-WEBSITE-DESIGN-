import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/CategoryServices';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState(1);
  const [parentId, setParentId] = useState(null);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await CategoryService.show(id);
        if (response.status) {
          setCategory(response.category);
          setName(response.category.name);
          setSlug(response.category.slug);
          setDescription(response.category.description);
          setSortOrder(response.category.sort_order);
          setStatus(response.category.status);
          setParentId(response.category.parent_id);
          setCurrentImage(response.category.image);
        } else {
          alert(response.message);
          navigate('/admin/category'); // Chuyển hướng nếu không tìm thấy
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin danh mục:', error);
        alert('Có lỗi xảy ra khi lấy dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('sort_order', sortOrder);
    formData.append('status', status);
    formData.append('parent_id', parentId);
    
    // Chỉ thêm hình ảnh mới nếu có
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('currentImage', currentImage);
    }

    try {
      const response = await CategoryService.update(formData, id);
      if (response.status) {
        alert('Cập nhật danh mục thành công');
        navigate('/admin/category'); // Chuyển hướng đến danh sách
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

  if (!category) {
    return <div className="text-center">Không tìm thấy danh mục.</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-lg max-w-lg">
      <h2 className="text-center text-xl font-semibold mb-4 text-gray-800">Chỉnh Sửa Danh Mục</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Thông tin chung */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Tên</label>
            <input
              type="text"
              className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Slug</label>
            <input
              type="text"
              className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Mô Tả</label>
            <textarea
              className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Thứ Tự Sắp Xếp</label>
            <input
              type="number"
              className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Trạng Thái</label>
            <select
              className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value={1}>Kích hoạt</option>
              <option value={0}>Ngừng hoạt động</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Danh Mục Cha</label>
            <select
              className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">Chọn danh mục cha (nếu có)</option>
              {/* Thêm logic hiển thị danh sách danh mục cha ở đây */}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Hình Ảnh</label>
          {currentImage && (
            <div className="mb-2">
              <img
                src={`http://127.0.0.1:8000/images/category/${currentImage}`}
                alt={name}
                className="h-20 w-20 object-cover rounded-md mb-2"
              />
            </div>
          )}
          <input
            type="file"
            className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Cập nhật Danh Mục
        </button>
      </form>
    </div>
  );
};

export default CategoryEdit;
