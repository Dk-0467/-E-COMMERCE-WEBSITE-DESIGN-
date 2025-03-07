import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductStore from '../../../services/ProductStoreServices';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Biểu tượng loading

const ProductStoreDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [productStore, setProductStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductStore = async () => {
            try {
                const response = await ProductStore.show(id);
                setProductStore(response.productstore);
            } catch (err) {
                setError('Không tìm thấy sản phẩm trong kho');
            } finally {
                setLoading(false);
            }
        };

        fetchProductStore();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
                <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-center py-4 text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Chi tiết sản phẩm trong kho</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Mã sản phẩm:</label>
                    <p className="mt-1 text-lg text-gray-900 font-semibold">{productStore.product_id}</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Giá gốc:</label>
                    <p className="mt-1 text-lg text-gray-900 font-semibold">{productStore.price_root} VND</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Số lượng trong kho:</label>
                    <p className="mt-1 text-lg text-gray-900 font-semibold">{productStore.qty}</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Trạng thái:</label>
                    <p className="mt-1 text-lg text-gray-900 font-semibold">
                        {productStore.status === 1 ? (
                            <span className="text-green-600">Hoạt động</span>
                        ) : (
                            <span className="text-red-600">Ngừng hoạt động</span>
                        )}
                    </p>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ngày tạo:</label>
                    <p className="mt-1 text-lg text-gray-900">
                        {new Date(productStore.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ngày cập nhật:</label>
                    <p className="mt-1 text-lg text-gray-900">
                        {new Date(productStore.updated_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none"
                    onClick={() => window.history.back()} // Điều hướng quay lại
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default ProductStoreDetail;
