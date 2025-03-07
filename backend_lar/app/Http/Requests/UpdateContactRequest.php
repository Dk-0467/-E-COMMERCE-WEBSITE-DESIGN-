<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
{
    public function authorize()
    {
        // Xác thực người dùng có quyền cập nhật liên hệ hay không
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'replay_id' => 'nullable|integer|exists:contacts,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'status' => 'nullable|integer|in:0,1,2',
        ];
    }

    public function messages()
    {
        return [
            'email.email' => 'Email không đúng định dạng.',
            'replay_id.exists' => 'Replay ID không hợp lệ.',
            'user_id.exists' => 'User ID không hợp lệ.',
            'status.in' => 'Trạng thái không hợp lệ.',
        ];
    }
}
