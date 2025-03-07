import axios from 'axios';

const httpAxios = axios.create({
  baseURL: 'http://localhost/backend_lar/public/api',
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' } // Bạn có thể thêm header tùy chỉnh ở đây nếu cần
});

// Thêm interceptor để đính kèm token vào mỗi yêu cầu
httpAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header Authorization
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Xử lý phản hồi từ server
httpAxios.interceptors.response.use(response => {
  return response.data; // Trả về dữ liệu response
}, error => {
  // Xử lý lỗi
  if (error.response && error.response.status === 401) {
    // Xử lý khi token không hợp lệ hoặc hết hạn
    console.error('Unauthorized access - token might be invalid or expired.');
    // Có thể thêm logic để chuyển hướng đến trang đăng nhập hoặc thông báo cho người dùng
  }
  return Promise.reject(error); // Trả về lỗi để xử lý ở nơi gọi
});

export default httpAxios;
