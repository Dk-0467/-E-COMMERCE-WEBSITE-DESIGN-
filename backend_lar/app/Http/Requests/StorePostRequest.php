<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Có thể thêm logic kiểm tra quyền người dùng tại đây.
        // Mặc định là true cho phép tất cả người dùng gửi yêu cầu.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'topic_id' => 'required|exists:topic,id',
            'content' => 'required|string',
            'description' => 'nullable|string',
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png,bmp,gif,svg,webp|max:2048',
            'type' => 'required|string',
            'status' => 'required|boolean',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề là bắt buộc.',
            'title.string' => 'Tiêu đề phải là chuỗi ký tự.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
            'topic_id.required' => 'Chủ đề là bắt buộc.',
            'topic_id.exists' => 'Chủ đề không hợp lệ.',
            'content.required' => 'Nội dung là bắt buộc.',
            'content.string' => 'Nội dung phải là chuỗi ký tự.',
            'description.string' => 'Mô tả phải là chuỗi ký tự.',
            'thumbnail.required' => 'Ảnh đại diện là bắt buộc.',
            'thumbnail.image' => 'Ảnh đại diện phải là tệp hình ảnh.',
            'thumbnail.mimes' => 'Ảnh đại diện phải có định dạng: jpg, jpeg, png, bmp, gif, svg, hoặc webp.',
            'thumbnail.max' => 'Kích thước ảnh đại diện không được vượt quá 2MB.',
            'type.required' => 'Loại bài viết là bắt buộc.',
            'type.string' => 'Loại bài viết phải là chuỗi ký tự.',
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.boolean' => 'Trạng thái phải là true hoặc false.',
        ];
    }
}
