import React, { useEffect, useState } from "react";
import OrderService from "../../../services/OrderServices";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await OrderService.userOrders();
        if (response.status) {
          setOrders(response.orders);
        } else {
          setErrorMsg("Không có đơn hàng nào");
        }
      } catch (error) {
        if (error.response) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      }
    };

    fetchUserOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-8 px-4">
      {errorMsg ? (
        <p className="text-red-500 text-lg text-center">{errorMsg}</p>
      ) : orders.length > 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Lịch sử đơn hàng</h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            Xem lại tất cả các đơn hàng và trạng thái của chúng
          </p>
          <hr className="border-t border-gray-200 mb-6" />

          {orders.map((order) => (
            <div key={order.id} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Đơn hàng #{order.id}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    order.status === "Completed"
                      ? "bg-green-500"
                      : order.status === "Processing"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600">Ngày đặt hàng: {new Date(order.created_at).toLocaleDateString()}</p>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-2">Chi tiết đơn hàng</h4>
                <ul className="space-y-6">
                  {order.order_details.map((detail) => (
                    <li
                      key={detail.id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            detail.product_image && detail.product_image.length > 0
                              ? `http://127.0.0.1:8000/images/product/${detail.product_image[0].thumbnail}`
                              : "https://via.placeholder.com/150"
                          }
                          alt={detail.product_name}
                          className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{detail.product_name}</p>
                          <p className="text-gray-600">Số lượng: {detail.quantity}</p>
                          <p className="text-gray-600">Giá: {parseFloat(detail.price).toLocaleString()} VND</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">
                          Tổng: {parseFloat(detail.amount).toLocaleString()} VND
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg text-center">Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default UserOrders;
