import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../../components/pageProps/productDetails/ProductInfo";
import RelatedProducts from "../../../components/pageProps/productDetails/RelatedProducts";
import ProductService from '../../../services/ProductServices';

const ProductDetails = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productName = location.state?.item?.productName || "default-product";
        const response = await ProductService.product_detail(productName);
        console.log("API Response:", response);
        setProductInfo(response.product);
        setRelatedProducts(response.related_products);
        setPrevLocation(location.pathname);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [location]);

  // Carousel tự động chuyển ảnh mỗi 2 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        productInfo?.images && productInfo.images.length > 0 
        ? (prevIndex + 1) % productInfo.images.length 
        : 0
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [productInfo]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          {/* Related Products Section */}
          <div className="h-full">
            <RelatedProducts relatedProducts={relatedProducts} />
          </div>

          {/* Image Carousel Section */}
          <div className="h-full xl:col-span-2 flex justify-center items-center">
            {productInfo?.images && productInfo.images.length > 0 ? (
              <img
                className="w-full h-full object-cover rounded-md border border-gray-200"
                src={`http://127.0.0.1:8000/images/product/${productInfo.images[currentIndex].thumbnail}`}
                alt={`${productInfo.productName} Image ${currentIndex + 1}`}
              />
            ) : (
              <img
                className="w-full h-full object-cover rounded-md border border-gray-200"
                src="https://via.placeholder.com/150"
                alt="Placeholder Image"
              />
            )}
          </div>

          {/* Product Info Section */}
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
