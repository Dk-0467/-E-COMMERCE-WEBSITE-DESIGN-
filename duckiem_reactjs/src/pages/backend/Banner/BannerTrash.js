import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa'; 
import BannerService from '../../../services/BannerServices';
import { toast } from 'react-toastify';

const BannerTrash = () => {
  const [trashedBanners, setTrashedBanners] = useState([]); 

  useEffect(() => {
    (async () => {
      const result = await BannerService.trash(); 
      setTrashedBanners(result.banners);
    })();
  }, []);

  // Phục hồi banner
  const handleRestore = async (id) => {
    try {
      await BannerService.restore(id); 
      setTrashedBanners(prevBanners => prevBanners.filter(banner => banner.id !== id));
      toast.success("Banner đã được phục hồi!");
    } catch (error) {
      toast.error("Phục hồi banner thất bại!");
      console.error("Phục hồi banner thất bại", error);
    }
  };

  // Xóa vĩnh viễn banner
  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc muốn xóa banner này vĩnh viễn?");
    if (!isConfirmed) return;

    try {
      await BannerService.destroy(id); 
      setTrashedBanners(prevBanners => prevBanners.filter(banner => banner.id !== id));
      toast.success("Banner đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa banner thất bại!");
      console.error("Xóa banner thất bại", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Thùng Rác - Banner Đã Xóa</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className="p-3 text-center">Mã</th>
            <th className="p-3 text-center">Hình Ảnh</th>
            <th className="p-3 text-left">Tên Banner</th>
            <th className="p-3 text-left">Vị Trí</th>
            <th className="p-3 text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {trashedBanners.length > 0 ? (
            trashedBanners.map((banner) => {
              const imageUrl = `http://127.0.0.1:8000/images/banner/${banner.image}`;
              return (
                <tr key={banner.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="p-3 text-center">{banner.id}</td>
                  <td className="p-3 text-center">
                    <img 
                      src={imageUrl} 
                      alt={banner.name} 
                      className="h-16 w-16 object-cover rounded-md border"
                    />
                  </td>
                  <td className="p-3 text-left">{banner.name}</td>
                  <td className="p-3 text-left">{banner.position}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRestore(banner.id)}
                      className="bg-green-500 hover:bg-green-600 py-1 px-4 mx-1 text-white rounded-md inline-flex items-center"
                    >
                      <FaRecycle className="mr-1" />
                      Phục Hồi
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(banner.id)}
                      className="bg-red-500 hover:bg-red-600 py-1 px-4 mx-1 text-white rounded-md inline-flex items-center"
                    >
                      <FaTrashAlt className="mr-1" />
                      Xóa Vĩnh Viễn
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-500">
                Không có banner nào trong thùng rác.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BannerTrash;
