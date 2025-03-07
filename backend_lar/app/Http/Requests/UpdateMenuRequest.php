<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có được phép thực hiện yêu cầu này hay không.
     *
     * @return bool
     */
    public function authorize()
    {
        // Cho phép thực hiện request
        return true;
    }

    /**
     * Lấy các quy tắc xác thực sẽ áp dụng cho yêu cầu.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'type' => 'required|in:header,footer', // Kiểm tra loại menu (ví dụ: header, footer)
            'link' => 'nullable|string', // Link không bắt buộc và phải là một chuỗi nếu có
            'status' => 'required|boolean', // Trạng thái phải là true/false
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi cho từng trường.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'Tên menu là bắt buộc.',
            'name.string' => 'Tên menu phải là chuỗi ký tự.',
            'name.max' => 'Tên menu không được vượt quá 255 ký tự.',
            
            'type.required' => 'Loại menu là bắt buộc.',
            'type.in' => 'Loại menu không hợp lệ.',

            'link.string' => 'Link phải là một chuỗi hợp lệ.', // Thông báo lỗi nếu không phải chuỗi
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.boolean' => 'Trạng thái phải là true hoặc false.',
        ];
    }
}
