import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/pageProps/Breadcrumbs";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import ContactService from '../../../services/ContactServices';

const Contact = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [messages, setMessages] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errMessages, setErrMessages] = useState("");

  const handleName = (e) => setClientName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePhone = (e) => setPhone(e.target.value);
  const handleTitle = (e) => setTitle(e.target.value);
  const handleMessages = (e) => setMessages(e.target.value);

  const EmailValidation = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handlePost = async (e) => {
    e.preventDefault();
    setErrClientName("");
    setErrEmail("");
    setErrMessages("");

    if (!clientName) setErrClientName("Vui lòng nhập tên của bạn");
    if (!email || !EmailValidation(email)) setErrEmail("Vui lòng nhập email hợp lệ");
    if (!messages) setErrMessages("Vui lòng nhập nội dung tin nhắn");

    if (clientName && email && EmailValidation(email) && messages) {
      const contactData = {
        name: clientName,
        email: email,
        phone: phone,
        title: title,
        content: messages,
      };

      try {
        const result = await ContactService.insert(contactData);
        if (result.status) {
          setSuccessMsg(`Cảm ơn ${clientName}. Tin nhắn của bạn đã được gửi thành công.`);
          setClientName("");
          setEmail("");
          setPhone("");
          setTitle("");
          setMessages("");
        } else {
          alert("Gửi tin nhắn thất bại. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi khi gửi tin nhắn của bạn.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      <Breadcrumbs title="Liên hệ" prevLocation={prevLocation} />
      <p className="text-gray-600 mb-4">Mọi chi tiết xin liên hệ với chúng tôi. Chúng tôi sẵn sàng hỗ trợ các bạn.</p>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          {successMsg ? (
            <p className="w-full py-4 px-6 bg-green-100 text-green-600 rounded-lg">{successMsg}</p>
          ) : (
            <form className="space-y-4" onSubmit={handlePost}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-gray-600 font-medium">Họ & Tên *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={handleName}
                    placeholder="Nhập họ & tên"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errClientName && <p className="text-red-500 text-sm">{errClientName}</p>}
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-gray-600 font-medium">Số Điện Thoại *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={handlePhone}
                    placeholder="Nhập số điện thoại"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Nhập email của bạn"
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errEmail && <p className="text-red-500 text-sm">{errEmail}</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Tiêu đề</label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitle}
                  placeholder="Nhập tiêu đề"
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium">Nội dung</label>
                <textarea
                  value={messages}
                  onChange={handleMessages}
                  placeholder="Nhập nội dung tin nhắn"
                  className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="5"
                ></textarea>
                {errMessages && <p className="text-red-500 text-sm">{errMessages}</p>}
              </div>

              <button
                type="submit"
                className="w-full p-3 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
              >
                Gửi
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="h-64">
            <LoadScript googleMapsApiKey="AIzaSyArOHnHazCxLtU5V1l_9xJb0iCFst49Wyk">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={{ lat: 10.762622, lng: 106.660172 }}
                zoom={15}
              >
                <Marker position={{ lat: 10.762622, lng: 106.660172 }} />
              </GoogleMap>
            </LoadScript>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold text-xl text-gray-800">ĐỊA CHỈ CÔNG TY</h2>
            <p>Công ty TNHH Một Thành Viên Đồ Chơi Công Nghệ Việt Nam</p>
            <p>52 Trần Minh Quyền, Phường 11, Quận 10, Tp Hồ Chí Minh</p>
            <p>Email: <a href="mailto:buiduckiem0467@gmail.com" className="text-blue-500">buiduckiem0467@gmail.com</a></p>
            <p>Website: <a href="https://www.gearshop.vn" className="text-blue-500">www.gearshop.vn</a></p>
            <h3 className="font-semibold mt-2">Giờ mở cửa</h3>
            <p>Thứ 2 - Thứ 7: 9h30 - 20h30</p>
            <p>Chủ nhật: 9h30 - 17h30</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
