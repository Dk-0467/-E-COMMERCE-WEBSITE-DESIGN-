import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import UserService from '../../../services/UserServices'; 
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); 

  useEffect(() => {
    (async () => {
      const result = await UserService.index(); 
      setUsers(result.users);
    })();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser); 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = async (id) => {
    try {
      const result = await UserService.status(id); 
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: result.user.status } : user
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDeleteUser = async (id) => {
    // Thực hiện chức năng xóa người dùng ở đây
    // Có thể hiển thị một cảnh báo xác nhận trước khi xóa
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      // Gọi API để xóa người dùng
      try {
        await UserService.delete(id); // Xóa người dùng
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Link to='/admin/user_add/'>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            Thêm Người Dùng
          </button>
        </Link>
        
        <Link to='/admin/user_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <FaTrashAlt className="inline mr-1" /> Danh Sách Xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto border-collapse shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Tên</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Điện Thoại</th>
            <th className="border border-gray-300 p-2">Vai Trò</th>
            <th className="border border-gray-300 p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 text-center p-2">{user.id}</td>
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.phone}</td>
              <td className="border border-gray-300 p-2">{user.roles}</td>
              <td className="border border-gray-300 text-center p-2">
                <button
                  onClick={() => handleStatusChange(user.id)}
                  className={`py-1 px-2 mx-0.5 text-white rounded-md ${user.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {user.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <Link to={`/admin/user_show/${user.id}`}>
                  <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEye />
                  </button>
                </Link>
                <Link to={`/admin/edit_user/${user.id}`}>
                  <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEdit />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(number => (
          <button key={number} onClick={() => paginate(number + 1)} className={`mx-1 px-3 py-1 ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded`}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
