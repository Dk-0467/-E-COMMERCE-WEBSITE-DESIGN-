<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::where('status', '!=', 0)
            ->orderBy('id', 'ASC')
            ->select('id', 'name', 'slug', 'sort_order', 'description', 'created_by', 'updated_by', 'status')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'topics' => $topics
        ]);
    }

    public function trash()
    {
        $topics = Topic::where('status', '=', 0)
            ->orderBy('id', 'ASC')
            ->select('id', 'name', 'slug', 'sort_order', 'description', 'created_by', 'updated_by', 'status')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'topics' => $topics
        ]);
    }

    public function show($id)
    {
        $topic = Topic::find($id);

        if (!$topic) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'topic' => null
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'topic' => $topic
        ]);
    }

    public function store(Request $request)
    {
        try {
            $topic = new Topic();
            $topic->name = $request->name;
            $topic->slug = $request->slug;
            $topic->sort_order = $request->sort_order;
            $topic->description = $request->description;
            $topic->created_by = 1;
            $topic->created_at = now();
            $topic->status = $request->status;

            if ($topic->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Thêm chủ đề thành công',
                    'topic' => $topic
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm chủ đề'
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $topic = Topic::find($id);

            if (!$topic) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy chủ đề'
                ], 404);
            }

            $topic->name = $request->name;
            $topic->slug = $request->slug;
            $topic->sort_order = $request->sort_order;
            $topic->description = $request->description;
            $topic->updated_by = $request->updated_by;
            $topic->status = $request->status;

            if ($topic->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật chủ đề thành công',
                    'topic' => $topic
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật chủ đề'
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
    public function status($id)
    {
        $topic = Topic::find($id);

        if (!$topic) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề'
            ], 404);
        }

        $topic->status = $topic->status == 1 ? 2 : 1;  // Toggle trạng thái
        $topic->save();

        return response()->json([
            'status' => true,
            'message' => 'Thay đổi trạng thái thành công',
            'topic' => $topic
        ]);
    }

    // Xóa chủ đề (chuyển vào thùng rác)
    public function delete($id)
    {
        $topic = Topic::find($id);

        if (!$topic) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề'
            ], 404);
        }

        $topic->status = 0;  // Chuyển trạng thái về 0 (đã xóa)
        $topic->save();

        return response()->json([
            'status' => true,
            'message' => 'Xóa chủ đề thành công',
            'topic' => $topic
        ]);
    }

    // Khôi phục chủ đề từ thùng rác
    public function restore($id)
    {
        $topic = Topic::find($id);

        if (!$topic || $topic->status != 0) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề hoặc chủ đề chưa bị xóa'
            ], 404);
        }

        $topic->status = 1;  // Khôi phục trạng thái
        $topic->save();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục chủ đề thành công',
            'topic' => $topic
        ]);
    }

    // Xóa hoàn toàn chủ đề khỏi cơ sở dữ liệu
    public function destroy($id)
    {
        $topic = Topic::find($id);

        if (!$topic) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề'
            ], 404);
        }

        if ($topic->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa chủ đề vĩnh viễn thành công'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa chủ đề'
        ], 500);
    }

}
