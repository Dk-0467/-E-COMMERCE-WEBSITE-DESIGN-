import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MenuService from "../../../services/MenuServices"; // Đường dẫn đến MenuService
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MenuShow = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy chi tiết menu
    const fetchMenu = async () => {
      try {
        const result = await MenuService.show(id);
        if (result.status) {
          setMenu(result.menu);
        } else {
          toast.error(result.message || "Không tìm thấy menu");
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu menu");
        console.error("Failed to fetch menu details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        <span className="ml-4">Đang tải...</span>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-red-500">Không tìm thấy menu</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-semibold">Chi tiết Menu</h1>
        <Link to="/admin/menu">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Quay lại
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Thông tin Menu</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <div className="mb-2">
              <label className="font-semibold text-gray-600">ID:</label>
              {menu.id}
            </div>
            <div className="mb-2">
              <label className="font-semibold text-gray-600">Tên Menu:</label>
              {menu.name}
            </div>
            <div className="mb-2">
              <label className="font-semibold text-gray-600">Link:</label>
              {menu.link}
            </div>
            <div className="mb-2">
              <label className="font-semibold text-gray-600">Loại Menu:</label>
              {menu.type}
            </div>
            <div className="mb-2">
              <label className="font-semibold text-gray-600">Trạng thái:</label>
              {menu.status === 1 ? "Hoạt động" : "Không hoạt động"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuShow;
