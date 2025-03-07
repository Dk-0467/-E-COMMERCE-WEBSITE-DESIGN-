<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

class CategoryController extends Controller
{
    // Hiển thị danh sách danh mục
    public function index()
    {
        $categories = Category::where('status', '!=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "parent_id", "sort_order", "image", "description", "status")
            ->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'categories' => $categories
        ]);
    }

    // Hiển thị danh sách danh mục đã xóa
    public function trash()
    {
        $categories = Category::where('status', '=', 0)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "parent_id", "sort_order", "image", "description", "status")
            ->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thùng rác thành công',
            'categories' => $categories
        ]);
    }

    // Hiển thị thông tin chi tiết một danh mục
    public function show($id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục',
            ], 404);
        }
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'category' => $category
        ]);
    }

    // Lưu trữ danh mục mới
    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = new Category();
            $category->name = $request->name;
            $category->slug = $request->slug;
            $category->parent_id = $request->parent_id;
            $category->sort_order = $request->sort_order;
            $category->description = $request->description;
            $category->status = $request->status;

            if ($request->hasFile('image')) {
                $exten = $request->image->extension();
                $imageName = date('YmdHis') . "." . $exten;
                $request->image->move(public_path('images/category'), $imageName);
                $category->image = $imageName;
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có file ảnh nào được tải lên'
                ], 400);
            }

            $category->created_by = 1; // Giá trị giả định cho người tạo
            $category->created_at = now();

            if ($category->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Thêm thành công',
                    'category' => $category
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm danh mục'
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật danh mục
    public function update(UpdateCategoryRequest $request, $id)
    {
        try {
            // Tìm danh mục theo ID
            $category = Category::find($id);
    
            if (!$category) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy danh mục'
                ], 404);
            }
    
            // Cập nhật các trường
            $category->name = $request->name;
            $category->slug = $request->slug;
            $category->parent_id = $request->parent_id;
            $category->sort_order = $request->sort_order;
            $category->description = $request->description;
            $category->status = $request->status;    
            // Cập nhật hình ảnh nếu có
            if ($request->hasFile('image')) {
                $exten = $request->image->extension();
                $imageName = date('YmdHis') . "." . $exten;
                $request->image->move(public_path('images/category'), $imageName);
                $category->image = $imageName;
            }
    
            // Cập nhật thời gian cập nhật
            $category->updated_at = now();
    
            // Lưu thay đổi
            if ($category->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật thành công',
                    'category' => $category
                ]);
            }
    
            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật danh mục'
            ], 500);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
    

    // Thay đổi trạng thái danh mục
    public function status($id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại',
            ]);
        }

        $category->status = $category->status == 1 ? 2 : 1;
        $category->updated_at = now();

        if ($category->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật trạng thái thành công',
                'category' => $category
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể cập nhật trạng thái',
        ]);
    }


    
    

    // Xóa danh mục (chuyển vào thùng rác)
    public function delete($id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại',
            ]);
        }

        $category->status = 0; // Xóa bằng cách thay đổi trạng thái
        $category->updated_at = now();

        if ($category->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Đã chuyển vào thùng rác',
                'category' => $category
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa danh mục',
        ]);
    }

    // Phục hồi danh mục đã xóa
    public function restore($id)
    {
        $category = Category::find($id);
        if ($category === null || $category->status != 0) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại hoặc không cần phục hồi',
            ]);
        }

        $category->status = 1; // Hoặc giá trị status khác không
        $category->updated_at = now();

        if ($category->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Phục hồi thành công',
                'category' => $category
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể phục hồi danh mục',
        ]);
    }


    // Xóa vĩnh viễn danh mục
    public function destroy($id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại',
            ]);
        }

        // Kiểm tra xem danh mục có liên kết với sản phẩm nào không
        if ($category->products()->count() > 0) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa danh mục vì nó đang được liên kết với sản phẩm.',
            ], 400);
        }

        // Xóa ảnh nếu có
        if ($category->image) {
            $oldImagePath = public_path('images/category/') . $category->image;
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        if ($category->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa thành công',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa danh mục',
        ]);
    }



    public function category_list($parentid = null)
    {
        // Nếu không có parentid hoặc parentid là 0, lấy tất cả các danh mục có status = 1
        if ($parentid === null || $parentid == 0) {
            $categories = Category::where('parent_id', 0) // chỉ lấy danh mục cha
                ->where('status', '=', 1)
                ->orderBy('sort_order', 'ASC')
                ->get(['id', 'name', 'slug', 'parent_id', 'sort_order', 'image', 'description', 'status']);
        } else {
            // Lấy các danh mục cha dựa trên parent_id
            $categories = Category::where('parent_id', $parentid)
                ->where('status', '=', 1)
                ->orderBy('sort_order', 'ASC')
                ->get(['id', 'name', 'slug', 'parent_id', 'sort_order', 'image', 'description', 'status']);
        }
    
        // Lặp qua từng danh mục và lấy danh mục con
        foreach ($categories as $category) {
            // Lấy danh mục con
            $category->children = Category::where('parent_id', $category->id)
                ->where('status', '=', 1)
                ->orderBy('sort_order', 'ASC')
                ->get(['id', 'name', 'slug', 'parent_id', 'sort_order', 'image', 'description', 'status']);
        }
    
        return response()->json([
            'status' => true,
            'message' => 'Danh sách danh mục',
            'categories' => $categories
        ]);
    }
        

}
