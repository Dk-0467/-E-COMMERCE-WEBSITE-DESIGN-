import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import ContactService from '../../../services/ContactServices'; // Dịch vụ để gọi API
import { Link, useNavigate } from 'react-router-dom';

const ContactList = () => {
  const [contacts, setContacts] = useState([]); // Khởi tạo contacts là một mảng rỗng
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const result = await ContactService.index(); // Gọi API lấy danh sách liên hệ
        if (result.contacts) { // Kiểm tra dữ liệu trả về
          setContacts(result.contacts); // Cập nhật danh sách liên hệ
        } else {
          console.error("Không tìm thấy liên hệ trong kết quả");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách liên hệ", error);
      }
    };

    fetchContacts();
  }, []);

  // Kiểm tra nếu contacts là mảng và tính toán phân trang
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;

  // Tránh lỗi khi contacts chưa được tải
  const currentContacts = Array.isArray(contacts) ? contacts.slice(indexOfFirstContact, indexOfLastContact) : [];

  // Nếu contacts là mảng, tính toán totalPages
  const totalPages = Array.isArray(contacts) ? Math.ceil(contacts.length / contactsPerPage) : 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = async (id) => {
    try {
      const result = await ContactService.status(id); // Cập nhật trạng thái liên hệ
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, status: result.contact.status } : contact
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên hệ này không?")) {
      try {
        await ContactService.delete(id); // Gọi API xóa liên hệ
        setContacts(contacts.filter(contact => contact.id !== id)); // Cập nhật danh sách liên hệ
      } catch (error) {
        console.error("Lỗi khi xóa liên hệ", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Liên Hệ</h1>
      
      <div className="mb-4">
        {/* Nút Thùng Rác */}
        <Link to='/admin/contact_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mx-2"
          >
            Danh sách xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Tên</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Số điện thoại</th>
            <th className="py-3 px-6 text-left">Tiêu đề</th>
            <th className="py-3 px-6 text-left">Nội dung</th>
            <th className="py-3 px-6 text-left">Trạng thái</th>
            <th className="py-3 px-6 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentContacts.map(contact => (
            <tr key={contact.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{contact.id}</td>
              <td className="py-3 px-6 text-left">{contact.name}</td>
              <td className="py-3 px-6 text-left">{contact.email}</td>
              <td className="py-3 px-6 text-left">{contact.phone}</td>
              <td className="py-3 px-6 text-left truncate max-w-[150px]">{contact.title}</td>
              <td className="py-3 px-6 text-left truncate max-w-[150px]">{contact.content}</td>
              <td className="py-3 px-6 text-left">
                <button
                    onClick={() => handleStatusChange(contact.id)}
                    className={`py-1 px-2 mx-0.5 text-white rounded-md ${contact.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {contact.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                </button>
              </td>
              <td className="py-3 px-6 text-left">
                <Link to={`/admin/contact_show/${contact.id}`}>
                  <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEye className="text-sm" />
                  </button>
                </Link>
                <Link to={`/admin/contact_reply/${contact.id}`}>
                  <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEdit className="text-sm" />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(contact.id)} 
                  className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                >
                  <FaTrashAlt className="text-sm" />
                </button>
              </td>
            </tr>
          ))}
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

export default ContactList;
