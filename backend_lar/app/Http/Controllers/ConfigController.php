<?php

namespace App\Http\Controllers;
use App\Models\Config;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    public function index()
    {
        $config = Config::where('status','!=',0)
            ->select("id","site_name","email","phones","address","hotline","zalo","facebook","status")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'config'=>$config
        ];
        return response()->json($result);
    }


    public function update(Request $request, $id)
    {
        try {
            $config = Config::find($id);
            
            if (!$config) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy cấu hình'
                ], 404);
            }

            $config->site_name = $request->site_name;
            $config->email = $request->email;
            $config->address = $request->address;
            $config->hotline = $request->hotline;
            $config->phones = $request->phones;
            $config->zalo = $request->zalo;
            $config->facebook = $request->facebook;
            $config->status = $request->status;

            // // Nếu có file đính kèm (ví dụ logo), xử lý upload
            // if ($request->hasFile('logo')) {
            //     $exten = $request->logo->extension();
            //     $logoName = date('YmdHis') . "." . $exten;
            //     $request->logo->move(public_path('images/config'), $logoName);
            //     $config->logo = $logoName;
            // }

            if ($config->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật cấu hình thành công',
                    'config' => $config
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật cấu hình'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function show($id)
    {
        $config = Config::find($id);
        if($config==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'config'=>$config
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'config'=>$config
            ];
        }
        return response()->json($result);
    }
    
}
