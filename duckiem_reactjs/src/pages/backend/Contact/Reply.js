import React, { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import ContactService from '../../../services/ContactServices'; // Dịch vụ API

const ReplyContact = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [content, setContent] = useState(''); // Nội dung trả lời
  const [replayId, setReplayId] = useState(''); // ID trả lời
  const navigate = useNavigate();

  // Kiểm tra nếu không có contactId
  useEffect(() => {
    console.log("Contact ID:", id); // Kiểm tra giá trị của contactId
    if (!id) {
      alert("Không tìm thấy liên hệ để trả lời");
      navigate('/admin/contact'); // Quay lại danh sách liên hệ nếu không có contactId
    }
  }, [id, navigate]);

  const handleReply = async () => {
    // Kiểm tra nội dung và replayId
    if (!content.trim() || !replayId.trim()) {
      alert("Vui lòng nhập đầy đủ nội dung và ID trả lời");
      return;
    }
  
    // Console log nội dung và replayId trước khi gửi
    console.log("Nội dung gửi đi:", {
      replay_id: replayId,
      content: content,
    });
  
    try {
      // Gọi API với đúng cấu trúc dữ liệu
      const response = await ContactService.reply(id, { replay_id: replayId, content });
      
      if (!response.data) {
        alert("Trả lời thành công");
        navigate('/admin/contact'); // Chuyển hướng về danh sách liên hệ sau khi trả lời
      } else {
        alert("Trả lời thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi trả lời liên hệ", error);
      alert("Đã xảy ra lỗi khi trả lời");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trả Lời Liên Hệ</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nội dung trả lời</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ID trả lời</label>
        <input
          type="text"
          value={replayId}
          onChange={(e) => setReplayId(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleReply}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Trả lời
      </button>
    </div>
  );
};

export default ReplyContact;
