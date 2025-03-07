import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import CategoryService from '../../../services/CategoryServices';
import { Link, useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5); 
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await CategoryService.index(); 
      setCategories(result.categories); 
    })();
  }, []);
 
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = async (id) => {
    try {
      const result = await CategoryService.status(id);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? { ...category, status: result.category.status } : category
        )
      );
      const updatedCategories = await CategoryService.index();
      setCategories(updatedCategories.categories);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const result = await CategoryService.delete(id); // Gọi API delete
        if (result.status) {
          // Cập nhật danh sách danh mục sau khi xóa
          setCategories((prevCategories) => prevCategories.filter(category => category.id !== id));
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Danh Mục</h1>
      
      <div className="mb-4 flex justify-between">
        <button 
          onClick={() => navigate('/admin/cat_add')}
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
        >
          Thêm Danh Mục
        </button>
        <Link to='/admin/cat_trash'>
          <button className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
            Danh sách xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Hình ảnh</th>
            <th className="py-2 px-4 text-left">Tên Danh Mục</th>
            <th className="py-2 px-4 text-left">Gốc</th>
            <th className="py-2 px-4 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentCategories.map(category => {
            const imageUrl = `http://127.0.0.1:8000/images/category/${category.image}`;
            return (
              <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 px-4 text-left">{category.id}</td>
                <td className="py-2 px-4 text-left">
                  <img 
                    src={imageUrl} 
                    alt={category.name} 
                    className="w-12 h-12 object-cover rounded-md" 
                  />
                </td>
                <td className="py-2 px-4 text-left whitespace-nowrap">
                  <span className="font-medium">{category.name}</span>
                </td>
                <td className="py-2 px-4 text-left">{category.parent_id || 'N/A'}</td>
                <td className="py-2 px-4 text-left">
                  <button
                    onClick={() => handleStatusChange(category.id)}
                    className={`py-1 px-2 mx-0.5 text-white rounded-md ${category.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {category.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                  </button>
                  <Link to={`/admin/cat_show/${category.id}`}>
                    <button className="bg-sky-500 py-1 px-2 mx-1 text-white rounded-md">
                      <FaEye className="text-sm" />
                    </button>
                  </Link>
                  <Link to={`/admin/edit_cat/${category.id}`}>
                    <button className="bg-blue-500 py-1 px-2 text-white rounded-md">
                      <FaEdit className="text-sm" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 py-1 px-2 mx-1 text-white rounded-md"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => paginate(index + 1)} 
            className={`px-3 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} mx-1 rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList; 
