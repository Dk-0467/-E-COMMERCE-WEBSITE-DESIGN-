import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaImage, FaTrademark, FaListAlt, FaComments, FaEdit, FaBars, FaPhoneAlt, FaClipboardList, FaCog, FaUserFriends } from 'react-icons/fa';

const LayoutBackend = ({ children }) => {
  const [showProductMenu, setShowProductMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowProductMenu(!showProductMenu);
  };

  const handleMenuClose = () => {
    setShowProductMenu(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-800 text-white shadow-xl flex-shrink-0 overflow-y-auto h-screen">
        <div className="p-6">
          <Link to={'/admin'} className="text-3xl font-bold hover:text-blue-300 transition-all duration-300 ease-in-out">
            Admin Panel
          </Link>
          <nav className="mt-10 space-y-4">
            {/* Product Management */}
            <div className="relative">
              <div
                onClick={handleMenuToggle}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 cursor-pointer"
              >
                <span className="flex items-center">
                  <FaBoxOpen className="mr-3" /> Product Management
                </span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${showProductMenu ? 'rotate-180' : 'rotate-0'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {showProductMenu && (
                <ul className="mt-2 bg-slate-700 rounded-md shadow-md overflow-hidden">
                  <li>
                    <Link
                      to={'/admin/product'}
                      className="block py-3 px-4 hover:bg-slate-700 transition-colors duration-300"
                      onClick={handleMenuClose}
                    >
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={'/admin/productStore'}
                      className="block py-3 px-4 hover:bg-slate-700 transition-colors duration-300"
                      onClick={handleMenuClose}
                    >
                      ProductStore
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={'/admin/productSale'}
                      className="block py-3 px-4 hover:bg-slate-700 transition-colors duration-300"
                      onClick={handleMenuClose}
                    >
                      ProductSale
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Other Links */}
            <Link
              to={'/admin/banner'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaImage className="mr-3" /> Banner
            </Link>
            <Link
              to={'/admin/brand'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaTrademark className="mr-3" /> Brand
            </Link>
            <Link
              to={'/admin/category'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaListAlt className="mr-3" /> Category
            </Link>
            <Link
              to={'/admin/topic'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaComments className="mr-3" /> Topic
            </Link>
            <Link
              to={'/admin/post'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaEdit className="mr-3" /> Post
            </Link>
            <Link
              to={'/admin/menu'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaBars className="mr-3" /> Menu
            </Link>
            <Link
              to={'/admin/contact'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaPhoneAlt className="mr-3" /> Contact
            </Link>
            <Link
              to={'/admin/order'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaClipboardList className="mr-3" /> Order
            </Link>
            
            <Link
              to={'/admin/config'}
              className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center"
            >
              <FaCog className="mr-3" /> Config
            </Link>

            <Link to="/admin/user" className="block py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center">
              <FaUserFriends className="mr-3" /> Users
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-grow bg-gray-50 p-8 shadow-inner overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default LayoutBackend;
