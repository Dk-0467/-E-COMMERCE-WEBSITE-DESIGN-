<?php

namespace App\Http\Controllers;

use App\Models\ProductStore;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductStoreRequest;
use App\Models\Product;

class ProductStoreController extends Controller
{
    // Hiển thị danh sách sản phẩm
    public function index()
    {
        $productstores = ProductStore::where('status', '!=', 0) // Chỉ lấy các bản ghi không bị xóa
            ->orderBy('created_at', 'DESC')
            ->select("id", "product_id", "price_root", "qty", "created_at", "updated_at", "created_by", "updated_by", "status")
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productstores' => $productstores,
            'total' => count($productstores)
        ]);
    }

    // Tạo mới ProductStore
    public function store(StoreProductStoreRequest $request)
    {
        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không hợp lệ',
                'productstore' => null
            ]);
        }

        $productstore = new ProductStore();
        $productstore->product_id = $request->product_id;
        $productstore->price_root = $request->price_root;
        $productstore->qty = $request->qty;
        $productstore->created_by = 1;
        $productstore->created_at = now();
        $productstore->status = 1;

        if ($productstore->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Thêm thành công',
                'productstore' => $productstore
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể thêm',
            'productstore' => null
        ]);
    }

    // Hiển thị chi tiết ProductStore
    public function show($id)
    {
        $productstore = ProductStore::find($id);

        if (!$productstore) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm trong kho',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productstore' => $productstore
        ]);
    }

    // Cập nhật ProductStore
    public function update(StoreProductStoreRequest $request, $id)
    {
        $productstore = ProductStore::find($id);

        if (!$productstore) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm trong kho',
            ], 404);
        }

        $productstore->product_id = $request->product_id;
        $productstore->price_root = $request->price_root;
        $productstore->qty = $request->qty;
        $productstore->updated_by = 1;
        $productstore->updated_at = now();

        if ($productstore->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công',
                'productstore' => $productstore
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Cập nhật thất bại',
        ]);
    }

    // Thay đổi trạng thái ProductStore
    public function status($id)
    {
        $productstore = ProductStore::find($id);

        if (!$productstore) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm trong kho',
            ], 404);
        }

        $productstore->status = $productstore->status == 1 ? 2 : 1;
        $productstore->updated_at = now();

        if ($productstore->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Thay đổi trạng thái thành công',
                'productstore' => $productstore
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Thay đổi trạng thái thất bại',
        ]);
    }

    // Lấy danh sách các ProductStore đã xóa
    public function trash()
    {
        $productstores = ProductStore::where('status', 0)
            ->orderBy('created_at', 'ASC')
            ->select("id", "product_id", "price_root", "qty", "created_at", "updated_at", "created_by", "updated_by", "status")
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productstores' => $productstores
        ]);
    }

    // Xóa (chuyển vào thùng rác) ProductStore
    public function delete($id)
    {
        $productstore = ProductStore::find($id);

        if (!$productstore) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm trong kho',
            ], 404);
        }

        $productstore->status = 0; // Đánh dấu đã xóa
        $productstore->updated_at = now();

        if ($productstore->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Đã chuyển vào thùng rác',
                'productstore' => $productstore
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa',
        ]);
    }

    // Phục hồi ProductStore từ thùng rác
    public function restore($id)
    {
        $productstore = ProductStore::find($id);

        if (!$productstore || $productstore->status != 0) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm hoặc không cần phục hồi',
            ], 404);
        }

        $productstore->status = 1; // Phục hồi
        $productstore->updated_at = now();

        if ($productstore->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Phục hồi thành công',
                'productstore' => $productstore
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Phục hồi thất bại',
        ]);
    }

    // Xóa vĩnh viễn ProductStore
    public function destroy($id)
    {
        $productstore = ProductStore::find($id);

        if (!$productstore) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm trong kho',
            ], 404);
        }

        if ($productstore->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa thành công'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Xóa thất bại',
        ], 500);
    }
}
