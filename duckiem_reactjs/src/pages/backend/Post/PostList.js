import { FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';  // Import FaTrash cho nút xóa
import PostService from '../../../services/PostServices';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const result = await PostService.index();
    setPosts(result.posts);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleStatusChange = async (id) => {
    try {
      const result = await PostService.status(id);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, status: result.post.status } : post
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
        await PostService.delete(id);
        fetchPosts();  // Cập nhật lại danh sách sau khi xóa
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Bài Viết</h1>

      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin/post_add')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm Bài Viết
        </button>
        <Link to='/admin/post_trash'>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mx-2"
          >
            Danh sách xóa
          </button>
        </Link>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Hình Ảnh</th>
            <th className="py-3 px-6 text-left">Tiêu Đề</th>
            <th className="py-3 px-6 text-left">Chủ Đề</th>

            <th className="py-3 px-6 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentPosts.map(post => (
            <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{post.id}</td>
              <td className="py-3 px-6 text-left">
                <img
                  src={`http://127.0.0.1:8000/images/post/${post.thumbnail}`} 
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="py-3 px-6 text-left">
                <span className="font-medium">
                  {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
                </span>
              </td>
              <td className="py-3 px-6 text-left">
                {post.topic ? post.topic.name : 'Không có chủ đề'}
              </td>
              <td className="py-3 px-6 text-left">
              <button
                    onClick={() => handleStatusChange(post.id)}
                    className={`py-1 px-2 mx-0.5 text-white rounded-md ${post.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {post.status === 1 ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                  </button>
                <Link to={`/admin/post_show/${post.id}`}>
                  <button className="bg-sky-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEye className="text-sm" />
                  </button>
                </Link>
                <Link to={`/admin/post_edit/${post.id}`}>
                  <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md">
                    <FaEdit className="text-sm" />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 py-1 px-2 mx-0.5 text-white rounded-md"
                >
                  <FaTrashAlt className="text-sm" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => paginate(index + 1)} 
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} mx-1 rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostList;
