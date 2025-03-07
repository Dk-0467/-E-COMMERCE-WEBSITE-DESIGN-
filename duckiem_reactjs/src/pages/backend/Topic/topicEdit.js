import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopicService from '../../../services/TopicServices'; 

const EditTopic = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const response = await TopicService.show(id);
        const topic = response.topic;
        setName(topic.name);
        setSlug(topic.slug);
        setSortOrder(topic.sort_order);
        setDescription(topic.description);
        setStatus(topic.status);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin chủ đề:', error);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTopic = {
      name,
      slug,
      sort_order: sortOrder,
      description,
      status,
    };

    try {
      const response = await TopicService.update(updatedTopic, id);
      if (response.status) {
        alert('Cập nhật chủ đề thành công');
        navigate('/admin/topic');
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-center text-2xl mb-4">Chỉnh sửa chủ đề</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-1/2 px-2">
            <label className="block text-sm font-medium mb-2">Tên chủ đề</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="w-1/2 px-2">
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-1/2 px-2">
            <label className="block text-sm font-medium mb-2">Thứ tự</label>
            <input
              type="number"
              className="border w-full p-2 rounded"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              required
            />
          </div>

          <div className="w-1/2 px-2">
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <select
              className="border w-full p-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ngừng hoạt động</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Mô tả</label>
          <textarea
            className="border w-full p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Cập nhật chủ đề
        </button>
      </form>
    </div>
  );
};

export default EditTopic;
