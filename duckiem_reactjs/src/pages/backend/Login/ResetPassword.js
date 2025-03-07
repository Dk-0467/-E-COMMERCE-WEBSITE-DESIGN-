import React, { useState } from "react";
import userService from "../../../services/UserServices"; // Nhập dịch vụ người dùng

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "passwordConfirmation") setPasswordConfirmation(value);
    if (name === "token") setToken(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !passwordConfirmation || !token) {
      setError("Vui lòng điền đầy đủ các trường.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await userService.resetPassword({
        email,
        password,
        password_confirmation: passwordConfirmation,
        token,
      });
      setMessage(response.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full lgl:w-1/2 h-full flex flex-col items-center">
        {message ? (
          <p className="text-green-500">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <h2 className="text-2xl mb-4 text-center">Đặt lại mật khẩu</h2>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              name="token"
              value={token}
              onChange={handleInputChange}
              placeholder="Nhập mã token"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu mới"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="password"
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={handleInputChange}
              placeholder="Xác nhận mật khẩu mới"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full p-2 mt-4 bg-blue-500 text-white rounded"
            >
              Đổi mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
