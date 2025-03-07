import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaRecycle } from 'react-icons/fa'; 
import UserService from '../../../services/UserServices';
import { toast } from 'react-toastify';

const UserTrash = () => {
  const [trashedUsers, setTrashedUsers] = useState([]); 

  useEffect(() => {
    const fetchTrashedUsers = async () => {
      try {
        const result = await UserService.trash(); 
        setTrashedUsers(result.users);
      } catch (error) {
        toast.error("Không thể tải danh sách người dùng đã xóa.");
        console.error("Lỗi khi tải người dùng đã xóa:", error);
      }
    };

    fetchTrashedUsers();
  }, []);

  const handleRestore = async (id) => {
    try {
      const response = await UserService.restore(id); 
      if (response.status) {
        setTrashedUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        toast.success("Người dùng đã được phục hồi!"); 
      } else {
        toast.error(response.message || "Phục hồi người dùng thất bại!");
      }
    } catch (error) {
      toast.error("Phục hồi người dùng thất bại!");
      console.error("Phục hồi người dùng thất bại:", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa người dùng này vĩnh viễn?");
    if (!isConfirmed) return; 

    try {
      const response = await UserService.destroy(id); 
      if (response.status) {
        setTrashedUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        toast.success("Người dùng đã bị xóa vĩnh viễn!"); 
      } else {
        toast.error(response.message || "Xóa người dùng thất bại!"); 
      }
    } catch (error) {
      toast.error("Xóa người dùng thất bại!");
      console.error("Xóa người dùng thất bại:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thùng rác - Người dùng đã xóa</h1>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Họ và tên</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Số điện thoại</th>
            <th className="border border-gray-300 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trashedUsers.length > 0 ? (
            trashedUsers.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 text-center p-2">{user.id}</td>
                <td className="border border-gray-300 p-2">{user.fullname}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 text-center p-2">
                  <button
                    onClick={() => handleRestore(user.id)}
                    className="bg-green-500 py-1 px-2 mx-0.5 text-white rounded-md"
                  >
                    <FaRecycle className="text-sm" />
                    Khôi phục
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(user.id)}
                    className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                  >
                    <FaTrashAlt className="text-sm" />
                    Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Không có người dùng nào trong thùng rác.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTrash;
