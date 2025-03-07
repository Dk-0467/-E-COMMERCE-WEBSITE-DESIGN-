import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Kiểm tra xem token có tồn tại không

    if (!token) {
        // Nếu chưa đăng nhập, điều hướng tới trang login
        return <Navigate to="/admin/login" replace />;
    }

    // Nếu đã đăng nhập, hiển thị các component con
    return children;
};

export default PrivateRoute;