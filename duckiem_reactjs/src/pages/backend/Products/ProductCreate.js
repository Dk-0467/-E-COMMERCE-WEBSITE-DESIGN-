import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductServices from '../../../services/ProductServices';
import CategoryServices from '../../../services/CategoryServices';
import BrandServices from '../../../services/BrandServices';

const ProductCreation = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState(''); // Thêm state cho slug
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState(1);
  const [thumbnails, setThumbnails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await CategoryServices.index();
        setCategories(categoryResponse?.categories || []);

        const brandResponse = await BrandServices.index();
        setBrands(brandResponse?.brands || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục hoặc thương hiệu:", error);
        setErrorMessage("Không thể tải danh mục hoặc thương hiệu.");
      }
    };

    fetchData();
  }, []);

  // Hàm tạo slug từ tên sản phẩm
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  // Cập nhật slug khi tên sản phẩm thay đổi
  useEffect(() => {
    const generatedSlug = generateSlug(name);
    setSlug(generatedSlug);
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug); // Thêm slug vào formData
    formData.append('category_id', categoryId);
    formData.append('brand_id', brandId);
    formData.append('content', content);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('status', status);
    
    thumbnails.forEach((thumbnail) => {
      formData.append('thumbnail[]', thumbnail);
    });

    try {
      await ProductServices.store(formData);
      navigate('/admin/product');
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      setErrorMessage("Có lỗi xảy ra khi thêm sản phẩm. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderThumbnails = () => {
    return thumbnails.map((thumbnail, index) => (
      <div key={index} className="inline-block mr-2 relative">
        <img 
          src={URL.createObjectURL(thumbnail)} 
          alt={`thumbnail-${index}`} 
          className="w-20 h-20 object-cover rounded-md" 
        />
        <button
          onClick={() => removeThumbnail(index)} // Gọi hàm xóa khi nhấn nút
          className="absolute top-0 right-0 bg-black text-white rounded-full p-1 text-xs"
        >
          X
        </button>
      </div>
    ));
  };

  const removeThumbnail = (index) => {
    setThumbnails((prevThumbnails) => 
      prevThumbnails.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thêm Sản Phẩm Mới</h1>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              readOnly // Nếu không muốn người dùng chỉnh sửa slug, có thể bỏ readOnly
            />
          </div>

          {/* Các trường khác */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nội dung chi tiết</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Giá sản phẩm</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={1}>Kích hoạt</option>
              <option value={0}>Không kích hoạt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setThumbnails([...e.target.files])}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-2">
              {renderThumbnails()}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreation;
