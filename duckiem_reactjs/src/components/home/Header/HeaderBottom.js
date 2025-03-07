import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/orebiSlice";
import ProductService from "../../../services/ProductServices"; 

const HeaderBottom = () => {
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const cartItems = useSelector((state) => state.orebiReducer.products);  // Chỉnh sửa để lấy từ state.orebi.products
  const dispatch = useDispatch();
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // Lấy danh sách sản phẩm từ API sử dụng ProductService
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await ProductService.index();
        setProducts(result.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Lọc sản phẩm dựa vào tìm kiếm
  useEffect(() => {
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex items-center justify-between w-full px-4 h-full lg:h-24">
          
          {/* Phần Tìm kiếm */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
              <input
                className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
                type="text"
                onChange={handleSearch}
                value={searchQuery}
                placeholder="Search your products here"
              />
              <FaSearch className="w-5 h-5" />
              {searchQuery && (
                <div className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
                  {filteredProducts.map((item) => (
                    <div
                      onClick={() =>
                        navigate(`/product/${item.name.toLowerCase().replace(/\s+/g, "")}`, {
                          state: { item: item },
                        }) & setSearchQuery("")
                      }
                      key={item.name}
                      className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                    >
                      <img
                        className="w-24"
                        src={ 
                          item.images && item.images.length > 0 
                          ? `http://127.0.0.1:8000/images/product/${item.images[0].thumbnail}` 
                          : "https://via.placeholder.com/150"
                        }
                        alt="productImg"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-xs">{item.catname}</p>
                        <p className="text-sm">
                          Price: <span className="text-primeColor font-semibold">${item.price}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Phần Người Dùng và Giỏ hàng */}
          <div className="flex gap-4 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex items-center gap-2">
              <FaUser />
              {userInfo ? (
                <span>{userInfo.name}</span>
              ) : (
                <FaCaretDown />
              )}
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {userInfo ? (
                  <>
                    <Link to="/profile">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Profile
                      </li>
                    </Link>
                    <Link to="/order">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        UserOrders 
                      </li>
                    </Link>
                    <li
                      onClick={handleLogout}
                      className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer"
                    >
                      Logout
                    </li>
                  </>
                ) : (
                  <>
                    <Link to="/signin">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Login
                      </li>
                    </Link>
                    <Link to="/signup">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Sign Up
                      </li>
                    </Link>
                  </>
                )}
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)} {/* Tổng số sản phẩm trong giỏ hàng */}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
