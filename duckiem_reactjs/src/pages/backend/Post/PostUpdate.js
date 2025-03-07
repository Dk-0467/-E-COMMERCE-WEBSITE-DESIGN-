import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PostService from '../../../services/PostServices';
import TopicServices from '../../../services/TopicServices';
import { FaArrowLeft } from 'react-icons/fa';

const PostUpdate = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState(1);
  const [thumbnail, setThumbnail] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lấy danh sách chủ đề khi component được mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await TopicServices.index();
        if (response.status) {
          setTopics(response.topics);
        } else {
          setErrorMessage('Không thể tải danh sách chủ đề.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy chủ đề:', error);
        setErrorMessage('Không thể tải các chủ đề.');
      }
    };

    fetchTopics();
  }, []);

  // Lấy thông tin bài viết cần cập nhật
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.show(id);
        if (response.status) {
          const post = response.post;
          setTitle(post.title);
          setTopicId(post.topic_id);
          setContent(post.content);
          setDescription(post.description);
          setType(post.type);
          setStatus(post.status);
          setCurrentThumbnail(post.thumbnail);
        } else {
          setErrorMessage('Không thể tải bài viết.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        setErrorMessage('Không thể tải bài viết.');
      }
    };

    fetchPost();
  }, [id]);

  // Xử lý thay đổi ảnh đại diện
  const handleFileChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  // Xử lý gửi form cập nhật
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

    try {
      const response = await PostService.update(formData, id);
      if (response.status) {
        alert('Cập nhật bài viết thành công.');
        navigate('/admin/post');
      } else {
        alert('Cập nhật không thành công.');
      }
    } catch (error) {
      console.error('Lỗi trong quá trình cập nhật:', error);
      alert('Đã xảy ra lỗi trong quá trình cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cập Nhật Bài Viết</h1>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="topicId">Chủ đề</label>
            <select
              id="topicId"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Chọn chủ đề</option>
              {Array.isArray(topics) && topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="type">Loại</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="content">Nội dung</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="2"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="thumbnail">Ảnh đại diện</label>
            <input
              type="file"
              id="thumbnail"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {currentThumbnail && (
              <img
                src={`http://127.0.0.1:8000/images/post/${currentThumbnail}`}
                alt="Current Thumbnail"
                className="h-20 w-20 object-cover rounded-md mb-2"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
        <Link to="/admin/post" className="flex items-center mt-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-1" /> Trở lại danh sách bài viết
        </Link>
      </form>
    </div>
  );
};

export default PostUpdate;
