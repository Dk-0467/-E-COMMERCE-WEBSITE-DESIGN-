// ProductList.js
import React, { useState, useEffect } from "react";
import GridViewItems from "./GridViewItems"; // Import GridViewItems
import ListViewItems from "./ListViewItems"; // Import ListViewItems
import ProductServices from "../../../services/ProductServices";
import ProductBanner from "./ProductBanner"; 
import ReactPaginate from "react-paginate";

const ProductList = ({ filteredProducts }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isGridView, setIsGridView] = useState(true);
  const [viewMode, setViewMode] = useState("all");
  const [sortOrder, setSortOrder] = useState("new");

  const fetchAllProducts = async () => {
    try {
      const response = await ProductServices.index();
      setProducts(response.products || []);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const sortProducts = (products, order) => {
    return products.slice().sort((a, b) => {
      if (order === "Price Low to High") {
        return a.price - b.price;
      } else if (order === "Price High to Low") {
        return b.price - a.price;
      }
      return 0;
    });
  };

  useEffect(() => {
    if (filteredProducts && filteredProducts.length > 0) {
      setProducts(filteredProducts);
    } else {
      fetchAllProducts();
    }
  }, [filteredProducts]);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = sortProducts(products, sortOrder).slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const pageCount = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4">
      <ProductBanner
        itemsPerPageFromBanner={setItemsPerPage}
        setNewProducts={setProducts}
        setIsGridView={setIsGridView}
        setViewMode={setViewMode}
        setSortOrder={setSortOrder}
      />

      {/* Render Grid or List View */}
      {isGridView ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <GridViewItems currentItems={currentItems} />
        </div>
      ) : (
        <div className="list-view">
          <ListViewItems currentItems={currentItems} />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center py-6">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-10 h-10 border rounded-md flex justify-center items-center text-gray-700 hover:bg-gray-200 transition duration-200"
          pageClassName="mx-1"
          containerClassName="flex text-base font-semibold font-titleFont"
          activeClassName="bg-black text-white rounded-md"
        />
        <p className="text-base font-normal text-gray-600 mt-4 md:mt-0">
          Showing {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, products.length)} of {products.length}
        </p>
      </div>
    </div>
  );
};

export default ProductList;
