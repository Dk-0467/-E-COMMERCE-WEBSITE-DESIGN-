import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactService from '../../../services/ContactServices';

const AddContact = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('');
  const [table_id, setTableId] = useState('');
  const [status, setStatus] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await ContactService.insert({ name, link, type, table_id, status: status ? 1 : 0 });
      if (response.status) {
        navigate('/admin/contacts'); // Redirect to contacts list
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Đã xảy ra lỗi trong quá trình thêm danh bạ');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-2xl font-bold text-center mb-4">Thêm Danh Bạ</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">Tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">Loại</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">ID Bảng</label>
          <input
            type="number"
            value={table_id}
            onChange={(e) => setTableId(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
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

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Thêm Danh Bạ
        </button>
      </form>
    </div>
  );
};

export default AddContact;
