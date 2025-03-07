import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa';
import ProductService from '../../../services/ProductServices';
import { toast } from 'react-toastify';

const ProductTrash = () => {
  const [trashedProducts, setTrashedProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await ProductService.trash();
      setTrashedProducts(result.products);
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await ProductService.restore(id);
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
      await ProductService.destroy(id);
      setTrashedProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success("Sản phẩm đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại!");
      console.error("Xóa sản phẩm thất bại", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thùng Rác - Sản Phẩm Đã Xóa</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Mã</th>
              <th className="py-3 px-6 text-left">Hình Ảnh</th>
              <th className="py-3 px-6 text-left">Tên Sản Phẩm</th>
              <th className="py-3 px-6 text-left">Mô Tả</th>
              <th className="py-3 px-6 text-left">Giá</th>
              <th className="py-3 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedProducts.length > 0 ? (
              trashedProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{product.id}</td>
                  <td className="py-3 px-6 text-left">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={`http://127.0.0.1:8000/images/product/${product.images[0].thumbnail}`} 
                        alt={product.name} 
                        className="h-16 w-16 object-cover rounded-lg shadow-sm"
                        onError={(e) => { e.target.src = '/path/to/default-image.jpg'; }} 
                      />
                    ) : (
                      <span className="text-gray-400">Không có hình ảnh</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">{product.name}</td>
                  <td className="py-3 px-6 text-left">{product.description}</td>
                  <td className="py-3 px-6 text-left">{product.price.toLocaleString()}₫</td>
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

export default ProductTrash;
