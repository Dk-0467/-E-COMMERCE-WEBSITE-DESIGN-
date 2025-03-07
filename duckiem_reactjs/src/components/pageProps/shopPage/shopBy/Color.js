import React, { useState } from "react";
import NavTitle from "./NavTitle";

const Color = ({ onChange }) => {
  const [showColors, setShowColors] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);

  const colors = [
    { _id: 9001, title: "Green", base: "#22c55e" },
    { _id: 9002, title: "Gray", base: "#a3a3a3" },
    { _id: 9003, title: "Red", base: "#dc2626" },
    { _id: 9004, title: "Yellow", base: "#f59e0b" },
    { _id: 9005, title: "Blue", base: "#3b82f6" },
  ];

  const handleColorSelect = (color) => {
    const newSelectedColor = selectedColor === color ? null : color;
    setSelectedColor(newSelectedColor);
    onChange(newSelectedColor);  // Truyền màu đã chọn lên trên
  };

  return (
    <div>
      <div onClick={() => setShowColors(!showColors)} className="cursor-pointer">
        <NavTitle title="Shop by Color" icons={true} />
      </div>
      {showColors && (
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {colors.map((item) => (
            <li
              key={item._id}
              onClick={() => handleColorSelect(item.title)}
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer duration-300 ${selectedColor === item.title ? "bg-gray-200 text-primeColor" : "hover:text-primeColor"}`}
            >
              <span style={{ background: item.base }} className="w-3 h-3 rounded-full"></span>
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Color;
