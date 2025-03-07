import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import BannerService from '../../../services/BannerServices';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bannersPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await BannerService.index();
      setBanners(result.banners);
    })();
  }, []);

  const indexOfLastBanner = currentPage * bannersPerPage;
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
  const currentBanners = banners.slice(indexOfFirstBanner, indexOfLastBanner);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(banners.length / bannersPerPage);

  const handleStatusChange = async (id) => {
    try {
      const result = await BannerService.status(id);
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner.id === id ? { ...banner, status: result.banner.status } : banner
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa banner này?')) {
      try {
        await BannerService.delete(id);
        setBanners((prevBanners) => prevBanners.filter((banner) => banner.id !== id));
      } catch (error) {
        console.error("Failed to delete banner", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Banner</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin/banner_add')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm Banner
        </button>
        <Link to='/admin/banner_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mx-2"
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
            <th className="py-3 px-6 text-left">Tên Banner</th>
            <th className="py-3 px-6 text-left">Chức vụ</th>
            <th className="py-3 px-6 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentBanners.map(banner => {
            const imageUrl = `http://127.0.0.1:8000/images/banner/${banner.image}`;
            const isDisabled = banner.status === 0;

            return (
              <tr key={banner.id} className={`border-b border-gray-200 hover:bg-gray-100 ${isDisabled ? 'opacity-50' : ''}`}>
                <td className="py-3 px-6 text-left">{banner.id}</td>
                <td className="py-3 px-6 text-left">
                  <img 
                    src={imageUrl} 
                    alt={banner.name} 
                    className="w-16 h-16 object-cover rounded-md" 
                  />
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{banner.name}</span>
                </td>
                <td className="py-3 px-6 text-left">{banner.position}</td>
                <td className="py-3 px-6 text-left">
                <button
                    onClick={() => handleStatusChange(banner.id)}
                    className={`py-1 px-2 mx-0.5 text-white rounded-md ${banner.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {banner.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                  </button>
                  <Link to={`/admin/show/${banner.id}`}>
                    <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                      <FaEye className="text-sm" />
                    </button>
                  </Link>
                  <Link to={`/admin/edit_banner/${banner.id}`}>
                    <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                      <FaEdit className="text-sm" />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(banner.id)}
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

export default BannerList;
