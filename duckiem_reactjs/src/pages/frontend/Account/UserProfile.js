import React, { useEffect, useState } from "react"; 
import userService from "../../../services/UserServices";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fullname: "",
    gender: "",
    phone: "",
    thumbnail: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userService.getUserInfo();
        setUserInfo(response.user); 
        setFormData({
          name: response.user.name,
          email: response.user.email,
          fullname: response.user.fullname,
          gender: response.user.gender,
          phone: response.user.phone,
          thumbnail: null,
        });
      } catch (error) {
        if (error.response) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("Đã xảy ra lỗi, vui lòng thử lại.");
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      thumbnail: e.target.files[0],
    }));
  };

  const handleUpdate = async () => {
    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    updatedData.append("fullname", formData.fullname);
    updatedData.append("gender", formData.gender);
    updatedData.append("phone", formData.phone);
    if (formData.thumbnail) {
      updatedData.append("thumbnail", formData.thumbnail);
    }

    try {
      const response = await userService.update(updatedData, userInfo.id);
      setSuccessMsg(response.message);
      setUserInfo(response.user);
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    }
  };

  // Kiểm tra userInfo có null không trước khi lấy thuộc tính thumbnail
  const avatarUrl = userInfo && userInfo.thumbnail 
    ? `http://127.0.0.1:8000/images/users/${userInfo.thumbnail}` 
    : 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'; // URL ảnh đại diện mặc định

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-8">
      {errorMsg ? (
        <p className="text-red-500 text-lg">{errorMsg}</p>
      ) : userInfo ? (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Hồ Sơ Của Tôi</h2>
          <p className="text-gray-500 text-center mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          <hr className="border-t border-gray-200 mb-6" />

          {successMsg && (
            <p className="text-green-600 text-center mb-4">{successMsg}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center mb-6">
              {/* Thay đổi ở đây để kích hoạt chọn tệp khi nhấn vào hình ảnh */}
              <label htmlFor="thumbnail" className="cursor-pointer">
                <img
                  src={avatarUrl} // Hiển thị hình ảnh người dùng
                  alt="User Thumbnail"
                  className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4"
                />
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Ẩn input file
              />
              <label className="text-gray-700 font-semibold mb-1">Hình ảnh</label>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Tên đăng nhập</span>
                <span className="text-gray-900">{userInfo.name}</span>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">Tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Email</span>
                <input
                  type="text"
                  name="email"
                  value={userInfo.email.replace(/(.{2})(.*)(@.*)/, "$1*****$3")}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Số điện thoại</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-semibold">Giới tính</span>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={formData.gender === "Nam"}
                    onChange={handleChange}
                    className="focus:ring-blue-400"
                  />
                  <span>Nam</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={formData.gender === "Nữ"}
                    onChange={handleChange}
                    className="focus:ring-blue-400"
                  />
                  <span>Nữ</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Khác"
                    checked={formData.gender === "Khác"}
                    onChange={handleChange}
                    className="focus:ring-blue-400"
                  />
                  <span>Khác</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-primeColor hover:bg-black text-white py-2 rounded-lg font-semibold transition duration-200 mt-6"
          >
            Cập nhật
          </button>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
};

export default UserProfile;
