import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BrandService from '../../../services/BrandServices';

const BrandDetail = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await BrandService.show(id);
        setBrand(response.brand);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết brand:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!brand) {
    return <p className="text-center text-red-500">Không tìm thấy brand!</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img 
          src={`http://127.0.0.1:8000/images/brand/${brand.image}`} 
          alt={brand.name} 
          className="h-64 w-full object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">{brand.name}</h2>

          <div className="space-y-2">
            <p><strong className="text-gray-600">Slug:</strong> {brand.slug}</p>
            <p><strong className="text-gray-600">Description:</strong> {brand.description || "N/A"}</p>
            <p><strong className="text-gray-600">Sort Order:</strong> {brand.sort_order}</p>
            <p><strong className="text-gray-600">Status:</strong> {brand.status === 1 ? 'Active' : 'Inactive'}</p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/admin/brand" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all">
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
