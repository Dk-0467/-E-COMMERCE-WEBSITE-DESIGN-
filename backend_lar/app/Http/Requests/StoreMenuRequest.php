<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
{
    /**
     * Xác định người dùng có quyền thực hiện request này hay không.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Đảm bảo request này được phép thực hiện
    }

    /**
     * Định nghĩa các luật kiểm tra (validation) cho request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255', // Tên menu là bắt buộc và có độ dài tối đa 255 ký tự
            'type' => 'required|string|in:internal,external', // Loại menu chỉ được phép là 'internal' hoặc 'external'
            'link' => 'nullable|string', // Link là không bắt buộc và phải là một chuỗi
            'status' => 'required|boolean', // Trạng thái là bắt buộc và chỉ nhận giá trị true hoặc false
        ];
    }

    /**
     * Các thông báo lỗi tùy chỉnh cho các luật kiểm tra.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'Tên menu là bắt buộc.',
            'name.max' => 'Tên menu không được dài quá 255 ký tự.',
            'type.required' => 'Loại menu là bắt buộc.',
            'type.in' => 'Loại menu chỉ có thể là "internal" hoặc "external".',
            'link.string' => 'Link phải là một chuỗi hợp lệ.', // Thông báo lỗi nếu không phải chuỗi
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.boolean' => 'Trạng thái chỉ có thể là true hoặc false.', // Cập nhật thông báo trạng thái
        ];
    }
}
