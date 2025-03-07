import React, { useState, useEffect } from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import CategoryService from '../../../../services/CategoryServices';

const Category = ({ onChange, onFilterChange }) => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // Sử dụng mảng để lưu nhiều ID

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await CategoryService.index();
        if (result && result.status) {
          setCategories(result.categories);
        } else {
          setError('Không tìm thấy danh mục');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    const isSelected = selectedCategoryIds.includes(categoryId);
    let newSelectedCategoryIds;

    if (isSelected) {
      // Nếu đã chọn, loại bỏ categoryId khỏi mảng
      newSelectedCategoryIds = selectedCategoryIds.filter(id => id !== categoryId);
    } else {
      // Nếu chưa chọn, thêm categoryId vào mảng
      newSelectedCategoryIds = [...selectedCategoryIds, categoryId];
    }

    setSelectedCategoryIds(newSelectedCategoryIds);
    onChange(newSelectedCategoryIds); // Truyền mảng các ID đã chọn ra ngoài
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categories.map(({ id, name, parent_id }) => (
            <li
              key={id}
              onClick={() => handleCategorySelect(id)}
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer ${
                selectedCategoryIds.includes(id)  
                    ? " text-primeColor font-bold underline"
                    : "hover:text-primeColor hover:border-gray-400"
              }`}
            >
              {name}
              {parent_id === null && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSubCatOne(!showSubCatOne);
                  }}
                  className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
                >
                  <ImPlus />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
