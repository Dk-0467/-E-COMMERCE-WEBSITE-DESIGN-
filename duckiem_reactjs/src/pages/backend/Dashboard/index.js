import React, { useState } from 'react';
import { FaSignOutAlt, FaBell, FaCog, FaUserCircle, FaBars, FaUserAlt, FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const LayoutBackend = ({ children }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark'); // State to manage theme color

  const username = localStorage.getItem('username'); // Lấy tên người dùng từ localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username'); // Xóa tên người dùng khi đăng xuất
    navigate('/admin/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log('Search Query:', searchQuery);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-black'}>
      {/* Header */}
      <header className={`shadow py-4 px-6 flex justify-between items-center w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-4">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="text-slate-50 hover:bg-slate-600 rounded-full p-2 transition duration-300"
          >
            {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </button>
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              className={`py-2 px-4 rounded-full ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-black'} placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500`}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2">
              <FaSearch />
            </button>
          </form>

          {/* Notifications */}
          <button className="hover:bg-slate-600 rounded-full p-2 transition duration-300 relative">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Settings */}
          <button className="hover:bg-slate-600 rounded-full p-2 transition duration-300">
            <FaCog className="text-xl" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 hover:bg-slate-600 rounded-full py-2 px-4 transition duration-300"
              onClick={toggleDropdown}
            >
              <FaUserAlt className="text-xl" />
              <span>{username}</span>
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://th.bing.com/th/id/OIP.y0IRxtnWdxcc0Uw6xPEARAHaFs?w=249&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                alt="Admin Avatar"
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden z-20">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                >
                  <FaUserCircle className="inline mr-2" /> Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                >
                  <FaCog className="inline mr-2" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default LayoutBackend;
