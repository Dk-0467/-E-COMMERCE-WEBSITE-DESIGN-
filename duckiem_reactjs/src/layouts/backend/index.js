import React from 'react';
import Panel from '../../pages/backend/AdminPanel/Panel';
import Dashboard from '../../pages/backend/Dashboard/index';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <>
      {/* Phần header (Dashboard) */}
      <Dashboard />
      
      {/* Bố cục chính với Sidebar và nội dung */}
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar quản lý (Panel) */}
        <Panel />
        
        {/* Nội dung động sẽ được render ở đây */}
        <div className="flex-grow p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
