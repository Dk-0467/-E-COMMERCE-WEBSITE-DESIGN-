import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductServices'; 
import BrandService from '../../../services/BrandServices'; 
import CategoryService from '../../../services/CategoryServices'; 

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(1);
  const [slug, setSlug] = useState('');
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.show(id);
        if (response.status) {
          const product = response.product;
          setName(product.name);
          setCategoryId(product.category_id);
          setBrandId(product.brand_id);
          setDescription(product.description);
          setContent(product.content);
          setPrice(product.price);
          setStatus(product.status);
          setSlug(product.slug);
          setImages(product.images);
        }
      } catch (error) {
        alert('Lỗi: ' + error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await CategoryService.index();
        if (response.status) {
          setCategories(response.categories);
        }
      } catch (error) {
        alert('Lỗi khi lấy danh mục: ' + error.message);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await BrandService.index();
        if (response.status) {
          setBrands(response.brands);
        }
      } catch (error) {
        alert('Lỗi khi lấy thương hiệu: ' + error.message);
      }
    };

    fetchProduct();
    fetchCategories();
    fetchBrands();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', categoryId);
    formData.append('brand_id', brandId);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('price', price);
    formData.append('slug', slug);
    formData.append('status', status);

    newImages.forEach((image) => {
      formData.append('thumbnail[]', image);
    });

    try {
      const response = await ProductService.update(formData, id);
      if (response.status) {
        alert('Cập nhật sản phẩm thành công');
        navigate('/admin/product');
      } else {
        alert('Có lỗi xảy ra: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-semibold text-blue-600 mb-6">Cập nhật sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Tên sản phẩm</label>
            <input
              type="text"
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Danh mục</label>
            <select
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Thương hiệu</label>
            <select
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Mô tả</label>
            <textarea
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nội dung</label>
            <textarea
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung sản phẩm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Giá</label>
            <input
              type="number"
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Nhập giá sản phẩm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Slug</label>
            <input
              type="text"
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Nhập slug cho sản phẩm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Trạng thái</label>
            <select
              className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={1}>Kích hoạt</option>
              <option value={0}>Không kích hoạt</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Hình ảnh hiện tại</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={`http://127.0.0.1:8000/images/product/${image.thumbnail}`} 
                  alt={name} 
                  className="h-32 w-full object-cover rounded-lg"
                />
                <button 
                  onClick={() => handleRemoveImage(index)} 
                  className="absolute top-1 right-1 text-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Hình ảnh mới</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages([...e.target.files])}
            className="border border-gray-300 focus:border-blue-500 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-1"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow-md"
        >
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
