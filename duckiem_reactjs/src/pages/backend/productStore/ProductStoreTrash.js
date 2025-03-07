import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductStores from '../../../services/ProductStoreServices';
import { FaUndo, FaEye, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TrashProductStore = () => {
  const [productStores, setProductStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrashProductStores = async () => {
      try {
        const result = await ProductStores.trash(); // Gọi API lấy danh sách sản phẩm đã xóa
        setProductStores(result.productstores);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm đã xóa:", error);
        setLoading(false);
      }
    };

    fetchTrashProductStores();
  }, []);

  const handleRestore = async (id) => {
    try {
      await ProductStores.restore(id); // Gọi API khôi phục sản phẩm
      setProductStores(prev => prev.filter(productStore => productStore.id !== id));
      toast.success("Sản phẩm đã được phục hồi!");
    } catch (error) {
      toast.error("Phục hồi sản phẩm thất bại!");
      console.error("Phục hồi sản phẩm thất bại", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này vĩnh viễn không?");
    if (!isConfirmed) return;

    try {
      await ProductStores.destroy(id); // Gọi API xóa sản phẩm vĩnh viễn
      setProductStores(prev => prev.filter(productStore => productStore.id !== id));
      toast.success("Sản phẩm đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại!");
      console.error("Xóa sản phẩm thất bại", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh Sách Sản Phẩm Đã Xóa</h1>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">ID Sản Phẩm</th>
            <th className="py-3 px-6 text-left">Giá Gốc</th>
            <th className="py-3 px-6 text-left">Số Lượng</th>
            <th className="py-3 px-6 text-left">Thời Gian Tạo</th>
            <th className="py-3 px-6 text-left">Thời Gian Cập Nhật</th>
            <th className="py-3 px-6 text-left">Hành Động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {productStores.length > 0 ? (
            productStores.map(productStore => (
              <tr key={productStore.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{productStore.id}</td>
                <td className="py-3 px-6 text-left">{productStore.product_id}</td>
                <td className="py-3 px-6 text-left">{productStore.price_root}</td>
                <td className="py-3 px-6 text-left">{productStore.qty}</td>
                <td className="py-3 px-6 text-left">{new Date(productStore.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{new Date(productStore.updated_at).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left flex space-x-2">
                  <button
                    onClick={() => handleRestore(productStore.id)}
                    className="bg-green-500 py-1 px-2 text-white rounded-md flex items-center"
                  >
                    <FaUndo className="text-sm mr-1" /> Khôi Phục
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(productStore.id)}
                    className="bg-red-500 py-1 px-2 text-white rounded-md flex items-center"
                  >
                    <FaTrashAlt className="text-sm mr-1" /> Xóa Vĩnh Viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                Không có sản phẩm nào trong thùng rác.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrashProductStore;
