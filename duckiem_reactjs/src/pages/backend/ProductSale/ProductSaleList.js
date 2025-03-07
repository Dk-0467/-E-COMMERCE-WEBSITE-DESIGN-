import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import ProductSaleServices from '../../../services/ProductSaleServices';
import { Link, useNavigate } from 'react-router-dom';

const ProductSaleList = () => {
  const [productSales, setProductSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductSales = async () => {
      try {
        const result = await ProductSaleServices.index();
        const sortedProductSales = result.productsales.sort((a, b) => a.id - b.id);
        setProductSales(sortedProductSales);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm giảm giá:", error);
      }
    };

    fetchProductSales();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProductSales = productSales.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productSales.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = async (id) => {
    try {
      const result = await ProductSaleServices.status(id); 
      setProductSales(prevSales =>
        prevSales.map(sale =>
          sale.id === id ? { ...sale, status: result.productsale.status } : sale
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm giảm giá này không?");
    if (confirmDelete) {
      try {
        await ProductSaleServices.delete(id);
        setProductSales(prevSales => prevSales.filter(sale => sale.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm giảm giá:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Sản Phẩm Giảm Giá</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin/productSale_add')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm Sản Phẩm Giảm Giá
        </button>
        <Link to='/admin/productSale_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mx-2"
          >
            Danh sách xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Giá Bán</th>
            <th className="py-3 px-6 text-left">ID Sản Phẩm</th>
            <th className="py-3 px-6 text-left">Date_Begin</th>
            <th className="py-3 px-6 text-left">Date_End</th>
            <th className="py-3 px-6 text-left">Hành Động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentProductSales.map(productSale => (
            <tr key={productSale.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{productSale.id}</td>
              <td className="py-3 px-6 text-left">{productSale.price_sale}</td>
              <td className="py-3 px-6 text-left">{productSale.product_id}</td>
              <td className="py-3 px-6 text-left">{new Date(productSale.date_begin).toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{new Date(productSale.date_end).toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => handleStatusChange(productSale.id)}
                  className={`py-1 px-2 mx-0.5 text-white rounded-md ${productSale.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {productSale.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                </button>
                <Link to={`/admin/productSale_show/${productSale.id}`}>
                  <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEye className="text-sm" />
                  </button>
                </Link>
                <Link to={`/admin/productSale_update/${productSale.id}`}>
                  <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEdit className="text-sm" />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(productSale.id)}
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
            onClick={() => paginate(index + 1)} 
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} mx-1 rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSaleList;  
