import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserServices';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [roles, setRoles] = useState('');
  const [status, setStatus] = useState(1);
  const [thumbnail, setThumbnail] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await UserService.show(id);
        const user = response.user;
        setName(user.name);
        setEmail(user.email);
        setFullname(user.fullname);
        setGender(user.gender);
        setPhone(user.phone);
        setAddress(user.address);
        setRoles(user.roles);
        setStatus(user.status);
        setCurrentThumbnail(user.thumbnail);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) {
      formData.append('password', password);
    }
    formData.append('fullname', fullname);
    formData.append('gender', gender);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('roles', roles);
    formData.append('status', status);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      const response = await UserService.update(formData, id);
      if (response.status) {
        alert('Cập nhật người dùng thành công');
        navigate('/admin/user');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Chỉnh sửa người dùng</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Để trống nếu không muốn thay đổi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giới tính</label>
          <select
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vai trò</label>
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
          <select
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Ngừng hoạt động</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
          {currentThumbnail && (
            <div className="mb-2 flex justify-center">
              <img
                src={`http://127.0.0.1:8000/images/users/${currentThumbnail}`}
                alt={fullname}
                className="h-20 w-20 object-cover rounded-full border-2 border-gray-300"
              />
            </div>
          )}
          <input
            type="file"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md outline-none transition"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
          >
            Cập nhật người dùng
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
