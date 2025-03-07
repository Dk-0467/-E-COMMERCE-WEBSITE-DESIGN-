import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa';
import MenuService from '../../../services/MenuServices'; // Sửa lại đường dẫn nếu cần
import { toast } from 'react-toastify';

const MenuTrash = () => {
  const [trashedMenus, setTrashedMenus] = useState([]); 

  useEffect(() => {
    (async () => {
      try {
        const result = await MenuService.trash(); // Gọi API để lấy dữ liệu các menu đã bị xóa
        setTrashedMenus(result.menus || []); // Nếu result.menus không tồn tại, sử dụng mảng rỗng
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu menu!");
        console.error("Lỗi tải dữ liệu menu", error);
        setTrashedMenus([]); // Đảm bảo rằng state được đặt thành mảng rỗng trong trường hợp có lỗi
      }
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await MenuService.restore(id); // Phục hồi menu theo ID
      setTrashedMenus(prevMenus => prevMenus.filter(menu => menu.id !== id));
      toast.success("Menu đã được phục hồi!");
    } catch (error) {
      toast.error("Phục hồi menu thất bại!");
      console.error("Phục hồi menu thất bại", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn menu này?");
    if (!isConfirmed) return;

    try {
      await MenuService.destroy(id); // Xóa vĩnh viễn menu theo ID
      setTrashedMenus(prevMenus => prevMenus.filter(menu => menu.id !== id));
      toast.success("Menu đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa menu thất bại!");
      console.error("Xóa menu thất bại", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Trash - Deleted Menus</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Link</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedMenus.length > 0 ? (
              trashedMenus.map((menu) => (
                <tr key={menu.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{menu.id}</td>
                  <td className="py-3 px-6 text-left">{menu.name}</td>
                  <td className="py-3 px-6 text-left">{menu.link}</td>
                  <td className="py-3 px-6 text-left">{menu.type}</td>
                  <td className="py-3 px-6 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleRestore(menu.id)}
                      className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 flex items-center"
                    >
                      <FaRecycle className="mr-2" />
                      Restore
                    </button>

                    <button
                      onClick={() => handlePermanentDelete(menu.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 flex items-center"
                    >
                      <FaTrashAlt className="mr-2" />
                      Delete Forever
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No menus in trash.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTrash;
