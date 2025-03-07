import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Thêm import Slider
import Heading from "../Header/Products/Heading";
import Product from "../Header/Products/Product";
import ProductService from '../../../services/ProductServices'; // Kết nối API
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";

const SpecialOffers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm ưu đãi
    const fetchProducts = async () => {
      try {
        const result = await ProductService.product_sale();
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

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full pb-20">
      <Heading heading="Sản phẩm khuyến mãi" />
      <Slider {...settings} className="mx-auto">
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
              <Product
                _id={product.id}
                img={product.images.length > 0 ? `http://127.0.0.1:8000/images/product/${product.images[0].thumbnail}` : 'https://via.placeholder.com/150'}
                productName={product.name}
                price={product.price ? product.price : 'N/A'}
                badge={product.isSpecialOffer}
                des={product.description}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SpecialOffers;
