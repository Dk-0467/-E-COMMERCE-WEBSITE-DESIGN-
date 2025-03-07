import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";
import BrandServices from '../../../../services/BrandServices';

const Brand = ({ onChange, onFilterChange }) => {
  const [showBrands, setShowBrands] = useState(true);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]); // Chuyển sang mảng

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const result = await BrandServices.index();
        if (result && result.status) {
          setBrands(result.brands);
        } else {
          setError('Không tìm thấy thương hiệu');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandSelect = (brandId) => {
    const isSelected = selectedBrandIds.includes(brandId);
    let newSelectedBrandIds;

    if (isSelected) {
      // Nếu đã chọn, loại bỏ brandId khỏi mảng
      newSelectedBrandIds = selectedBrandIds.filter(id => id !== brandId);
    } else {
      // Nếu chưa chọn, thêm brandId vào mảng
      newSelectedBrandIds = [...selectedBrandIds, brandId];
    }

    setSelectedBrandIds(newSelectedBrandIds);
    onChange(newSelectedBrandIds); // Truyền mảng các ID thương hiệu đã chọn ra ngoài
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div onClick={() => setShowBrands(!showBrands)} className="cursor-pointer">
        <NavTitle title="Shop by Brand" icons={true} />
      </div>
      {showBrands && (
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {brands.map((item) => (
              <li
                key={item.id}
                onClick={() => handleBrandSelect(item.id)}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 duration-300 cursor-pointer ${
                  selectedBrandIds.includes(item.id) 
                    ? " text-primeColor font-bold underline"
                    : "hover:text-primeColor hover:border-gray-400"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Brand;
