import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ProductService from '../../../services/ProductServices'; // Tệp quản lý API sản phẩm
import ProductSaleService from '../../../services/ProductSaleServices'; // Tệp quản lý API sản phẩm sale

const ProductSaleCreate = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const [products, setProducts] = useState([]);
    const [product_id, setProductId] = useState(null);
    const [date_begin, setDateBegin] = useState(''); // Khởi tạo thành '' thay vì null
    const [date_end, setDateEnd] = useState(''); // Khởi tạo thành '' thay vì null
    const [price_sale, setPriceSale] = useState(0);

    useEffect(() => {
        (async () => {
            const result = await ProductService.index();
            setProducts(result.products);
        })();
    }, []);

    const formatDateTime = (strdate) => {
        if (strdate != null && strdate.trim() !== '') {
            const arr = strdate.split("T");
            return arr.join(" ") + ":00";
        }
        return strdate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productsale = {
            product_id: product_id,
            date_begin: formatDateTime(date_begin),
            date_end: formatDateTime(date_end),
            price_sale: price_sale
        };

        const result = await ProductSaleService.store(productsale);
        console.log(result);

        // Kiểm tra xem thêm thành công hay không
        if (result.status) {
            // Chuyển hướng về trang danh sách sản phẩm sale
            navigate('/admin/productSale'); // Thay đổi đường dẫn nếu cần
        } else {
            // Xử lý lỗi nếu cần
            alert(result.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Create Product Sale</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Select Product
                    </label>
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price Sale
                    </label>
                    <input
                        type="number"
                        value={price_sale}
                        onChange={(e) => setPriceSale(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Date Begin
                    </label>
                    <input
                        type="datetime-local"
                        value={date_begin}
                        onChange={(e) => setDateBegin(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Date End
                    </label>
                    <input
                        type="datetime-local"
                        value={date_end}
                        onChange={(e) => setDateEnd(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div> 
            </form>
        </div>
    );
};

export default ProductSaleCreate;
