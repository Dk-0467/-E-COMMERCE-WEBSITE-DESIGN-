import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa'; 
import BrandService from '../../../services/BrandServices';
import { toast } from 'react-toastify';

const BrandTrash = () => {
  const [trashedBrands, setTrashedBrands] = useState([]); 

  useEffect(() => {
    (async () => {
      const result = await BrandService.trash(); 
      setTrashedBrands(result.brands);
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await BrandService.restore(id); 
      setTrashedBrands(prevBrands => prevBrands.filter(brand => brand.id !== id));
      toast.success("Brand đã được phục hồi!");
    } catch (error) {
      toast.error("Phục hồi brand thất bại!");
      console.error("Phục hồi brand thất bại", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc muốn xóa brand này vĩnh viễn?");
    if (!isConfirmed) return;

    try {
      await BrandService.destroy(id); 
      setTrashedBrands(prevBrands => prevBrands.filter(brand => brand.id !== id));
      toast.success("Brand đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa brand thất bại!");
      console.error("Xóa brand thất bại", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thùng Rác - Các Brand Đã Xóa</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Mã</th>
              <th className="py-3 px-6 text-left">Hình Ảnh</th>
              <th className="py-3 px-6 text-left">Tên Brand</th>
              <th className="py-3 px-6 text-left">Mô Tả</th>
              <th className="py-3 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedBrands.length > 0 ? (
              trashedBrands.map((brand) => {
                const imageUrl = `http://127.0.0.1:8000/images/brand/${brand.image}`;
                return (
                  <tr key={brand.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{brand.id}</td>
                    <td className="py-3 px-6 text-left">
                      <img 
                        src={imageUrl} 
                        alt={brand.name} 
                        className="h-16 w-16 object-cover rounded-full shadow-lg"
                      />
                    </td>
                    <td className="py-3 px-6 text-left">{brand.name}</td>
                    <td className="py-3 px-6 text-left">{brand.description}</td>
                    <td className="py-3 px-6 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => handleRestore(brand.id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 flex items-center"
                      >
                        <FaRecycle className="mr-2" />
                        Phục Hồi
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(brand.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 flex items-center"
                      >
                        <FaTrashAlt className="mr-2" />
                        Xóa Vĩnh Viễn
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Không có brand nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandTrash;
