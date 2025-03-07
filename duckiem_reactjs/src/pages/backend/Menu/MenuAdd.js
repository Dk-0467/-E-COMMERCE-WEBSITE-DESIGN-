import React, { useState } from 'react';
import MenuService from '../../../services/MenuServices'; // Service để gửi request đến backend
import { useNavigate } from 'react-router-dom';

const AddMenu = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState(''); // Thêm loại menu
  const [status, setStatus] = useState(1); // Status mặc định là 1 (active)
  const navigate = useNavigate();

  // Xử lý sự kiện khi form được submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Tạo form data để gửi kèm thông tin menu
    const menuData = {
      name,
      link,
      type,
      status
    };

    try {
      // Gửi request để thêm menu
      const response = await MenuService.insert(menuData);
      console.log('Response từ API:', response);

      if (response.status) {
        alert('Thêm menu thành công');
        navigate('/admin/menu');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessages = error.response.data.errors;
            const formattedErrors = Object.values(errorMessages).flat().join(', ');
            alert('Lỗi: ' + formattedErrors);
          } else {
            alert('Lỗi: ' + error.message);
          }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center text-2xl mb-4">Add New Menu</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Link</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Type</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            className="border w-full p-2 rounded"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Menu
        </button>
      </form>
    </div>
  );
};

export default AddMenu;
