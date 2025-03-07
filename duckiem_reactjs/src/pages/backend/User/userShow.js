import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserService from '../../../services/UserServices';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await UserService.show(id);
        setUser(response.user);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết người dùng:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Không tìm thấy người dùng!</p>;
  }

  const avatarUrl = user.thumbnail 
    ? `http://127.0.0.1:8000/images/users/${user.thumbnail}` 
    : 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'; // URL ảnh đại diện mặc định

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-center text-3xl font-semibold mb-6 text-gray-700">Chi tiết người dùng</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start p-6">
          <img
            src={avatarUrl}
            alt={user.fullname || 'User Avatar'}
            className="h-48 w-48 object-cover rounded-full border-2 border-gray-200 mb-4 md:mb-0 md:mr-8"
          />
          <div className="flex flex-col md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Tên:</span>
                <span className="text-gray-800">{user.name}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Họ và tên:</span>
                <span className="text-gray-800">{user.fullname}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Số điện thoại:</span>
                <span className="text-gray-800">{user.phone}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Địa chỉ:</span>
                <span className="text-gray-800">{user.address}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Giới tính:</span>
                <span className="text-gray-800">{user.gender}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Vai trò:</span>
                <span className="text-gray-800">{user.roles}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">Trạng thái:</span>
                <span className="text-gray-800">
                  {user.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link to="/admin/user" className="block text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
