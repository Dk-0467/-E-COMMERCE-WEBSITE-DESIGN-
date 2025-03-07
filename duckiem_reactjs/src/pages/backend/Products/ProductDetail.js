import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from '../../../services/ProductServices';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await ProductService.show(id);
        setProduct(response.product);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-red-500">Không tìm thấy sản phẩm!</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white shadow-md rounded-md">
      <div className="relative mb-4">
        <img 
          src={`http://127.0.0.1:8000/images/product/${product.images[0]?.thumbnail}`} 
          alt={product.name} 
          className="h-48 w-full object-cover rounded-md transition-transform duration-300 transform hover:scale-105 shadow-sm"
        />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 text-center">{product.name}</h2>
      <p className="text-gray-600 mt-1 text-center">{product.description || "N/A"}</p>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Giá:</span>
          <span className="text-gray-800">{product.price.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Danh mục:</span>
          <span className="text-gray-800">{product.category ? product.category.name : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Thương hiệu:</span>
          <span className="text-gray-800">{product.brand ? product.brand.name : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Trạng thái:</span>
          <span className={`text-gray-800 ${product.status === 1 ? 'text-green-600' : 'text-red-600'}`}>
            {product.status === 1 ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Hình ảnh sản phẩm:</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {product.images.map((image, index) => (
            <img 
              key={index}
              src={`http://127.0.0.1:8000/images/product/${image.thumbnail}`} 
              alt={product.name} 
              className="h-24 w-full object-cover rounded-md shadow-sm"
            />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/admin/product" className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg">
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
