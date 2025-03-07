import React, { useEffect, useState } from "react";
import Heading from "../Header/Products/Heading";
import Product from "../Header/Products/Product";
import ProductService from '../../../services/ProductServices'; // Kết nối API

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm bán chạy
    const fetchProducts = async () => {
      try {
        const result = await ProductService.product_bestseller();
        if (result && result.products) {
          setProducts(result.products); // Lưu sản phẩm vào state
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu');
        console.error(err);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full pb-20">
      <Heading heading="Sản phẩm bán chạy" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {products.map((product) => (
          <Product
            key={product.id}
            _id={product.id}
            img={product.images.length > 0 ? `http://127.0.0.1:8000/images/product/${product.images[0].thumbnail}` : 'https://via.placeholder.com/150'}
            productName={product.name}
            price={product.price ? product.price : 'N/A'}
            badge={product.isBestSeller}
            des={product.description}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
