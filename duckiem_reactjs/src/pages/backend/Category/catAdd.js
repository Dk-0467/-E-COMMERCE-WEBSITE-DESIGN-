import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/CategoryServices'; 

const AddCategory = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parent_id, setParentId] = useState('');
  const [sort_order, setSortOrder] = useState(0);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('parent_id', parent_id);
    formData.append('sort_order', sort_order);
    formData.append('description', description);
    formData.append('status', status ? 1 : 0);
    formData.append('image', image);
  
    try {
      const result = await CategoryService.insert(formData);
      if (result.status) {
        navigate('/admin/category');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Đã xảy ra lỗi trong quá trình thêm danh mục');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-2xl font-bold text-center mb-4">Thêm Danh Mục</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">Tên Danh Mục</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">ID Gốc</label>
          <input
            type="text"
            value={parent_id}
            onChange={(e) => setParentId(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">Thứ tự</label>
          <input
            type="number"
            value={sort_order}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-3 md:col-span-2">
          <label className="block text-gray-700 text-sm font-medium mb-1">Mô Tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
            rows="1"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">Trạng Thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value === 'true')}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value={true}>Kích hoạt</option>
            <option value={false}>Ngừng kích hoạt</option>
          </select>
        </div>

        <div className="mb-3 md:col-span-2">
          <label className="block text-gray-700 text-sm font-medium mb-1">Hình ảnh</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out md:col-span-2"
        >
          Thêm Danh Mục
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
