import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useNavigate } from "react-router-dom";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);

  const handleAddToCart = () => {
     // Kiểm tra xem người dùng đã đăng nhập chưa
     if (!userInfo) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!"); // Thay thế toast bằng alert
      return navigate("/signin"); // Dừng lại nếu chưa đăng nhập
    } else {
      dispatch(
        addToCart({
          _id: productInfo?.id,
          name: productInfo?.name,
          quantity: 1,
          image:
            productInfo?.images && productInfo.images.length > 0
              ? `http://127.0.0.1:8000/images/product/${productInfo.images[0].thumbnail}`
              : "https://via.placeholder.com/150",
          badge: productInfo?.badge,
          price: productInfo?.price,
          colors: productInfo?.color,
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold ">{productInfo.name || "Tên sản phẩm"}</h2>
      <p className="text-xl font-semibold">${productInfo.price || "0.00"}</p>
      <p className="text-base font-semibold text-gray-900">{productInfo.description || "Mô tả sản phẩm"}</p>
      <p className="text-base text-gray-600">{productInfo.content || "Mô tả sản phẩm"}</p>
      <button
        onClick={handleAddToCart}
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-semibold"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductInfo;
