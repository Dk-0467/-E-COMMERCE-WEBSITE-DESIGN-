import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa';
import ContactService from '../../../services/ContactServices'; // Đổi tên service phù hợp với Contact
import { toast } from 'react-toastify';

const ContactTrash = () => {
  const [trashedContacts, setTrashedContacts] = useState([]); // Thay đổi danh sách từ categories thành contacts

  useEffect(() => {
    (async () => {
      const result = await ContactService.trash(); // Gọi API để lấy dữ liệu các contact đã bị xóa
      setTrashedContacts(result.contacts); // Lưu dữ liệu contacts vào state
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      const response = await ContactService.restore(id); // Phục hồi contact theo ID từ API
      if (response.status) {
        // Nếu API trả về thành công
        setTrashedContacts(prevContacts => prevContacts.filter(contact => contact.id !== id)); // Loại bỏ contact đã phục hồi
        toast.success("Liên hệ đã được phục hồi!");
      } else {
        toast.error(response.message || "Phục hồi liên hệ thất bại!");
      }
    } catch (error) {
      toast.error("Phục hồi liên hệ thất bại!");
      console.error("Phục hồi liên hệ thất bại", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn liên hệ này?");
    if (!isConfirmed) return;

    try {
      const response = await ContactService.destroy(id); // Xóa vĩnh viễn contact theo ID từ API
      if (response.status) {
        // Nếu API trả về thành công
        setTrashedContacts(prevContacts => prevContacts.filter(contact => contact.id !== id)); // Loại bỏ contact đã xóa
        toast.success("Liên hệ đã bị xóa vĩnh viễn!");
      } else {
        toast.error(response.message || "Xóa liên hệ thất bại!");
      }
    } catch (error) {
      toast.error("Xóa liên hệ thất bại!");
      console.error("Xóa liên hệ thất bại", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thùng Rác - Các Liên Hệ Đã Xóa</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Mã</th>
              <th className="py-3 px-6 text-left">Tên</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Số điện thoại</th>
              <th className="py-3 px-6 text-left">Tiêu đề</th>
              <th className="py-3 px-6 text-left">Nội dung</th>
              <th className="py-3 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedContacts.length > 0 ? (
              trashedContacts.map((contact) => {
                return (
                  <tr key={contact.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{contact.id}</td>
                    <td className="py-3 px-6 text-left">{contact.name}</td>
                    <td className="py-3 px-6 text-left">{contact.email}</td>
                    <td className="py-3 px-6 text-left">{contact.phone}</td>
                    <td className="py-3 px-6 text-left">{contact.title}</td>
                    <td className="py-3 px-6 text-left">{contact.content || 'Không có nội dung'}</td>
                    <td className="py-3 px-6 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => handleRestore(contact.id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 flex items-center"
                      >
                        <FaRecycle className="mr-2" />
                        Phục Hồi
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(contact.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 flex items-center"
                      >
                        <FaTrashAlt className="mr-2" />
                        Xóa Vĩnh Viễn
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Không có liên hệ nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTrash;
