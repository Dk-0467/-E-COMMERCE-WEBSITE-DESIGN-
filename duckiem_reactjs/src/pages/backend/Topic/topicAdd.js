import React, { useState } from 'react';
import TopicService from '../../../services/TopicServices'; 
import { useNavigate } from 'react-router-dom';

const AddTopic = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const topicData = {
      name,
      slug,
      sort_order: sortOrder,
      description,
      status,
    };

    try {
      const response = await TopicService.insert(topicData);
      if (response.status) {
        alert('Thêm chủ đề thành công');
        navigate('/admin/topic');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">Thêm Chủ Đề Mới</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring focus:ring-blue-400"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sắp Xếp</label>
          <input
            type="number"
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring focus:ring-blue-400"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
          <select
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring focus:ring-blue-400"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value={1}>Kích hoạt</option>
            <option value={0}>Không kích hoạt</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
          <textarea
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring focus:ring-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Thêm Chủ Đề
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTopic;
