<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize()
    {
        // Xác thực người dùng có quyền tạo liên hệ hay không
        return true;  // Điều này có nghĩa là tất cả người dùng đều có thể thực hiện
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'replay_id' => 'nullable|integer|exists:contacts,id',  // replay_id có thể null, phải là một id tồn tại trong bảng contacts nếu có
            'user_id' => 'required|integer|exists:users,id',
            'status' => 'required|integer|in:0,1,2',  // 0: Xóa, 1: Hoạt động, 2: Đã trả lời
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không đúng định dạng.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'title.required' => 'Tiêu đề là bắt buộc.',
            'content.required' => 'Nội dung là bắt buộc.',
            'replay_id.exists' => 'Replay ID không hợp lệ.',
            'user_id.required' => 'User ID là bắt buộc.',
            'user_id.exists' => 'User ID không hợp lệ.',
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái không hợp lệ.',
        ];
    }
}
