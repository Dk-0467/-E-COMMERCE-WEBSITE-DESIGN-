<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;

class BrandController extends Controller
{
    // Hiển thị danh sách thương hiệu hoạt động
    public function index()
    {
        $brands = Brand::where('status', '!=', 2)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "image", "description", "status", "sort_order")
            ->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'brands' => $brands
        ]);
    }

    // Hiển thị danh sách thương hiệu đã xóa
    public function trash()
    {
        $brands = Brand::where('status', '=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "image", "description", "status")
            ->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'brands' => $brands
        ]);
    }


    public function show($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }

    public function store(StoreBrandRequest $request)
    {
        try {
            $brand = new Brand();
            $brand->name = $request->name;
            $brand->slug = $request->slug;

            if ($request->hasFile('image')) {
                $exten = $request->image->extension();
                $imageName = date('YmdHis') . "." . $exten;
                $request->image->move(public_path('images/brand'), $imageName);
                $brand->image = $imageName;
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có file ảnh nào được tải lên'
                ], 400);
            }

            $brand->description = $request->description;
            $brand->sort_order = $request->sort_order;
            $brand->created_by = 1;
            $brand->created_at = now();
            $brand->status = $request->status;

            if ($brand->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Thêm thành công',
                    'brand' => $brand
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateBrandRequest $request, $id)
    {
        try {
            $brand = Brand::find($id);
            
            if (!$brand) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy branđ'
                ], 404);
            }

            $brand->name = $request->name;
            $brand->slug = $request->slug;

            if ($request->hasFile('image')) {
                $exten = $request->image->extension();
                $imageName = date('YmdHis') . "." . $exten;
                $request->image->move(public_path('images/brand'), $imageName);
                $brand->image = $imageName;
            } 
            // else {
            //     // Giữ lại hình ảnh cũ nếu không upload ảnh mới
            //     $brand->image = $brand->image;
            // }

            $brand->description = $request->description;
            $brand->sort_order = $request->sort_order;
            $brand->status = $request->status; 

            if ($brand->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật thành công',
                    'brand' => $brand
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Thay đổi trạng thái thương hiệu
    public function status($id) 
    {
        $brand = Brand::find($id);
        if ($brand === null) {
            return response()->json([
                'status' => false,
                'message' => 'Thương hiệu không tồn tại',
            ]);
        }

        // Toggle trạng thái: nếu đang bật (status = 1), chuyển thành tắt (status = 0), ngược lại
        $brand->status = $brand->status == 1 ? 0 : 1;
        
        // Cập nhật thời gian sửa đổi
        $brand->updated_at = now();

        // Lưu thay đổi và trả kết quả
        if ($brand->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật trạng thái thành công',
                'brand' => $brand
            ]);
        }

        // Trường hợp không thể lưu thay đổi
        return response()->json([
            'status' => false,
            'message' => 'Không thể cập nhật trạng thái',
        ]);
    }
    
    // Xóa thương hiệu (chuyển vào thùng rác)
    public function delete($id)
    {
        $brand = Brand::find($id);
        if ($brand === null) {
            return response()->json([
                'status' => false,
                'message' => 'Thương hiệu không tồn tại',
            ]);
        }

        $brand->status = 0; // Xóa bằng cách thay đổi trạng thái
        $brand->updated_at = now();

        if ($brand->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Đã chuyển vào thùng rác',
                'brand' => $brand
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa',
        ]);
    }

    // Phục hồi thương hiệu đã xóa
    public function restore($id)
    {
        $brand = Brand::find($id);
        if ($brand === null || $brand->status != 2) {
            return response()->json([
                'status' => false,
                'message' => 'Thương hiệu không tồn tại hoặc không cần phục hồi',
            ]);
        }

        $brand->status = 1; // Hoặc giá trị status khác không
        $brand->updated_at = now();

        if ($brand->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Phục hồi thành công',
                'brand' => $brand
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể phục hồi',
        ]);
    }

    // Xóa vĩnh viễn thương hiệu
    public function destroy($id)
{
    $brand = Brand::find($id);
    if ($brand === null) {
        return response()->json([
            'status' => false,
            'message' => 'Thương hiệu không tồn tại',
        ]);
    }

    // Kiểm tra xem có sản phẩm nào liên kết với thương hiệu này không
    if ($brand->products()->exists()) {
        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa thương hiệu này vì nó còn liên kết với sản phẩm',
        ], 400);
    }

    // Xóa ảnh nếu cần thiết
    if ($brand->image) {
        $oldImagePath = public_path('images/brand/') . $brand->image;
        if (file_exists($oldImagePath)) {
            unlink($oldImagePath);
        }
    }

    if ($brand->delete()) {
        return response()->json([
            'status' => true,
            'message' => 'Xóa thành công',
        ]);
    }

    return response()->json([
        'status' => false,
        'message' => 'Không thể xóa',
    ]);
}

}
