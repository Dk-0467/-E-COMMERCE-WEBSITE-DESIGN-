import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa';
import ProductSaleService from '../../../services/ProductSaleServices'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';

const ProductSaleTrash = () => {
  const [trashedProducts, setTrashedProducts] = useState([]);

  useEffect(() => {
    const fetchTrashedProducts = async () => {
      try {
        const result = await ProductSaleService.trash();
        setTrashedProducts(result.productSales);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm đã xóa:", error);
      }
    };
    fetchTrashedProducts();
  }, []);

  const handleRestore = async (id) => {
    try {
      await ProductSaleService.restore(id);
      setTrashedProducts(prevProducts => prevProducts.filter(product => product.id !== id));
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
      await ProductSaleService.destroy(id);
      setTrashedProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success("Sản phẩm đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại!");
      console.error("Xóa sản phẩm thất bại", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Trash - Sản Phẩm Sale Đã Xóa</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">ID Sản Phẩm</th>
              <th className="py-3 px-6 text-left">Giá Bán</th>
              <th className="py-3 px-6 text-left">Ngày Bắt Đầu</th>
              <th className="py-3 px-6 text-left">Ngày Kết Thúc</th>
              <th className="py-3 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedProducts.length > 0 ? (
              trashedProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{product.id}</td>
                  <td className="py-3 px-6 text-left">{product.product_id}</td>
                  <td className="py-3 px-6 text-left">{product.price_sale}</td>
                  <td className="py-3 px-6 text-left">{new Date(product.date_begin).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">{new Date(product.date_end).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleRestore(product.id)}
                      className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 flex items-center"
                    >
                      <FaRecycle className="mr-2" />
                      Phục Hồi
                    </button>

                    <button
                      onClick={() => handlePermanentDelete(product.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 flex items-center"
                    >
                      <FaTrashAlt className="mr-2" />
                      Xóa Vĩnh Viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Không có sản phẩm nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSaleTrash;
