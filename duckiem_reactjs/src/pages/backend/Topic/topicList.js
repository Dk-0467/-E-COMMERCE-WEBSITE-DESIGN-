import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import TopicService from '../../../services/TopicServices'; 
import { Link } from 'react-router-dom';

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [topicsPerPage] = useState(5); 
  const [showTrashed, setShowTrashed] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await TopicService.index(); 
      setTopics(result.topics);
    })();
  }, []);

  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = showTrashed ? [] : topics.slice(indexOfFirstTopic, indexOfLastTopic); 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil((showTrashed ? 0 : topics.length) / topicsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleStatusChange = async (id) => {
    try {
      const result = await TopicService.status(id); 
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.id === id ? { ...topic, status: result.topic.status } : topic
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chủ đề này không?")) {
      try {
        await TopicService.delete(id);
        setTopics(topics.filter(topic => topic.id !== id));
      } catch (error) {
        console.error("Failed to delete topic", error);
      }
    }
  };
  
  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Chủ đề</h2>
        <div className="space-x-2">
          <Link to='/admin/topic_add/'>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none transition">
              Thêm Chủ đề
            </button>
          </Link>
          <Link to='/admin/topic_trash'>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 focus:outline-none transition">
              <FaTrashAlt className="inline mr-1" /> Thùng rác
            </button>
          </Link>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">Tên</th>
            <th className="py-3 px-4 border-b">Slug</th>
            <th className="py-3 px-4 border-b">Thứ tự</th>
            <th className="py-3 px-4 border-b text-center">Trạng thái</th>
            <th className="py-3 px-4 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {currentTopics && currentTopics.length > 0 ? (
            currentTopics.map((topic) => {
              return (
                <tr key={topic.id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-4 border-b">{topic.id}</td>
                  <td className="py-3 px-4 border-b">{topic.name}</td>
                  <td className="py-3 px-4 border-b">{topic.slug}</td>
                  <td className="py-3 px-4 border-b">{topic.sort_order}</td>
                  <td className="py-3 px-4 border-b text-center">
                    {topic.status === 1 ? (
                      <button onClick={() => handleStatusChange(topic.id)} className="bg-green-600 text-white rounded-full px-3 py-1 hover:bg-green-700 focus:outline-none transition">
                        <FaToggleOn />
                      </button>
                    ) : (
                      <button onClick={() => handleStatusChange(topic.id)} className="bg-red-600 text-white rounded-full px-3 py-1 hover:bg-red-700 focus:outline-none transition">
                        <FaToggleOff />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <Link to={`/admin/topic_show/${topic.id}`}>
                      <button className="bg-blue-600 text-white rounded-lg px-2 py-1 hover:bg-blue-700 focus:outline-none transition">
                        <FaEye />
                      </button>
                    </Link>
                    <Link to={`/admin/edit_topic/${topic.id}`}>
                      <button className="bg-sky-600 text-white rounded-lg px-2 py-1 hover:bg-sky-700 focus:outline-none transition">
                        <FaEdit />
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(topic.id)} className="bg-red-600 text-white rounded-lg px-2 py-1 hover:bg-red-700 focus:outline-none transition">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">Không có chủ đề nào để hiển thị</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-6 space-x-2">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)} className={`px-4 py-2 rounded-lg text-sm ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} transition`}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicList;  
