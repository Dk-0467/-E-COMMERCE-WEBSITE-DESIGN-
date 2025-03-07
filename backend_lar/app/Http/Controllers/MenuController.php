<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Models\cr;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menu = Menu::where('status', '!=', 0)
            ->select("id", "name", "link", "type", "status")
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menus' => $menu
        ];
        return response()->json($result);
    }

    public function trash()
    {
        $menus = Menu::where('status', '=', 0)
            ->orderBy('created_at', 'DESC')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải danh sách menu trong thùng rác thành công',
            'menus' => $menus
        ]);
    }    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMenuRequest $request)
    {
        try {
            $menu = new Menu();
            $menu->name = $request->name;
            $menu->link = $request->link;
            $menu->type = $request->type;
            $menu->created_by = 1; // Gán giá trị tạm thời
            $menu->status = $request->status;
            $menu->created_at = now();

            if ($menu->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Thêm menu thành công',
                    'menu' => $menu
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm menu'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $menu = Menu::find($id);
        if($menu == null)
        {
            $result = [
                'status' =>false,
                'message' => 'Không tìm thấy dữ liệu',
                'menu' => $menu
            ];
        }
        else
        {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'menu' => $menu
            ];
        }
        return response()->json($result);
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            // Lấy bài viết dựa trên ID (trong biến $cr)
            $menu = Menu::find($id);
            
            // Kiểm tra xem bài viết có tồn tại không
            if (!$menu) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bài viết không tồn tại',
                    'menu' => null
                ], 404); // 404: Not Found
            }
            
            // Cập nhật thông tin bài viết từ request
            $menu->name = $request->name;
            $menu->link = $request->link;
            $menu->type = $request->type;
            $menu->table_id = $request->table_id;
            $menu->status = $request->status;
    
            // Lưu các thay đổi
            if ($menu->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật bài viết thành công',
                    'menu' => $menu
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể cập nhật bài viết',
                    'menu' => null
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
                'menu' => null
            ], 500);
        }
    }
    
    public function status($id)
    {
        // Tìm bài viết theo ID
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu'
            ], 404); // 404: Not Found
        }

        // Chuyển đổi trạng thái
        $menu->status = $menu->status === 1 ? 2 : 1; // Nếu đang kích hoạt thì sẽ tắt, và ngược lại
        $menu->updated_at = now(); // Cập nhật thời gian

        // Lưu lại thay đổi
        if ($menu->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Thay đổi trạng thái thành công',
                'menu' => $menu
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể thay đổi trạng thái'
        ]);
    }

    public function delete($id)
    {
        // Tìm bài viết theo ID
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu'
            ], 404); // 404: Not Found
        }

        // Đánh dấu bài viết là đã xóa (thay đổi trạng thái)
        $menu->status = 0; // Giả định rằng 0 là trạng thái đã xóa
        $menu->updated_at = now(); // Cập nhật thời gian

        if ($menu->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa thành công',
                'menu' => $menu
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa'
        ]);
    }

    public function restore($id)
    {
        // Tìm bài viết theo ID
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu'
            ], 404); // 404: Not Found
        }

        // Khôi phục bài viết (thay đổi trạng thái)
        $menu->status = 1; // Giả định rằng 1 là trạng thái kích hoạt
        $menu->updated_at = now(); // Cập nhật thời gian

        if ($menu->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Khôi phục thành công',
                'menu' => $menu
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể khôi phục'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Tìm bài viết theo ID
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu'
            ], 404); // 404: Not Found
        }

        // Xóa bài viết vĩnh viễn
        if ($menu->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa vĩnh viễn thành công'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa vĩnh viễn'
        ]);
    }

    public function menu_header()
    {
        // Lấy danh sách menu với điều kiện status bằng 1
        $menu = Menu::where('status', 1)
                    ->where('type', 'internal')
                    ->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menu' => $menu
        ];
        return response()->json($result);
    }
    
    public function menu_footer()
    {
        // Lấy danh sách menu với điều kiện status bằng 1 và type là 'internal'
        $menu = Menu::where('status', 1)
                    ->where('type', 'external') // Thêm điều kiện lọc theo type
                    ->get();

        // Trả về kết quả
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menu' => $menu
        ];
        
        return response()->json($result);
    }

}
