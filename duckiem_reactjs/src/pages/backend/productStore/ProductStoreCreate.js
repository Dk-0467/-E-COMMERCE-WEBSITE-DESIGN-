import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate để chuyển hướng
import ProductService from '../../../services/ProductServices'; // Tệp quản lý API sản phẩm
import ProductStoreService from '../../../services/ProductStoreServices'; // Tệp quản lý API cửa hàng

const ProductStoreCreate = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  // State quản lý dữ liệu sản phẩm và thông tin kho
  const [products, setProducts] = useState([]);
  const [product_id, setProductId] = useState(null);
  const [price_root, setPriceRoot] = useState(0);
  const [qty, setQty] = useState(0);

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    (async () => {
      const result = await ProductService.index();
      setProducts(result.products); // Cập nhật danh sách sản phẩm vào state
    })();
  }, []);

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productStore = {
      product_id: product_id,
      price_root: price_root,
      qty: qty,
    };

    const result = await ProductStoreService.store(productStore);
    console.log(result);

    // Chuyển hướng đến trang quản lý kho sau khi lưu thành công
    if (result.status) {
      navigate('/admin/productStore'); // Thay đổi đường dẫn theo yêu cầu
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create Product Store</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Product
          </label>
          <select
            value={product_id}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Root Price
          </label>
          <input
            type="number"
            value={price_root}
            onChange={(e) => setPriceRoot(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div> 
  );
};

export default ProductStoreCreate;
