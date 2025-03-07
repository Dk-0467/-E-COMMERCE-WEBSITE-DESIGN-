import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuService from "../../../services/MenuServices";
import { toast } from "react-toastify"; // Sử dụng Toastify để thông báo người dùng
import 'react-toastify/dist/ReactToastify.css';

const EditMenu = () => {
  const { id } = useParams(); // Lấy ID của menu từ URL
  const navigate = useNavigate(); // Điều hướng sau khi cập nhật thành công
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(1); 
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading khi đang tải dữ liệu

  // Lấy dữ liệu menu khi component được tải
  useEffect(() => {
    (async () => {
      try {
        const response = await MenuService.show(id); 
        const menu = response.menu;
        
        if (menu) {
          setName(menu.name);
          setLink(menu.link);
          setType(menu.type);
          setStatus(menu.status);
        } else {
          toast.error("Không tìm thấy menu");
          navigate("/admin/menu");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin menu:", error);
        toast.error("Đã xảy ra lỗi khi tải thông tin menu");
      }
    })();
  }, [id, navigate]);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu trạng thái loading

    const menuData = {
      name,
      link,
      type,
      status
    };

    try {
      const response = await MenuService.update(menuData, id);
      if (response.status) {
        toast.success("Cập nhật menu thành công");
        navigate("/admin/menu");
      } else {
        toast.error(response.data.message || "Đã xảy ra lỗi khi cập nhật");
      }
    } catch (error) {
      console.error("Lỗi cập nhật menu:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật menu");
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Cập nhật Menu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên Menu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Menu</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Liên kết</label>
            <input
              type="url"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>

          {/* Loại Menu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Loại Menu</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>

          {/* Nút Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Cập nhật Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenu;
