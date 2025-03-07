import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostService from '../../../services/PostServices';
import TopicServices from '../../../services/TopicServices';
import { FaArrowLeft } from 'react-icons/fa';

const PostAdd = () => {
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState(''); 
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState(1); 
  const [thumbnail, setThumbnail] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicResponse = await TopicServices.index();
        setTopics(topicResponse?.topics || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chủ đề:", error);
        setErrorMessage("Không thể tải danh sách chủ đề.");
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('topic_id', topicId); 
    formData.append('content', content);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('status', status);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    console.log('Gửi dữ liệu:', {
      title,
      topicId,
      content,
      description,
      type,
      status,
      thumbnail: thumbnail ? thumbnail.name : null,
    });

    try {
      const response = await PostService.store(formData);
      alert(response.message);
      if (response.status) {
        navigate('/admin/post');
      }
    } catch (error) {
      console.error('Failed to add post:', error);
      alert('Thêm bài viết không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thêm Bài Viết Mới</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> {/* Thay đổi ở đây */}
          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="topicId">Chủ đề</label>
            <select
              id="topicId"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Chọn chủ đề</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="content">Nội dung</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="2"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="thumbnail">Ảnh đại diện</label>
            <input
              type="file"
              id="thumbnail"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="type">Loại</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="status">Trạng thái</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          {loading ? 'Đang thêm...' : 'Thêm Bài Viết'}
        </button>
      </form>

      <div className="mt-6">
        <Link
          to="/admin/post"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Quay lại
        </Link>
      </div>
    </div>
  );
};

export default PostAdd;
