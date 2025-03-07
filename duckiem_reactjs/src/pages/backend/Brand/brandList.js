import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import BrandService from '../../../services/BrandServices';
import { Link, useNavigate } from 'react-router-dom';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage] = useState(5); 
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await BrandService.index();
      setBrands(result.brands);
    })();
  }, []);

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(brands.length / brandsPerPage);

  // Handle Status Change
  const handleStatusChange = async (id) => {
    try {
      const result = await BrandService.status(id);
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand.id === id ? { ...brand, status: result.brand.status } : brand
        )
      );
      const updatedBrands = await BrandService.index();
      setBrands(updatedBrands.brands);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Handle Delete Brand
  const handleDeleteBrand = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      try {
        await BrandService.delete(id);
        const updatedBrands = brands.filter(brand => brand.id !== id);
        setBrands(updatedBrands);
      } catch (error) {
        console.error("Failed to delete brand", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Thương Hiệu</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin/brand_add')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm Thương Hiệu
        </button>
        {/* Nút Thùng Rác */}
        <Link to='/admin/brand_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mx-2"
          >
            Danh sách xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Hình ảnh</th>
            <th className="py-3 px-6 text-left">Tên Thương Hiệu</th>
            <th className="py-3 px-6 text-left">Mô tả</th>
            <th className="py-3 px-6 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentBrands.map(brand => {
            const imageUrl = `http://127.0.0.1:8000/images/brand/${brand.image}`;
            return (
              <tr key={brand.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{brand.id}</td>
                <td className="py-3 px-6 text-left">
                  <img 
                    src={imageUrl} 
                    alt={brand.name} 
                    className="w-16 h-16 object-cover rounded-md" 
                  />
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{brand.name}</span>
                </td>
                <td className="py-3 px-6 text-left">{brand.description}</td>
                <td className="py-3 px-6 text-left">
                <button
                    onClick={() => handleStatusChange(brand.id)}
                    className={`py-1 px-2 mx-0.5 text-white rounded-md ${brand.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {brand.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                  </button>
                  <Link to={`/admin/brand_show/${brand.id}`}>
                    <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                      <FaEye className="text-sm" />
                    </button>
                  </Link>
                  <Link to={`/admin/edit_brand/${brand.id}`}>
                    <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                      <FaEdit className="text-sm" />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => paginate(index + 1)} 
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} mx-1 rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
