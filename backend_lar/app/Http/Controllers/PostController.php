<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Lấy danh sách bài viết và nạp trước thông tin chủ đề
    public function index()
    {
        $posts = Post::with('topic')
            ->where('status', '!=', 0)
            ->orderBy('created_at', 'DESC')
            ->select('id', 'title', 'topic_id', 'content', 'description', 'thumbnail', 'type', 'created_by', 'updated_by', 'status', 'created_at', 'updated_at')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'posts' => $posts,
        ]);
    }

    // Lấy danh sách bài viết đã xóa và nạp trước thông tin chủ đề
    public function trash()
    {
        $posts = Post::with('topic')
            ->where('status', 0)
            ->orderBy('created_at', 'DESC')
            ->select('id', 'title', 'topic_id', 'content', 'description', 'thumbnail', 'type', 'created_by', 'updated_by', 'status', 'created_at', 'updated_at')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thùng rác thành công',
            'posts' => $posts,
        ]);
    }
    
    public function show($id)
    {
        $post = Post::with('topic')
            ->select('id', 'title', 'topic_id', 'content', 'description', 'thumbnail', 'type', 'created_by', 'updated_by', 'status', 'created_at', 'updated_at')
            ->find($id);

        if (!$post) {
            return response()->json([
                'status' => false,
                'message' => 'Bài viết không tồn tại',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'post' => $post,
        ]);
    }

    public function store(StorePostRequest $request)
    {
        try {
            $post = Post::create([
                'title' => $request->title,
                'topic_id' => $request->topic_id,
                'content' => $request->content,
                'description' => $request->description,
                'type' => $request->type,
                'status' => $request->status,
                'created_by' => 1, // giá trị giả định
                'created_at' => now(),
            ]);

            if ($request->hasFile('thumbnail')) {
                $exten = $request->thumbnail->extension();
                $imageName = date('YmdHis') . "." . $exten;
                $request->thumbnail->move(public_path('images/post'), $imageName);
                $post->thumbnail = $imageName;
                $post->save(); // Lưu lại thumbnail vào cơ sở dữ liệu
            } else {
                return response()->json(['status' => false, 'message' => 'Không có file ảnh nào được tải lên'], 400);
            }

            return response()->json(['status' => true, 'message' => 'Thêm bài viết thành công', 'post' => $post]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    // Cập nhật bài viết
    public function update(Request $request, $id)
    {
        try {
            // Lấy bài viết dựa trên ID
            $post = Post::find($id);
            
            // Kiểm tra xem bài viết có tồn tại không
            if (!$post) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bài viết không tồn tại',
                    'post' => null
                ], 404); // 404: Not Found
            }
    
            // Cập nhật thông tin bài viết từ request
            $post->title = $request->input('title', $post->title);
            $post->content = $request->input('content', $post->content);
            $post->description = $request->input('description', $post->description);
            $post->type = $request->input('type', $post->type);
            $post->topic_id = $request->input('topic_id', $post->topic_id);
            $post->status = $request->input('status', $post->status);
            $post->updated_at = now(); // Cập nhật thời gian chỉnh sửa
    
            // Kiểm tra nếu có file hình ảnh được tải lên
            if ($request->hasFile('thumbnail')) {
                // Xóa hình ảnh cũ nếu có
                if ($post->thumbnail) {
                    $oldImagePath = public_path('images/post/') . $post->thumbnail;
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
    
                // Lưu hình ảnh mới
                $exten = $request->thumbnail->extension();
                $imageName = date('YmdHis') . "." . $exten;
                $request->thumbnail->move(public_path('images/post'), $imageName);
                $post->thumbnail = $imageName; // Lưu tên file vào cột `thumbnail`
            }
    
            // Lưu các thay đổi
            if ($post->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật bài viết thành công',
                    'post' => $post
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể cập nhật bài viết',
                    'post' => null
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
                'post' => null
            ], 500);
        }
    }
    
    

    // Thay đổi trạng thái bài viết
    public function status($id)
    {
        try {
            $post = Post::findOrFail($id);
            $post->status = $post->status == 1 ? 2 : 1;
            $post->updated_at = now();
            $post->save();

            return response()->json(['status' => true, 'message' => 'Cập nhật trạng thái thành công', 'post' => $post]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    // Xóa bài viết (chuyển vào thùng rác)
    public function delete($id)
    {
        try {
            $post = Post::findOrFail($id);
            $post->status = 0; // Xóa bằng cách thay đổi trạng thái
            $post->updated_at = now();
            $post->save();

            return response()->json(['status' => true, 'message' => 'Đã chuyển bài viết vào thùng rác', 'post' => $post]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    // Phục hồi bài viết đã xóa
    public function restore($id)
    {
        try {
            $post = Post::findOrFail($id);

            if ($post->status != 0) {
                return response()->json(['status' => false, 'message' => 'Bài viết không cần phục hồi'], 400);
            }

            $post->status = 1;
            $post->updated_at = now();
            $post->save();

            return response()->json(['status' => true, 'message' => 'Phục hồi bài viết thành công', 'post' => $post]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    // Xóa vĩnh viễn bài viết
    public function destroy($id)
    {
        try {
            $post = Post::findOrFail($id);

            if ($post->thumbnail) {
                $oldImagePath = public_path('images/post/') . $post->thumbnail;
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $post->delete();

            return response()->json(['status' => true, 'message' => 'Xóa bài viết thành công']);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    // UC8: Lấy bài viết mới nhất với số lượng giới hạn
    public function post_new($limit)
    {
        $posts = Post::where('status', '=', 1) // Chỉ lấy bài viết có trạng thái kích hoạt (status = 1)
            ->orderBy('created_at', 'DESC') // Sắp xếp theo ngày tạo mới nhất
            ->limit($limit) // Giới hạn số lượng bài viết trả về
            ->select('id', 'title', 'description', 'thumbnail', 'created_at')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải bài viết mới thành công',
            'posts' => $posts,
        ]);
    }

    // UC9: Lấy trang đơn theo slug
    public function post_page($id)
    {
        $post = Post::where('slug', $id)
            ->where('status', '=', 1) // Chỉ lấy bài viết có trạng thái kích hoạt
            ->select('id', 'title', 'content', 'description', 'thumbnail', 'created_at', 'updated_at')
            ->first();

        if (!$post) {
            return response()->json([
                'status' => false,
                'message' => 'Bài viết không tồn tại',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải bài viết thành công',
            'post' => $post,
        ]);
    }

}
