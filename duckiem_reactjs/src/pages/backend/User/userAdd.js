import React, { useState } from 'react';
import UserService from '../../../services/UserServices';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [roles, setRoles] = useState('');
  const [status, setStatus] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      fullname,
      gender,
      phone,
      address,
      roles,
      status
    };

    try {
      const response = await UserService.insert(userData);
      if (response.status) {
        alert('Thêm người dùng thành công');
        navigate('/admin/user');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-center text-2xl mb-6">Thêm Người Dùng Mới</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tên</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="border w-full p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Mật Khẩu</label>
            <input
              type="password"
              className="border w-full p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Họ Tên</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Giới Tính</label>
            <select
              className="border w-full p-2 rounded"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Số Điện Thoại</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Địa Chỉ</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Vai Trò</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Trạng Thái</label>
            <select
              className="border w-full p-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value={1}>Kích hoạt</option>
              <option value={0}>Không kích hoạt</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Thêm Người Dùng
        </button>
      </form>
    </div>
  );
};

export default AddUser;
