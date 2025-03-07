import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../../services/UserServices"; // Nhập dịch vụ người dùng

const SignIn = () => {
  const [login, setLogin] = useState(""); // Đổi tên từ email thành login
  const [password, setPassword] = useState("");
  const [errLogin, setErrLogin] = useState(""); // Đổi tên từ errEmail thành errLogin
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate(); // Khởi tạo hook useNavigate


  const handleLogin = (e) => {
    setLogin(e.target.value);
    setErrLogin("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    if (!login) {
      setErrLogin("Enter your email or username");
      return;
    }
  
    if (!password) {
      setErrPassword("Create a password");
      return;
    }
  
    try {
      const response = await userService.login({ login, password });
      console.log('Đăng nhập thành công:', response.user);
  
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.user.name); // Lưu tên người dùng
      // Kiểm tra xem token và tên người dùng đã được lưu chưa
        console.log('Token:', localStorage.getItem('token'));
        console.log('Username:', localStorage.getItem('username'));
      setSuccessMsg("Đăng nhập thành công!");
      setLogin("");
      setPassword("");
      setErrorMsg("");
  
      navigate('/admin');
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Đã xảy ra lỗi, vui lòng thử lại.");
      }
      setSuccessMsg("");
    }
  };
  
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full lgl:w-1/2 h-full flex justify-center items-center">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/signup">
              <button
                className="w-full h-10 bg-primeColor text-gray-200 rounded-md text-base font-titleFont font-semibold 
                tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-auto flex items-center justify-center" onSubmit={handleSignIn}>
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4 text-center">
                Sign in Admin
              </h1>
              <div className="flex flex-col gap-3">
                {/* Login (Email or Username) */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">Work Email or Username</p>
                  <input
                    onChange={handleLogin}
                    value={login}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="john@workemail.com or username"
                  />
                  {errLogin && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errLogin}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">Password</p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Create password"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300"
                >
                  Sign In
                </button>

                {/* Forgot password link */}
                <div className="mt-4 text-center">
                  <Link to="/admin/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot your password?
                  </Link>
                </div>

                <p className="text-sm text-center font-titleFont font-medium mt-4">
                  Don't have an Account?{" "}
                  <Link to="/signup">
                    <span className="hover:text-blue-600 duration-300">Sign up</span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
