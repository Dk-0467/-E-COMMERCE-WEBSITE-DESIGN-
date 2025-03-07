import React, { useEffect, useState } from 'react';
import OrderService from '../../../services/OrderServices'; 
import { Link } from 'react-router-dom';
import { FaToggleOn, FaToggleOff, FaTrashAlt, FaEye } from 'react-icons/fa'; // Thêm icon Chi Tiết và Trash

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await OrderService.index();
                setOrders(result.orders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (id) => {
        try {
            const result = await OrderService.status(id);
            setOrders((prevOrders) =>
                prevOrders.map(order =>
                    order.id === id ? { ...order, status: result.order.status } : order
                )
            );
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
            try {
                await OrderService.delete(id);
                setOrders((prevOrders) => prevOrders.filter(order => order.id !== id));
            } catch (error) {
                console.error("Failed to delete order", error);
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 font-sans">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Quản Lý Đơn Hàng</h1>
            <div className="mb-4 flex justify-end">
                {/* Nút Thùng Rác */}
                <Link to='/admin/order_trash'>
                    <button
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                    >
                        Danh sách đã xóa
                    </button>
                </Link>
            </div>
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">ID</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Điện Thoại</th>
                        <th className="py-3 px-6 text-left">Địa Chỉ</th>
                        <th className="py-3 px-6 text-left">Ngày Tạo</th>
                        <th className="py-3 px-6 text-left">Trạng Thái</th>
                        <th className="py-3 px-6 text-left">Hành Động</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {orders.map(order => (
                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out">
                            <td className="py-3 px-6 text-left">{order.id}</td>
                            <td className="py-3 px-6 text-left">{order.email}</td>
                            <td className="py-3 px-6 text-left">{order.phone}</td>
                            <td className="py-3 px-6 text-left">{order.address}</td>
                            <td className="py-3 px-6 text-left">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-6 text-left">
                                <button 
                                    onClick={() => handleStatusChange(order.id)}
                                    className={`py-1 px-2 text-white rounded-md ${order.status === 2 ? 'bg-red-500' : 'bg-green-500'} transition duration-300 ease-in-out`}
                                >
                                    {order.status === 2 ? <FaToggleOff className="text-sm" /> : <FaToggleOn className="text-sm" />}
                                </button>
                            </td>

                            <td className="py-3 px-6 text-left flex items-center justify-start space-x-2">
                                {/* Chi Tiết */}
                                <Link to={`/admin/order_show/${order.id}`}>
                                    <button className="bg-sky-500 text-white py-1 px-2 rounded-md hover:bg-sky-600 transition duration-300 ease-in-out">
                                        <FaEye className="text-lg" />
                                    </button>
                                </Link>
                                
                                {/* Xóa */}
                                <button 
                                    onClick={() => handleDelete(order.id)} 
                                    className="bg-red-500 py-1 px-2 rounded-md text-white hover:bg-red-600 transition duration-300 ease-in-out"
                                >
                                    <FaTrashAlt className="text-lg" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
