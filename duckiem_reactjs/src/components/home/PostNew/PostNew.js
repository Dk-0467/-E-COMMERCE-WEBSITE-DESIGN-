import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Header/Products/Heading";
import PostService from '../../../services/PostServices'; // Kết nối API
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";

const PostNew = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await PostService.post_new(5); // Giới hạn 5 bài viết
        if (result && result.posts) {
          setPosts(result.posts);
        } else {
          setError('Không tìm thấy bài viết');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full pb-16">
      <Heading heading="Bài viết mới nhất" />
      <Slider {...settings} className="mx-auto">
        {posts.map((post) => (
          <div key={post.id} className="px-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 transform hover:scale-105 h-[370px]">
              <img
                src={`http://127.0.0.1:8000/images/post/${post.thumbnail}`}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between h-[180px]">
                <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.description.substring(0, 100)}...
                </p>
                <p className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PostNew;
