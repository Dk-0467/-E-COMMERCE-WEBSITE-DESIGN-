// ListViewItems.js
import React from "react";

const ListViewItems = ({ currentItems }) => {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div
            key={item.id}
            className="w-full p-4 list-item transition-transform duration-300 transform hover:scale-105"
          >
            <div className="border rounded-lg shadow-lg overflow-hidden h-full flex">
              {/* Hình ảnh sản phẩm */}
              <div className="p-2 mr-4">
                <img
                  src={
                    item.images.length > 0
                      ? `http://127.0.0.1:8000/images/product/${item.images[0].thumbnail}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div className="flex flex-col justify-between p-4 w-full">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-800 font-semibold">
                    ${parseFloat(item.price).toLocaleString()}
                  </p>
                  {item.isSpecialOffer && (
                    <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                      Special Offer
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ListViewItems;
