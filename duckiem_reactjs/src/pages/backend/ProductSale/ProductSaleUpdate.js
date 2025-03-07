import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductSaleService from '../../../services/ProductSaleServices';

const ProductSaleUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productSale, setProductSale] = useState({
    product_id: '',
    price_sale: '',
    date_begin: '',
    date_end: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductSale = async () => {
      try {
        const response = await ProductSaleService.show(id);
        if (response.status) {
          setProductSale(response.productsale);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('Lỗi khi lấy thông tin sản phẩm giảm giá.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductSale();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductSale((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ProductSaleService.update(productSale,id );
      if (response.status) {
        alert('Cập nhật thành công!');
        navigate('/admin/productsale');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert('Lỗi khi cập nhật sản phẩm giảm giá.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">Cập nhật sản phẩm giảm giá</h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">ID sản phẩm:</label>
          <input
            type="text"
            name="product_id"
            value={productSale.product_id}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Giá giảm:</label>
          <input
            type="number"
            name="price_sale"
            value={productSale.price_sale}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Ngày bắt đầu:</label>
          <input
            type="date"
            name="date_begin"
            value={productSale.date_begin.split('T')[0]} // Chỉ lấy phần ngày
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Ngày kết thúc:</label>
          <input
            type="date"
            name="date_end"
            value={productSale.date_end.split('T')[0]} // Chỉ lấy phần ngày
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mt-6 text-center">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Cập nhật
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <Link to="/admin/productsale" className="text-blue-600 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default ProductSaleUpdate;
