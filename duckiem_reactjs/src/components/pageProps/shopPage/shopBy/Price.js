import React, { useState, useEffect } from "react";
import NavTitle from "./NavTitle";

const Price = ({ onChange, onFilterChange }) => {
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: 100000 }); // Khởi tạo với giá trị mặc định
  const priceList = [
    { _id: 950, priceOne: 0.0, priceTwo: 49.99 },
    { _id: 951, priceOne: 50.0, priceTwo: 99.99 },
    { _id: 952, priceOne: 100.0, priceTwo: 199.99 },
    { _id: 953, priceOne: 200.0, priceTwo: 399.99 },
    { _id: 954, priceOne: 400.0, priceTwo: 599.99 },
    { _id: 955, priceOne: 600.0, priceTwo: 100000 },
  ];

  const handlePriceSelect = (price) => {
    const newSelectedPrice = selectedPrice.min === price.min && selectedPrice.max === price.max ? { min: 0, max: 100000 } : price;
    setSelectedPrice(newSelectedPrice);
    onChange(newSelectedPrice);
    if (onFilterChange) {
      onFilterChange(newSelectedPrice); // Gọi onFilterChange khi có sự thay đổi giá
    }
  };

  useEffect(() => {
    // Gọi onChange với selectedPrice mỗi khi selectedPrice thay đổi
    onChange(selectedPrice);
  }, [selectedPrice, onChange]);

  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {priceList.map((item) => (
            <li
              key={item._id}
              onClick={() => handlePriceSelect({ min: item.priceOne, max: item.priceTwo })}
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer duration-300 ${
                selectedPrice.min === item.priceOne && selectedPrice.max === item.priceTwo
                  ? " text-primeColor font-bold underline"
                  : "hover:text-primeColor hover:border-gray-400"
              }`}
            >
              ${item.priceOne.toFixed(2)} - ${item.priceTwo.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
