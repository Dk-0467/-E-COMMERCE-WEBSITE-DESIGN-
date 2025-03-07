import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import TopicService from '../../../services/TopicServices'; 
import { FaSpinner } from 'react-icons/fa'; // Dùng cho icon loading

const TopicDetail = () => {
  const { id } = useParams(); 
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await TopicService.show(id); 
        setTopic(response.topic);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết chủ đề:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        <p className="ml-2 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (!topic) {
    return <p>Không tìm thấy chủ đề!</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4">
        <Link to="/admin" className="text-blue-500 hover:underline">Admin</Link> / 
        <Link to="/admin/topic" className="text-blue-500 hover:underline"> Chủ đề</Link> / 
        <span className="text-gray-500"> Chi tiết</span>
      </nav>

      <h2 className="text-center text-3xl mb-6 font-semibold">Chi tiết Chủ Đề</h2>
      <div className="bg-white p-6 shadow-md rounded-lg">
        {/* Sử dụng grid để sắp xếp thông tin */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <p><strong>Tên:</strong> {topic.name}</p>
          <p><strong>Slug:</strong> {topic.slug}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <p><strong>Thứ tự:</strong> {topic.sort_order}</p>
          <p><strong>Trạng thái:</strong> {topic.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}</p>
        </div>
        <p className="mb-4"><strong>Mô tả:</strong> {topic.description}</p>

        <div className="mt-6 text-center">
          <Link to="/admin/topic" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
