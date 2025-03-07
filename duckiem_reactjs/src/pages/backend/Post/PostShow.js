import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostService from '../../../services/PostServices'; // Dịch vụ gọi API cho post
import { FaArrowLeft } from 'react-icons/fa';

const PostShow = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await PostService.show(id); // Giả sử bạn có API tương tự cho việc lấy chi tiết bài viết
        setPost(result.post);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch post', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  }

  if (!post) {
    return <div className="text-center py-10">Bài viết không tồn tại</div>;
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row">
          {/* Cột bên trái */}
          <div className="md:w-1/2 md:pr-4 mb-6 md:mb-0">
            <div className="mb-4">
              <img
                src={`http://127.0.0.1:8000/images/post/${post.thumbnail}`}
                alt={post.title}
                className="w-full h-auto object-cover rounded-lg shadow-lg" // Đặt lại kích thước hình ảnh
              />
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
              <p>{post.description}</p>
            </div>
          </div>

          {/* Cột bên phải */}
          <div className="md:w-1/2 md:pl-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Nội dung</h2>
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div> {/* Hiển thị nội dung dạng HTML */}
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Chủ đề</h2>
              <p>{post.topic ? post.topic.name : 'Không có chủ đề'}</p>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Thông tin khác</h2>
              <p>Trạng thái: {post.status === 1 ? 'Hoạt động' : 'Ẩn'}</p>
              <p>Loại: {post.type}</p>
              <p>Người tạo: {post.created_by}</p>
              <p>Ngày tạo: {new Date(post.created_at).toLocaleDateString()}</p>
              {post.updated_at && (
                <p>Cập nhật gần nhất: {new Date(post.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Nút quay lại */}
        <div className="mt-6">
          <Link
            to="/admin/post"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostShow;
