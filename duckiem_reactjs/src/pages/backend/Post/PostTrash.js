import React, { useEffect, useState } from 'react';
import { FaRecycle, FaTrashAlt } from 'react-icons/fa';
import PostService from '../../../services/PostServices'; // Đảm bảo PostService có API phù hợp
import { toast } from 'react-toastify';

const PostTrash = () => {
  const [trashedPosts, setTrashedPosts] = useState([]); 

  useEffect(() => {
    // Lấy dữ liệu bài viết đã bị xóa tạm thời
    (async () => {
      try {
        const result = await PostService.trash(); 
        setTrashedPosts(result.posts);
      } catch (error) {
        toast.error("Lấy dữ liệu thùng rác thất bại");
        console.error("Error fetching trash posts:", error);
      }
    })();
  }, []);

  const handleRestore = async (id) => {
    try {
      await PostService.restore(id); // Phục hồi bài viết
      setTrashedPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      toast.success("Bài viết đã được phục hồi!");
    } catch (error) {
      toast.error("Phục hồi bài viết thất bại!");
      console.error("Error restoring post:", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này?");
    if (!isConfirmed) return;

    try {
      await PostService.destroy(id); // Xóa vĩnh viễn bài viết
      setTrashedPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      toast.success("Bài viết đã bị xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Xóa bài viết thất bại!");
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Thùng Rác - Bài Viết Đã Xóa</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Thumbnail</th>
              <th className="py-3 px-6 text-left">Tiêu đề</th>
              <th className="py-3 px-6 text-left">Mô tả</th>
              <th className="py-3 px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {trashedPosts.length > 0 ? (
              trashedPosts.map((post) => {
                return (
                  <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{post.id}</td>
                    <td className="py-3 px-6 text-left">
                    <img
                        src={`http://127.0.0.1:8000/images/post/${post.thumbnail}`} // Chỉnh sửa đường dẫn
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                    />
                    </td>

                    <td className="py-3 px-6 text-left">{post.title}</td>
                    <td className="py-3 px-6 text-left">{post.description}</td>
                    <td className="py-3 px-6 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => handleRestore(post.id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 flex items-center"
                      >
                        <FaRecycle className="mr-2" />
                        Phục Hồi
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(post.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 flex items-center"
                      >
                        <FaTrashAlt className="mr-2" />
                        Xóa Vĩnh Viễn
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Không có bài viết nào trong thùng rác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostTrash;
