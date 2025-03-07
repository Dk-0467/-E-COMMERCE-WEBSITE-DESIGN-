// Shop.js
import React, { useState } from "react";
import Breadcrumbs from "../../../components/pageProps/Breadcrumbs";
import Pagination from "../../../components/pageProps/shopPage/Pagination";
import ShopSideNav from "../../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState([]); // State để lưu sản phẩm đã lọc

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const handleFilterChange = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          {/* <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} /> */}
          <Pagination itemsPerPage={itemsPerPage} filteredProducts={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default Shop;
