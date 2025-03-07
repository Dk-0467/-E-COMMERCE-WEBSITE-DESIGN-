import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import MenuService from '../../../services/MenuServices'; // Assumed service for API calls
import { Link, useNavigate } from 'react-router-dom';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menusPerPage] = useState(5); 
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await MenuService.index();
      setMenus(result.menus);
    })();
  }, []);

  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(menus.length / menusPerPage);

  const handleStatusChange = async (id) => {
    try {
      const result = await MenuService.status(id);
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === id ? { ...menu, status: result.menu.status } : menu
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa menu này?")) {
      try {
        await MenuService.delete(id);
        setMenus((prevMenus) => prevMenus.filter(menu => menu.id !== id));
      } catch (error) {
        console.error("Failed to delete menu", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Menu</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin/menu_add')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm Menu
        </button>
        <Link to='/admin/menu_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mx-2"
          >
            Danh sách xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Tên Menu</th>
            <th className="py-3 px-6 text-left">Liên kết</th>
            <th className="py-3 px-6 text-left">Mô tả</th>
            <th className="py-3 px-6 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentMenus.map(menu => (
            <tr key={menu.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{menu.id}</td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <span className="font-medium">{menu.name}</span>
              </td>
              <td className="py-3 px-6 text-left">{menu.link}</td>
              <td className="py-3 px-6 text-left">{menu.type}</td>
              <td className="py-3 px-6 text-left">
                <button
                    onClick={() => handleStatusChange(menu.id)}
                    className={`py-1 px-2 mx-0.5 text-white rounded-md ${menu.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {menu.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                  </button>
                <Link to={`/admin/menu_show/${menu.id}`}>
                  <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEye className="text-sm" />
                  </button>
                </Link>
                <Link to={`/admin/menu_edit/${menu.id}`}>
                  <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEdit className="text-sm" />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(menu.id)}
                  className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                >
                  <FaTrashAlt className="text-sm" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => paginate(index + 1)} 
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} mx-1 rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
