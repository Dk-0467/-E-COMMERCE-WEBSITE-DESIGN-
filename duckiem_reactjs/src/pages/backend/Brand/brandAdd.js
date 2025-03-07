import React, { useState } from 'react';
import BrandService from '../../../services/BrandServices'; 
import { useNavigate } from 'react-router-dom';

const AddBrand = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState(1); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('description', description);
    formData.append('slug', slug);
    formData.append('sort_order', sortOrder);
    formData.append('status', status);

    try {
      const response = await BrandService.insert(formData);
      if (response.status) {
        alert('Thêm brand thành công');
        navigate('/admin/brand');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-semibold text-blue-600 mb-6">Add New Brand</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter brand name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Image</label>
          <input
            type="file"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter brand description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Slug</label>
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter brand slug"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Sort Order</label>
          <input
            type="number"
            className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="Enter sort order"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
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
          className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Add Brand
        </button>
      </form>
    </div>
  );
};

export default AddBrand;
