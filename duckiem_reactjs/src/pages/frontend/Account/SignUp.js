import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { logoLight } from "../../../assets/images";
import UserServices from "../../../services/UserServices";

const SignUp = () => {
  const [clientName, setClientName] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [checked, setChecked] = useState(false);

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!clientName) newErrors.clientName = "Enter your name";
    if (!fullname) newErrors.fullname = "Enter your full name";
    if (!email) {
      newErrors.email = "Enter your email";
    } else if (!EmailValidation(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!phone) newErrors.phone = "Enter your phone number";
    if (!password) newErrors.password = "Create a password";
    else if (password.length < 6) newErrors.password = "Passwords must be at least 6 characters";
    if (!address) newErrors.address = "Enter your address";
    if (!gender) newErrors.gender = "Select your gender";
    
    return newErrors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!checked) {
      setErrorMsg("Bạn cần đồng ý với điều khoản và điều kiện.");
      return;
    }
  
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await UserServices.registerUser({
        name: clientName,
        fullname,
        email,
        phone,
        password,
        address,
        gender,
      });
  
      if (response.data) {
        setSuccessMsg("Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
        setTimeout(() => {
          navigate('/signin');
        }, 2000); // Chờ 2 giây trước khi chuyển hướng
      }
    } catch (error) {
      setErrorMsg(error.response?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
    return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Get started for free</h1>
            <p className="text-base">Create your account to access more</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Get started fast with OREBI</span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">© OREBI</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Terms</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Privacy</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Security</p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">{successMsg}</p>
            <Link to="/signin">
              <button className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide hover:bg-black hover:text-white duration-300">Sign in</button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">Create your account</h1>
              <div className="flex flex-col gap-3">
                {/* Client Name */}
                <div className="flex flex-col gap-.5">
                  <label className="font-titleFont text-base font-semibold text-gray-600">Name</label>
                  <input
                    name="clientName"
                    onChange={handleChange(setClientName)}
                    value={clientName}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="eg. John Doe"
                  />
                  {errors.clientName && <p className="text-sm text-red-500 font-titleFont font-semibold px-4">{errors.clientName}</p>}
                </div>
                {/* Full Name */}
                <div className="flex flex-col gap-.5">
                  <label className="font-titleFont text-base font-semibold text-gray-600">Full Name</label>
                  <input
                    name="fullname"
                    type="text"
                    placeholder="Họ và tên"
                    value={fullname}
                    onChange={handleChange(setFullname)}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  />
                  {errors.fullname && <p className="text-sm text-red-500 font-titleFont font-semibold px-4">{errors.fullname}</p>}
                </div>
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <label className="font-titleFont text-base font-semibold text-gray-600">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange(setEmail)}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    placeholder="example@gmail.com"
                  />
                  {errors.email && <p className="text-sm text-red-500 font-titleFont font-semibold px-4">{errors.email}</p>}
                </div>
                {/* Phone Number */}
                <div className="flex flex-col gap-.5">
                  <label className="font-titleFont text-base font-semibold text-gray-600">Phone Number</label>
                  <input
                    name="phone"
                    onChange={handleChange(setPhone)}
                    value={phone}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="eg. +84 123456789"
                  />
                  {errors.phone && <p className="text-sm text-red-500 font-titleFont font-semibold px-4">{errors.phone}</p>}
                </div>
                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <label className="font-titleFont text-base font-semibold text-gray-600">Create Password</label>
                  <input
                    name="password"
                    onChange={handleChange(setPassword)}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Enter password"
                  />
                  {errors.password && <p className="text-sm text-red-500 font-titleFont font-semibold px-4">{errors.password}</p>}
                </div>
                {/* Address */}
                <div className="flex flex-col gap-.5">
                  <label className="font-titleFont text-base font-semibold text-gray-600">Address</label>
                  <input
                    name="address"
                    onChange={handleChange(setAddress)}
                    value={address}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Enter your address"
                  />
                  {errors.address && <p className="text-sm text-red-500 font-titleFont font-semibold px-4">{errors.address}</p>}
                </div>
                {/* Gender */}
                <div className="flex flex-col gap-.5">
                  <label className="font-titleFont text-base font-semibold text-gray-600">Gender</label>
                  <select
                    name="gender"
                    onChange={handleChange(setGender)}
                    value={gender}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <p className="text-sm text-red-500 font-titleFont font-semibold px-4">{errors.gender}</p>}
                </div>
                {/* Terms and Conditions */}
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="w-4 h-4"
                  />
                  <p className="text-sm">I agree to the{" "}
                    <span className="text-blue-600 cursor-pointer">terms and conditions</span>
                  </p>
                </div>
                {/* Error and Submit */}
                {errorMsg && <p className="text-red-500 text-center font-semibold">{errorMsg}</p>}
                <button
                  type="submit"
                  className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide hover:bg-black hover:text-white duration-300 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
