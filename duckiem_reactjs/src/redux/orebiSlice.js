import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrderServices from "../services/OrderServices";  // Import OrderServices

const initialState = {
  userInfo: null,  // Thông tin người dùng
  products: [],    // Danh sách sản phẩm trong giỏ hàng
  loading: false,  // Trạng thái tải
  error: null,     // Thông báo lỗi khi gửi dữ liệu
  successMsg: "",  // Thông báo thành công sau khi đặt hàng
};

// Tạo action bất đồng bộ để gửi giỏ hàng lên server (checkout)
export const checkoutCart = createAsyncThunk(
  "orebi/checkoutCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await OrderServices.checkout(cartData);  // Gọi API checkout
      console.log("gửi dữ liệu giỏ hàng:", response);
      return response.data;  // Trả về dữ liệu khi thành công
    } catch (error) {
      return rejectWithValue(error.response.data);  // Nếu có lỗi, trả về thông tin lỗi
    }
  }
);

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    // Các reducer khác vẫn giữ nguyên
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logoutUser: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true; // Đang gửi dữ liệu
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.loading = false; // Gửi thành công
        state.successMsg = "Đặt hàng thành công!";
        state.products = [];  // Xóa giỏ hàng sau khi đặt hàng thành công
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false; // Kết thúc gửi dữ liệu
        state.error = action.payload || "Có lỗi xảy ra khi đặt hàng"; // Lưu thông báo lỗi
      });
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  resetCart,
  setUserInfo,
  logoutUser,
} = orebiSlice.actions;

export default orebiSlice.reducer;
