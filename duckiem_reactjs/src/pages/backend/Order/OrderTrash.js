import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa';
import OrderService from '../../../services/OrderServices'; // Sửa lại service cho phù hợp với Order
import { toast } from 'react-toastify';

const OrderTrash = () => {
  const [trashedOrders, setTrashedOrders] = useState([]); 

  useEffect(() => {
    (async () => {
      const result = await OrderService.trash(); // Gọi API để lấy dữ liệu các đơn hàng đã bị xóa
      if (result.status) {
        setTrashedOrders(result.orders); // Thiết lập trạng thái với danh sách đơn hàng
      } else {
        toast.error("Lấy danh sách đơn hàng thất bại!");
      }
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await OrderService.restore(id); // Phục hồi đơn hàng theo ID
      setTrashedOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      toast.success("Đơn hàng đã được phục hồi!");
    } catch (error) {
      toast.error("Phục hồi đơn hàng thất bại!");
      console.error("Phục hồi đơn hàng thất bại", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này?");
    if (!isConfirmed) return;

    try {
      await OrderService.destroy(id); // Xóa vĩnh viễn đơn hàng theo ID
      setTrashedOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      toast.success("Đơn hàng đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa đơn hàng thất bại!");
      console.error("Xóa đơn hàng thất bại", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thùng Rác - Đơn Hàng Đã Xóa</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Tên</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Điện Thoại</th>
              <th className="py-3 px-6 text-left">Địa Chỉ</th>
              <th className="py-3 px-6 text-left">Ngày Tạo</th>
              <th className="py-3 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedOrders.length > 0 ? (
              trashedOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{order.id}</td>
                  <td className="py-3 px-6 text-left">{order.name}</td>
                  <td className="py-3 px-6 text-left">{order.email}</td>
                  <td className="py-3 px-6 text-left">{order.phone}</td>
                  <td className="py-3 px-6 text-left">{order.address}</td>
                  <td className="py-3 px-6 text-left">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleRestore(order.id)}
                      className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 flex items-center"
                    >
                      <FaRecycle className="mr-2" />
                      Phục Hồi
                    </button>

                    <button
                      onClick={() => handlePermanentDelete(order.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 flex items-center"
                    >
                      <FaTrashAlt className="mr-2" />
                      Xóa Vĩnh Viễn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Không có đơn hàng nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTrash;
