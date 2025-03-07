<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::where('status', '!=', 0)
            ->orderBy('id', 'ASC')
            ->select('id', 'name', 'email', 'phone', 'title', 'content', 'replay_id', 'user_id', 'status')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'contacts' => $contacts
        ]);
    }

    // Hiển thị danh sách liên hệ trong thùng rác
    public function trash()
    {
        $contacts = Contact::where('status', '=', 0)
            ->orderBy('id', 'ASC')
            ->select('id', 'name', 'email', 'phone', 'title', 'content', 'replay_id', 'user_id', 'status')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'contacts' => $contacts
        ]);
    }

    // Hiển thị chi tiết liên hệ
    public function show($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'contact' => null
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'contact' => $contact
        ]);
    }
    
    public function store(Request $request)
    {
        // Kiểm tra và validate dữ liệu
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        try {
            // Tạo mới một bản ghi liên hệ
            $contact = new Contact();
            $contact->name = $request->input('name');
            $contact->email = $request->input('email');
            $contact->phone = $request->input('phone');
            $contact->title = $request->input('title');
            $contact->content = $request->input('content');
            $contact->status = 1; 

            // Lưu vào cơ sở dữ liệu
            $contact->save();

            return response()->json([
                'status' => true,
                'message' => 'Gửi liên hệ thành công',
                'contact' => $contact
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    
    // Thay đổi trạng thái liên hệ
    public function status($id)
    {
        try {
            $contact = Contact::find($id);

            if (!$contact) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy liên hệ'
                ], 404);
            }

            $contact->status = $contact->status == 1 ? 2 : 1;
            $contact->save();

            return response()->json([
                'status' => true,
                'message' => 'Thay đổi trạng thái thành công',
                'contact' => $contact
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Xóa liên hệ (chuyển vào thùng rác)
    public function delete($id)
    {
        try {
            $contact = Contact::find($id);

            if (!$contact) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy liên hệ'
                ], 404);
            }

            $contact->status = 0;
            $contact->save();

            return response()->json([
                'status' => true,
                'message' => 'Xóa liên hệ thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Phục hồi liên hệ đã xóa
    public function restore($id)
    {
        try {
            $contact = Contact::find($id);

            // Kiểm tra xem liên hệ có tồn tại và đã bị xóa chưa (trạng thái = 0)
            if (!$contact || $contact->status != 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Liên hệ không tồn tại hoặc không cần phục hồi',
                ]);
            }

            // Khôi phục liên hệ bằng cách thay đổi trạng thái
            $contact->status = 1; // Đặt lại trạng thái thành 1 (hoặc giá trị khác theo yêu cầu của bạn)

            if ($contact->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Khôi phục thành công',
                    'contact' => $contact
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Không thể phục hồi liên hệ',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Xóa vĩnh viễn liên hệ
    public function destroy($id)
    {
        try {
            $contact = Contact::withTrashed()->find($id);

            if (!$contact) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy liên hệ'
                ], 404);
            }

            $contact->forceDelete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa vĩnh viễn thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Bổ sung chức năng reply vào ContactController
    public function reply(Request $request, $id)
    {
        try {
            // Tìm kiếm liên hệ theo ID
            $contact = Contact::find($id);
            if (!$contact) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy liên hệ'
                ], 404);
            }
    
            // Lưu thông tin trả lời vào liên hệ
            $contact->replay_id = $request->input('replay_id');
            $contact->content = $request->input('content');
            $contact->status = 3; // Trạng thái đã trả lời
            $contact->updated_by = auth()->id();
            $contact->save();
    
            return response()->json([
                'status' => true,
                'message' => 'Trả lời liên hệ thành công',
                'contact' => $contact
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
    
}
