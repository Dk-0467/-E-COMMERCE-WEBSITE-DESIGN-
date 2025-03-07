import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductStore from '../../../services/ProductStoreServices';
import ProductService from '../../../services/ProductServices'; // Import dịch vụ để lấy danh sách sản phẩm
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Biểu tượng loading

const UpdateProductStore = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate(); // Điều hướng
    const [product_id, setProductId] = useState(null);

    const [productStore, setProductStore] = useState({
        product_id: '',
        price_root: '',
        qty: '',
    });
    const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    (async () => {
      const result = await ProductService.index();
      setProducts(result.products); // Cập nhật danh sách sản phẩm vào state
    })();
  }, []);

    // Lấy thông tin sản phẩm trong kho
    useEffect(() => {
        const fetchProductStore = async () => {
            try {
                const response = await ProductStore.show(id);
                setProductStore({
                    product_id: response.productstore.product_id,
                    price_root: response.productstore.price_root,
                    qty: response.productstore.qty,
                });
            } catch (err) {
                setError('Không tìm thấy sản phẩm trong kho');
            } finally {
                setLoading(false);
            }
        };

        fetchProductStore();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductStore({
            ...productStore,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        console.log(productStore); // Kiểm tra dữ liệu được gửi đi
        
        try {
            const response = await ProductStore.update(productStore , id );
            if (response.status) {
                setMessage('Cập nhật thành công');
                navigate('/admin/productstore');
            }
        } catch (err) {
            console.error(err.response); // Hiển thị lỗi từ API
            setError('Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
                <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Cập nhật sản phẩm trong kho</h2>
            {message && <div className="mb-4 text-green-600">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Sản phẩm</label>
                    <select
                        value={product_id}
                        onChange={(e) => setProductId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
                    >
                        <option value="">Choose a product</option>
                        {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                        ))}
          </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Giá gốc</label>
                    <input
                        type="number"
                        name="price_root"
                        value={productStore.price_root}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Số lượng trong kho</label>
                    <input
                        type="number"
                        name="qty"
                        value={productStore.qty}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none"
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProductStore;
