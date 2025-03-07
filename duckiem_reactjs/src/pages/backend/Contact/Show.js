import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContactService from '../../../services/ContactServices';

const ContactDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await ContactService.show(id); // Gọi API để lấy chi tiết contact
        if (response.status) {
          setContact(response.contact); // Cập nhật thông tin liên hệ
        } else {
          console.error('Không tìm thấy liên hệ');
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết liên hệ:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">Không tìm thấy liên hệ!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-center text-4xl font-semibold text-gray-800 mb-8">Chi Tiết Liên Hệ</h2>
      <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-medium text-gray-700"><strong>ID:</strong> {contact.id}</p>
            <p className="text-lg font-medium text-gray-600"><strong>Trạng thái:</strong> {contact.status === 1 ? 'Kích hoạt' : 'Ngừng kích hoạt'}</p>
          </div>
          <div>
            <p className="text-lg text-gray-800"><strong>Tên:</strong> {contact.name}</p>
            <p className="text-lg text-gray-800"><strong>Email:</strong> {contact.email}</p>
            <p className="text-lg text-gray-800"><strong>Số điện thoại:</strong> {contact.phone}</p>
            <p className="text-lg text-gray-800"><strong>Tiêu đề:</strong> {contact.title}</p>
            <p className="text-lg text-gray-800"><strong>Nội dung:</strong> {contact.content || 'Không có nội dung'}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/admin/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
