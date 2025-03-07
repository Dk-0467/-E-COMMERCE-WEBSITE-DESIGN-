import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductStores from '../../../services/ProductStoreServices';
import { FaToggleOn, FaToggleOff, FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';

const ProductStore = () => {
  const [productStores, setProductStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductStores = async () => {
      try {
        const result = await ProductStores.index();
        setProductStores(result.productstores);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProductStores();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productStores.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productStores.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Hàm thay đổi trạng thái sản phẩm
  const handleStatusChange = async (id) => {
    try {
      const result = await ProductStores.status(id);
      setProductStores((prevStores) =>
        prevStores.map((store) => {
          if (store.id === id) {
            return { ...store, status: result.productstore?.status };
          }
          return store;
        })
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const result = await ProductStores.delete(id);
        if (result.status) {
          setProductStores((prevStores) => prevStores.filter((store) => store.id !== id));
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Nhập Kho</h1>
      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin/productStore_add')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm Nhập Kho
        </button>

        <Link to='/admin/productStore_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Danh sách xóa
          </button>
        </Link>
      </div>

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
          {currentProducts.map(productStore => (
            <tr key={productStore.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{productStore.id}</td>
              <td className="py-3 px-6 text-left">{productStore.product_id}</td>
              <td className="py-3 px-6 text-left">{productStore.price_root}</td>
              <td className="py-3 px-6 text-left">{productStore.qty}</td>
              <td className="py-3 px-6 text-left">{new Date(productStore.created_at).toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{new Date(productStore.updated_at).toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
              <button
                  onClick={() => handleStatusChange(productStore.id)}
                  className={`py-1 px-2 mx-0.5 text-white rounded-md ${productStore.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {productStore.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                </button>
                <Link to={`/admin/productStore_show/${productStore.id}`}>
                  <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEye className="text-sm" />
                  </button>
                </Link>
                <Link to={`/admin/productStore_update/${productStore.id}`}>
                  <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEdit className="text-sm" />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(productStore.id)}
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
            onClick={() => handlePageChange(index + 1)} 
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} mx-1 rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductStore;
