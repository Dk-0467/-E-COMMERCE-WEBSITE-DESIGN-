<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order; // Đảm bảo bạn có model Order để tương tác với bảng cdtt_order
use App\Models\OrderDetail;
use App\Models\User;

class OrderController extends Controller
{
    // Hiển thị danh sách đơn hàng
    public function index()
    {
        $orders = Order::where('status', '!=', 0) 
            ->orderBy('created_at', 'DESC')
            ->select("id", "user_id", "email", "phone", "address", "updated_by", "status", "created_at", "updated_at")
            ->get();
            
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'orders' => $orders
        ]);
    }

    // Hiển thị danh sách đơn hàng đã xóa
    public function trash()
    {
        $orders = Order::where('status', '=', 0)
            ->orderBy('created_at', 'DESC')
            ->select("id", "user_id", "name", "email", "phone", "address", "updated_by", "status", "created_at", "updated_at")
            ->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thùng rác thành công',
            'orders' => $orders
        ]);
    }

    // Hiển thị thông tin chi tiết một đơn hàng
    public function show($id)
    {
        $order = Order::with(['user', 'orderDetails'])->find($id); // Tải người dùng và chi tiết đơn hàng cùng với đơn hàng
    
        if ($order === null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }
    
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'order' => [
                'id' => $order->id,
                'email' => $order->email,
                'phone' => $order->phone,
                'address' => $order->address,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'order_details' => $order->orderDetails->map(function($detail) {
                    return [
                        'id' => $detail->id,
                        'order_id' => $detail->order_id,
                        'product_id' => $detail->product_id,
                        'qty' => $detail->qty,
                        'price' => $detail->price,
                        'discount' => $detail->discount,
                        'amount' => $detail->amount,
                    ];
                }),
            ],
        ]);
    }
    
    public function status($id)
    {
        $order = Order::find($id);
        
        if ($order === null) {
            return response()->json([
                'status' => false,
                'message' => 'Đơn hàng không tồn tại',
            ]);
        }
    
        // Kiểm tra trạng thái hiện tại và thay đổi
        if ($order->status == 1) {
            // Nếu đơn hàng đang hoạt động (status = 1), chuyển sang ngừng hoạt động (status = 0)
            $order->status = 2;
            $message = 'Đơn hàng đã ngừng hoạt động';
        } else {
            // Nếu đơn hàng đang ngừng hoạt động (status = 0), chuyển sang hoạt động (status = 1)
            $order->status = 1;
            $message = 'Đơn hàng đã hoạt động trở lại';
        }
        
        $order->updated_at = now(); // Cập nhật thời gian thay đổi
    
        if ($order->save()) {
            return response()->json([
                'status' => true,
                'message' => $message,
                'order' => $order
            ]);
        }
    
        return response()->json([
            'status' => false,
            'message' => 'Không thể cập nhật trạng thái',
        ]);
    }
    
    // Xóa đơn hàng (chuyển vào thùng rác)
    public function delete($id)
    {
        $order = Order::find($id);

        if ($order === null) {
            return response()->json([
                'status' => false,
                'message' => 'Đơn hàng không tồn tại',
            ]);
        }

        $order->status = 0; // Chuyển trạng thái đơn hàng về 0 để đánh dấu là đã xóa
        $order->updated_at = now();

        if ($order->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Đơn hàng đã được chuyển vào thùng rác',
                'order' => $order,
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa đơn hàng',
        ]);
    }

    // Xóa vĩnh viễn đơn hàng
    public function destroy($id)
    {
        $order = Order::find($id);
        if ($order === null) {
            return response()->json([
                'status' => false,
                'message' => 'Đơn hàng không tồn tại',
            ]);
        }

        if ($order->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa thành công',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa đơn hàng',
        ]);
    }
    // Phục hồi đơn hàng đã xóa
    public function restore($id)
    {
        $order = Order::find($id);
        if ($order === null || $order->status != 0) {
            return response()->json([
                'status' => false,
                'message' => 'Đơn hàng không tồn tại hoặc không cần phục hồi',
            ]);
        }

        $order->status = 1; // Hoặc giá trị status khác không
        $order->updated_at = now();

        if ($order->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Phục hồi đơn hàng thành công',
                'order' => $order
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể phục hồi đơn hàng',
        ]);
    }

    public function processCheckout(Request $request)
    {
        // Lấy người dùng đang đăng nhập
        $user = auth()->user();
    
        // Lấy danh sách sản phẩm trong giỏ hàng, tổng tiền thanh toán và phí vận chuyển
        $cartItems = $request->cartItems;
        $totalAmount = $request->totalAmount;
        $shippingCharge = $request->shippingCharge;
    
        // Tạo đơn hàng mới trong bảng cdtt_order
        $order = Order::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone, // Giả sử có trường phone trong bảng người dùng
            'address' => $user->address, // Giả sử có trường address trong bảng người dùng
            'status' => 1, // Trạng thái đơn hàng
        ]);
    
        // Lưu từng sản phẩm vào bảng cdtt_orderdetail
        foreach ($cartItems as $item) {
            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'qty' => $item['quantity'], // Sử dụng qty thay vì quantity
                'price' => $item['price'],
                'discount' => $item['discount'] ?? 0, // Giả sử có trường discount, nếu không có thì mặc định là 0
                'amount' => $item['quantity'] * $item['price'], // Tính tổng tiền cho sản phẩm
            ]);
        }
    
        // Cập nhật tổng tiền cho đơn hàng trong bảng cdtt_order
        $order->update([
            'total_amount' => $totalAmount + $shippingCharge,
            'shipping_charge' => $shippingCharge,
        ]);
    
        // Trả về phản hồi với thông báo thành công
        return response()->json(['message' => 'Order placed successfully!', 'order' => $order]);
    }

    // Lấy lịch sử mua hàng của người dùng
    public function userOrders(Request $request)
    {
        // Lấy ID của người dùng hiện tại
        $userId = auth()->id();
    
        // Lấy tất cả đơn hàng của người dùng hiện tại (bao gồm chi tiết đơn hàng và hình ảnh sản phẩm)
        $orders = Order::with(['orderDetails.product']) // Quan hệ với OrderDetail và Product
            ->where('user_id', $userId) // Lọc theo user_id
            ->orderBy('created_at', 'DESC') // Sắp xếp theo ngày tạo
            ->get();
    
        // Kiểm tra nếu không có đơn hàng nào
        if ($orders->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không có đơn hàng nào',
            ]);
        }
    
        // Trả về danh sách đơn hàng với thông tin hình ảnh sản phẩm
        return response()->json([
            'status' => true,
            'message' => 'Lịch sử mua hàng',
            'orders' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'order_details' => $order->orderDetails->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'product_id' => $detail->product_id,
                            'product_name' => $detail->product->name, // Lấy tên sản phẩm từ quan hệ với bảng sản phẩm
                            'product_image' => $detail->product->images, // Lấy hình ảnh sản phẩm từ quan hệ với bảng sản phẩm
                            'quantity' => $detail->qty,
                            'price' => $detail->price,
                            'discount' => $detail->discount,
                            'amount' => $detail->amount,
                        ];
                    }),
                ];
            }),
        ]);
    }
        
    

}
