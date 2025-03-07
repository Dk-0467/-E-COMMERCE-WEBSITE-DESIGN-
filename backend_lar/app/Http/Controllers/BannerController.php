<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use App\Http\Requests\StoreBannerRequest;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::where('status','!=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","image","status","position","description")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'banners'=>$banners
        ];
        return response()->json($result);
    }
    public function trash()
    {
        $banners = Banner::where('status','=',0)
            ->orderBy('sort_order','ASC')
            ->select("id","name","image","status","position")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'banners'=>$banners
        ];
        return response()->json($result);
    }
    public function show($id)
    {
        $banner = Banner::find($id);
        if($banner==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'banner'=>$banner
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'banner'=>$banner
            ];
        }
        return response()->json($result);
    }

    public function store(StoreBannerRequest $request)
    {
        $banner = new Banner();
        $banner->name =  $request->name;
        $banner->link =  $request->link;
        $check_save = false;
        //upload file
        $exten=$request->image->extension();
        $imageName = date('YmdHis').".".$exten;
        $request->image->move(public_path('images/banner'), $imageName);
        $banner->image =  $imageName;
        $banner->description =  $request->description;
        $banner->position =  $request->position;
        $banner->sort_order =  $request->sort_order;
        $banner->created_by =  1;
        $banner->created_at =  date('Y-m-d H:i:s');
        $banner->status =  $request->status;
        if($banner->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Thêm thành công',
                'banner'=>$banner
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Không thể thêm',
                'banner'=>null
            ];
        }
        return response()->json($result);
    }

    public function update(StoreBannerRequest $request, $id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            $result = [
                'status' => false,
                'message' => 'Banner không tồn tại',
            ];
            return response()->json($result);
        }
    
        $banner->name =  $request->name;
        $banner->link =  $request->link;
    
        // Check nếu có ảnh mới được upload
        if ($request->hasFile('image')) {
            $exten = $request->image->extension();
            $imageName = date('YmdHis') . "." . $exten;
            $request->image->move(public_path('images/banner'), $imageName);
            $banner->image =  $imageName;
        }
    
        $banner->description =  $request->description;
        $banner->position =  $request->position;
        $banner->sort_order =  $request->sort_order;
        $banner->status =  $request->status;
        $banner->updated_by = 1; // Cập nhật người sửa
        $banner->updated_at = date('Y-m-d H:i:s');
    
        if ($banner->save()) {
            $result = [
                'status' => true,
                'message' => 'Cập nhật thành công',
                'banner' => $banner
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thể cập nhật',
                'banner' => null
            ];
        }
        return response()->json($result);
    }

    public function status($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json([
                'status' => false,
                'message' => 'Banner không tồn tại',
            ]);
        }

        $banner->status = $banner->status == 1 ? 2 : 1;
        $banner->updated_by = 1; // Cập nhật người sửa
        $banner->updated_at = date('Y-m-d H:i:s');

        if ($banner->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật trạng thái thành công',
                'banner' => $banner
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật trạng thái',
            ]);
        }
    }

    public function delete($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json([
                'status' => false,
                'message' => 'Banner không tồn tại',
            ]);
        }

        $banner->status = 0;
        $banner->updated_by = 1;
        $banner->updated_at = date('Y-m-d H:i:s');

        if ($banner->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Đã chuyển vào thùng rác',
                'banner' => $banner
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa',
            ]);
        }
    }

    public function restore($id)
    {
        $banner = Banner::find($id);
        if ($banner == null || $banner->status != 0) {
            return response()->json([
                'status' => false,
                'message' => 'Banner không tồn tại hoặc không cần phục hồi',
            ]);
        }

        $banner->status = 1; // Hoặc giá trị status khác không
        $banner->updated_by = 1;
        $banner->updated_at = date('Y-m-d H:i:s');

        if ($banner->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Phục hồi thành công',
                'banner' => $banner
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể phục hồi',
            ]);
        }
    }

    public function destroy($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json([
                'status' => false,
                'message' => 'Banner không tồn tại',
            ]);
        }

        if ($banner->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa thành công',
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa',
            ]);
        }
    }

}
