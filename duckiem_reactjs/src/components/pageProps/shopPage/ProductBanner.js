import React, { useEffect } from "react"; 
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";
import { GoTriangleDown } from "react-icons/go";
import ProductService from '../../../services/ProductServices';

const ProductBanner = ({ 
  itemsPerPageFromBanner, 
  setNewProducts, 
  isGridView, 
  setIsGridView 
}) => {
  
  useEffect(() => {
    // Fetch new products when component mounts
    fetchProducts("new");
  }, []);

  const fetchProducts = async (type) => {
    try {
      let response;
      if (type === "new") {
        response = await ProductService.product_new();
      } else if (type === "bestseller") {
        response = await ProductService.product_bestseller();
      } else if (type === "all") {
        response = await ProductService.index();
      }

      if (response && response.products) {
        setNewProducts(response.products);
      } else {
        console.error(`No products found in response for ${type}:`, response);
        setNewProducts([]); // Set mảng rỗng nếu không có sản phẩm
      }
    } catch (error) {
      console.error(`Error fetching ${type} products:`, error);
    }
  };

  const handleSortChange = async (e) => {
    const selectedValue = e.target.value;

    if (["Price Low to High", "Price High to Low"].includes(selectedValue)) {
      const allProducts = await ProductService.index(); // Gọi API để lấy tất cả sản phẩm
      if (allProducts && allProducts.products) {
        const sortedProducts = sortProducts(allProducts.products, selectedValue);
        setNewProducts(sortedProducts);
      }
      return; // Để tránh gọi lại hàm fetchProducts
    }

    const fetchType = {
      "New Arrival": "new",
      "Best Sellers": "bestseller",
      "Product All": "all"
    }[selectedValue] || "new"; // Mặc định là lấy sản phẩm mới

    fetchProducts(fetchType);
  };

  const sortProducts = (products, criteria) => {
    return products.sort((a, b) => {
      if (criteria === "Price Low to High") {
        return a.price - b.price;
      } else if (criteria === "Price High to Low") {
        return b.price - a.price;
      }
      return 0; // Nếu không có tiêu chí sắp xếp, giữ nguyên thứ tự
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <IconButton 
          isActive={isGridView} 
          onClick={() => setIsGridView(true)} 
          Icon={BsGridFill} 
        />
        <IconButton 
          isActive={!isGridView} 
          onClick={() => setIsGridView(false)} 
          Icon={ImList} 
        />
      </div>
      <div className="flex items-center gap-2 md:gap-6 mt-4 md:mt-0">
        <SortSelect 
          onChange={handleSortChange} 
          options={[
            { value: "Product All", label: "Product All" },
            { value: "Best Sellers", label: "Best Sellers" },
            { value: "New Arrival", label: "New Arrival" },
            { value: "Price Low to High", label: "Price Low to High" },
            { value: "Price High to Low", label: "Price High to Low" },
          ]}
        />
        <ShowSelect 
          onChange={(e) => itemsPerPageFromBanner(+e.target.value)} 
          options={[
            { value: 12, label: "12" },
            { value: 24, label: "24" },
            { value: 36, label: "36" },
            { value: 48, label: "48" },
          ]}
        />
      </div>
    </div>
  );
};

const IconButton = ({ isActive, onClick, Icon }) => (
  <span
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-300 ${
      isActive
        ? "bg-gray-200 text-gray-900 hover:bg-gray-300"  // Active color
        : "bg-gray-200 text-gray-900 hover:bg-gray-300"  // Inactive color with hover effect
    }`}
  >
    <Icon />
  </span>
);

const SortSelect = ({ onChange, options }) => (
  <div className="flex items-center gap-2 text-base text-[#767676] relative">
    <label className="block">Sort by:</label>
    <select
      onChange={onChange}
      className="w-32 md:w-52 border border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block appearance-none focus:outline-none focus-visible:border-primeColor"
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
    <span className="absolute text-sm right-2 top-2.5">
      <GoTriangleDown />
    </span>
  </div>
);

const ShowSelect = ({ onChange, options }) => (
  <div className="flex items-center gap-2 text-[#767676] relative">
    <label className="block">Show:</label>
    <select
      onChange={onChange}
      className="w-16 md:w-20 border border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block appearance-none focus:outline-none focus-visible:border-primeColor"
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
    <span className="absolute text-sm right-3 top-2.5">
      <GoTriangleDown />
    </span>
  </div>
);

export default ProductBanner;
