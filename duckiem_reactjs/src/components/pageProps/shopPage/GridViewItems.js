// GridViewItems.js
import React from "react";
import Product from "../../home/Header/Products/Product";

const GridViewItems = ({ currentItems }) => {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div
            key={item.id}
            className="w-full p-4 grid-item transition-transform duration-300 transform hover:scale-105"
          >
            <div className="border rounded-lg shadow-lg overflow-hidden h-full">
              <Product
                _id={item.id}
                img={
                  item.images.length > 0
                    ? `http://127.0.0.1:8000/images/product/${item.images[0].thumbnail}`
                    : "https://via.placeholder.com/150"
                }
                productName={item.name}
                price={item.price}
                color={item.color}
                badge={item.isSpecialOffer}
                des={item.description}
              />
            </div>
          </div>
        ))}
    </>
  );
};

export default GridViewItems;
