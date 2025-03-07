import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import ProductServices from '../../../services/ProductServices';
import { Link, useNavigate } from 'react-router-dom';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await ProductServices.index();
      setProducts(result.products);
    })();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleStatusChange = async (id) => {
    try {
      const result = await ProductServices.status(id);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, status: result.product.status } : product
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (confirmed) {
      try {
        await ProductServices.delete(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <h1 className="text-xl font-bold mb-2">Quản Lý Sản Phẩm</h1>

      <div className="mb-2 flex justify-between">
        <button 
          onClick={() => navigate('/admin/products/create')}
          className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition duration-300"
        >
          Thêm Sản Phẩm
        </button>
        <Link to='/admin/products_trash'>
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
          >
            Danh sách xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-300 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-2 px-2 text-left">ID</th>
            <th className="py-2 px-2 text-left">Hình ảnh</th>
            <th className="py-2 px-2 text-left">Tên sản phẩm</th>
            <th className="py-2 px-2 text-left">Danh mục</th>
            <th className="py-2 px-2 text-left">Thương hiệu</th>
            <th className="py-2 px-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentProducts.map(product => (
            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
              <td className="py-1 px-2 text-left">{product.id}</td>
              <td className="py-1 px-2 text-left">
                {product.images.length > 0 ? (
                  <img 
                    src={`http://127.0.0.1:8000/images/product/${product.images[0].thumbnail}`} 
                    alt={product.name} 
                    className="h-16 w-16 object-cover rounded-lg shadow-sm"
                    onError={(e) => { e.target.src = 'path/to/default/image.jpg'; }} 
                  />
                ) : (
                  <span className="text-gray-400">Không có hình ảnh</span>
                )}
              </td>
              <td className="py-1 px-2 text-left whitespace-nowrap">
                <span className="font-medium">{product.name}</span>
              </td>
              <td className="py-1 px-2 text-left">{product.catname}</td>
              <td className="py-1 px-2 text-left">{product.brandname}</td>
              <td className="py-1 px-2 text-left flex items-center space-x-1">
              <button
                  onClick={() => handleStatusChange(product.id)}
                  className={`py-1 px-2 mx-0.5 text-white rounded-md ${product.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {product.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                </button>
                <Link to={`/admin/products_show/${product.id}`}>
                  <button className="bg-sky-500 py-1 px-1 mx-1 text-white rounded-md transition duration-300 hover:bg-sky-600">
                    <FaEye className="text-lg" />
                  </button>
                </Link>
                <Link to={`/admin/products_update/${product.id}`}>
                  <button className="bg-blue-500 py-1 px-1 mx-1 text-white rounded-md transition duration-300 hover:bg-blue-600">
                    <FaEdit className="text-lg" />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 py-1 px-1 mx-1 text-white rounded-md transition duration-300 hover:bg-red-600"
                >
                  <FaTrashAlt className="text-lg" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-2">
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => paginate(index + 1)} 
            className={`px-2 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} mx-1 rounded-md transition duration-300`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;
