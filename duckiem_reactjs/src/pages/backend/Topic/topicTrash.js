import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa'; 
import TopicService from '../../../services/TopicServices';
import { toast } from 'react-toastify';

const TopicTrash = () => {
  const [trashedTopics, setTrashedTopics] = useState([]); 

  useEffect(() => {
    (async () => {
      const result = await TopicService.trash(); 
      setTrashedTopics(result.topics);
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await TopicService.restore(id); 
      setTrashedTopics(prevTopics => prevTopics.filter(topic => topic.id !== id));
      toast.success("Chủ đề đã được phục hồi!"); 
    } catch (error) {
      toast.error("Phục hồi chủ đề thất bại!");
      console.error("Phục hồi chủ đề thất bại", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa chủ đề này vĩnh viễn?");
    if (!isConfirmed) return; 

    try {
      await TopicService.destroy(id); 
      setTrashedTopics(prevTopics => prevTopics.filter(topic => topic.id !== id));
      toast.success("Chủ đề đã bị xóa vĩnh viễn!"); 
    } catch (error) {
      toast.error("Xóa chủ đề thất bại!"); 
      console.error("Xóa chủ đề thất bại", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thùng Rác - Các Chủ Đề Đã Xóa</h1>

      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Tên chủ đề</th>
            <th className="border border-gray-300 p-2 text-left">Slug</th>
            <th className="border border-gray-300 p-2 text-left">Mô tả</th>
            <th className="border border-gray-300 p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trashedTopics.length > 0 ? (
            trashedTopics.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-100 transition-colors duration-300">
                <td className="border border-gray-300 text-center p-2">{topic.id}</td>
                <td className="border border-gray-300 p-2">{topic.name}</td>
                <td className="border border-gray-300 p-2">{topic.slug}</td>
                <td className="border border-gray-300 p-2">{topic.description}</td>

                <td className="border border-gray-300 text-center p-2">
                  <button
                    onClick={() => handleRestore(topic.id)}
                    className="bg-green-500 hover:bg-green-600 py-1 px-2 mx-0.5 text-white rounded-md transition duration-200"
                  >
                    <FaRecycle className="text-sm" />
                    Phục hồi
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(topic.id)}
                    className="bg-red-500 hover:bg-red-600 py-1 px-2 mx-0.5 text-white rounded-md transition duration-200"
                  >
                    <FaTrashAlt className="text-sm" />
                    Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                Không có chủ đề nào trong thùng rác.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopicTrash;
