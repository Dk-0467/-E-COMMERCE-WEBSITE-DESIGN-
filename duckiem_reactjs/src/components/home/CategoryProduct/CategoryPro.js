import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import Slider
import Heading from "../Header/Products/Heading";
import Product from "../Header/Products/Product";
import ProductService from '../../../services/ProductServices';
import CategoryServices from "../../../services/CategoryServices";
import SampleNextArrow from "../NewArrivals/SampleNextArrow"; // Mũi tên tiếp theo
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow"; // Mũi tên quay lại
import { CSSTransition } from 'react-transition-group';

const CategoryPro = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [limit] = useState(10);
  const [showSubCategory, setShowSubCategory] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await CategoryServices.categoryList();
        if (result && result.categories) {
          setCategories(result.categories);
          if (result.categories.length > 0) {
            setSelectedCategoryId(result.categories[0].id);
          }
        } else {
          setError('Không tìm thấy danh mục');
        }
      } catch (err) {
        setError('Lỗi khi tải danh mục');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategoryId) {
        try {
          const result = await ProductService.product_category(selectedCategoryId, limit);
          if (result && result.products) {
            setProducts(result.products);
          } else {
            setProducts([]);
            setError('Không tìm thấy sản phẩm');
          }
        } catch (err) {
          setProducts([]);
          setError('Không có sản phẩm');
        }
      }
    };
    fetchProducts();
  }, [selectedCategoryId, limit]);

  const handleCategoryChange = (categoryId, subCategories) => {
    setSelectedCategoryId(categoryId);
    setProducts([]);
    setSelectedSubCategory(subCategories || null);
  };

  const handleSubCategoryChange = async (subCategoryId) => {
    setSelectedCategoryId(subCategoryId);
    setProducts([]);
    setSelectedSubCategory(null);
    try {
      const result = await ProductService.product_category(subCategoryId, limit);
      if (result && result.products) {
        setProducts(result.products);
      } else {
        setProducts([]);
        setError('Không có sản phẩm nào trong danh mục này.');
      }
    } catch (err) {
      setProducts([]);
      setError('Không có sản phẩm');
    }
  };

  const handleMouseEnter = () => {
    setShowSubCategory(true);
  };

  const handleMouseLeave = () => {
    setShowSubCategory(false);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-5">
        <Heading heading="Sản phẩm theo danh mục" />
        <div
          className="relative flex items-center space-x-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id, category.children)}
              className={`underline ${selectedCategoryId === category.id ? 'font-bold text-black' : 'text-black'}`}
            >
              {category.name}
            </button>
          ))}
          <CSSTransition
            in={showSubCategory && !!selectedSubCategory}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div className="absolute left-0 top-full mt-2 bg-white shadow-lg z-10">
              {selectedSubCategory && selectedSubCategory.map((subCategory) => (
                <button
                  key={subCategory.id}
                  onClick={() => handleSubCategoryChange(subCategory.id)}
                  className="block px-4 py-2 text-black hover:bg-gray-200"
                >
                  {subCategory.name}
                </button>
              ))}
            </div>
          </CSSTransition>
        </div>
      </div>

      {/* Hiển thị sản phẩm với Slider */}
      {products.length === 0 ? (
        <p className="text-red-500">Không có sản phẩm nào trong danh mục này.</p>
      ) : (
        <Slider {...settings} className="mx-auto">
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <Product
                _id={product.id}
                img={product.images.length > 0 ? `http://127.0.0.1:8000/images/product/${product.images[0].thumbnail}` : 'https://via.placeholder.com/150'}
                productName={product.name}
                price={product.price ? product.price : 'N/A'}
                badge={product.isNew}
                des={product.description}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default CategoryPro;
