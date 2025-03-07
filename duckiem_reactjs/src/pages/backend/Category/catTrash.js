import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa';
import CategoryService from '../../../services/CategoryServices'; // Sửa lại service cho phù hợp với Category
import { toast } from 'react-toastify';

const CategoryTrash = () => {
  const [trashedCategories, setTrashedCategories] = useState([]); 

  useEffect(() => {
    (async () => {
      const result = await CategoryService.trash(); // Gọi API để lấy dữ liệu các category đã bị xóa
      setTrashedCategories(result.categories);
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await CategoryService.restore(id); // Phục hồi category theo ID
      setTrashedCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      toast.success("Danh mục đã được phục hồi!");
    } catch (error) {
      toast.error("Phục hồi danh mục thất bại!");
      console.error("Phục hồi danh mục thất bại", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn danh mục này?");
    if (!isConfirmed) return;

    try {
      await CategoryService.destroy(id); // Xóa vĩnh viễn category theo ID
      setTrashedCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      toast.success("Danh mục đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa danh mục thất bại!");
      console.error("Xóa danh mục thất bại", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thùng Rác - Các Danh Mục Đã Xóa</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Mã</th>
              <th className="py-3 px-6 text-left">Hình Ảnh</th>
              <th className="py-3 px-6 text-left">Tên Danh Mục</th>
              <th className="py-3 px-6 text-left">Mô Tả</th>
              <th className="py-3 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedCategories.length > 0 ? (
              trashedCategories.map((category) => {
                const imageUrl = `http://127.0.0.1:8000/images/category/${category.image}`;
                return (
                  <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{category.id}</td>
                    <td className="py-3 px-6 text-left">
                      <img 
                        src={imageUrl} 
                        alt={category.name} 
                        className="h-16 w-16 object-cover rounded-full shadow-lg"
                      />
                    </td>
                    <td className="py-3 px-6 text-left">{category.name}</td>
                    <td className="py-3 px-6 text-left">{category.description}</td>
                    <td className="py-3 px-6 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => handleRestore(category.id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 flex items-center"
                      >
                        <FaRecycle className="mr-2" />
                        Phục Hồi
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(category.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 flex items-center"
                      >
                        <FaTrashAlt className="mr-2" />
                        Xóa Vĩnh Viễn
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Không có danh mục nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTrash;
