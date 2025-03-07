import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategoryService from '../../../services/CategoryServices';

const CategoryDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await CategoryService.show(id); // Gọi API để lấy chi tiết category
        setCategory(response.category);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết category:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Không tìm thấy danh mục!</p>
      </div>
    );
  }

  const imageUrl = `http://127.0.0.1:8000/images/category/${category.image}`;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-center text-3xl font-bold mb-4">Chi tiết Danh Mục</h2>
      <div className="bg-white p-6 shadow-md rounded-lg">
        {category.image && (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <div className="mb-2">
          <p className="font-semibold"><strong>Tên:</strong> {category.name}</p>
          <p className="font-semibold"><strong>Slug:</strong> {category.slug}</p>
          <p className="font-semibold"><strong>Mô Tả:</strong> {category.description || 'Không có mô tả'}</p>
          <p className="font-semibold"><strong>Thứ tự:</strong> {category.sort_order}</p>
          <p className="font-semibold"><strong>Trạng Thái:</strong> {category.status === 1 ? 'Kích hoạt' : 'Ngừng kích hoạt'}</p>
        </div>

        <div className="mt-6">
          <Link to="/admin/category" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
