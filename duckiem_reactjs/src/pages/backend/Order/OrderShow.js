import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderService from '../../../services/OrderServices';

const OrderShow = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const result = await OrderService.show(id);
                if (result.status) {
                    setOrder(result.order);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return <div className="text-center py-10 text-xl font-medium">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center text-lg">{error}</div>;
    }

    return (
        <div className="container mx-auto px-6 py-10 font-sans">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Chi Tiết Đơn Hàng #{order.id}</h1>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden md:grid md:grid-cols-2 gap-8 p-8">
                
                {/* Cột Thông Tin Người Dùng */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Thông Tin Người Dùng</h2>
                    <p className="text-lg text-gray-600"><strong>Email:</strong> {order.email}</p>
                    <p className="text-lg text-gray-600"><strong>Điện Thoại:</strong> {order.phone}</p>
                    <p className="text-lg text-gray-600"><strong>Địa Chỉ:</strong> {order.address}</p>
                    
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold text-gray-800">Trạng Thái Đơn Hàng</h2>
                        <p className={`text-lg ${order.status ? 'text-green-600' : 'text-red-600'}`}>
                            {order.status ? 'Đơn hàng đã được xác nhận' : 'Đơn hàng chưa được xác nhận'}
                        </p>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold text-gray-800">Ngày Tạo</h2>
                        <p className="text-lg text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Cột Chi Tiết Sản Phẩm */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Chi Tiết Sản Phẩm</h2>
                    <ul className="space-y-4">
                        {order.order_details && order.order_details.map(detail => (
                            <li key={detail.id} className="flex items-center justify-between text-lg text-gray-600">
                                <div>
                                    <strong>Sản phẩm:</strong> {detail.product_id} - 
                                    <strong> Số lượng:</strong> {detail.qty} - 
                                    <strong> Giá:</strong> {detail.price.toLocaleString()} VNĐ
                                </div>
                                <div className="text-sm text-gray-500">
                                    <strong>Giảm Giá:</strong> {detail.discount} VNĐ
                                    <br />
                                    <strong>Thành Tiền:</strong> {detail.amount.toLocaleString()} VNĐ
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button 
                    className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none transition duration-300 transform hover:scale-105"
                    onClick={() => window.history.back()}
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default OrderShow;
