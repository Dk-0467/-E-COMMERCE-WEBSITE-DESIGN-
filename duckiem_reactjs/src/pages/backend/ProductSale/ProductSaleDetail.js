import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductSaleService from '../../../services/ProductSaleServices';

const ProductSaleDetail = () => {
  const { id } = useParams();
  const [productSale, setProductSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductSale = async () => {
      try {
        const response = await ProductSaleService.show(id);
        if (response.status) {
          setProductSale(response.productsale);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm giảm giá:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductSale();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!productSale) {
    return <p className="text-center text-red-500">Không tìm thấy sản phẩm giảm giá!</p>;
  }

  const { price_sale, date_begin, date_end, status, product } = productSale;

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">Chi tiết sản phẩm giảm giá</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Sản phẩm:</span>
          <span className="text-gray-800">{product.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Giá giảm:</span>
          <span className="text-gray-800">{price_sale.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Giá gốc:</span>
          <span className="text-gray-800">{product.price.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Bắt đầu giảm giá:</span>
          <span className="text-gray-800">{new Date(date_begin).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Kết thúc giảm giá:</span>
          <span className="text-gray-800">{new Date(date_end).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Trạng thái:</span>
          <span className={`text-gray-800 ${status === 1 ? 'text-green-600' : 'text-red-600'}`}>
            {status === 1 ? 'Còn hiệu lực' : 'Hết hiệu lực'}
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/admin/productsale" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default ProductSaleDetail;
