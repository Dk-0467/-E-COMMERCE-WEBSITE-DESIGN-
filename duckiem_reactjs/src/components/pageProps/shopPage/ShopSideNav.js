import React, { useState, useEffect } from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Price from "./shopBy/Price";
import ProductService from '../../../services/ProductServices';

const ShopSideNav = ({ onFilterChange }) => {
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: 9999999999 });

  const handleFilterChange = async () => {
    try {
      // Đảm bảo selectedPrice luôn là một đối tượng hợp lệ
      const { min = 0, max = 9999999999 } = selectedPrice;

      const result = await ProductService.product_all(
        selectedCategories,
        selectedBrandIds,
        min,
        max
      );

      console.log("API response:", result);

      if (result && result.products) {
        if (onFilterChange) onFilterChange(result.products);
      } else {
        console.warn("Products not found in API response");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedBrandIds, selectedCategories, selectedPrice]);

  return (
    <div className="w-full flex flex-col gap-6">
      <Category onChange={(value) => setSelectedCategories(value)} />
      <Brand onChange={(value) => setSelectedBrandIds(value)} />
      <Price onChange={(value) => setSelectedPrice(value)} />
    </div>
  );
};

export default ShopSideNav;
