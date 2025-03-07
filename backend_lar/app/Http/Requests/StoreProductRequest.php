<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Cho phép tất cả người dùng
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:category,id',
            'brand_id' => 'required|exists:brand,id',
            'name' => 'required|string|max:255',
            'content' => 'nullable|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'status' => 'required|in:0,1',
            'thumbnail' => 'required',
            'thumbnail.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'category_id.required' => 'Danh mục không được để trống',
            'category_id.exists' => 'Danh mục không tồn tại',
            'brand_id.required' => 'Thương hiệu không được để trống',
            'brand_id.exists' => 'Thương hiệu không tồn tại',
            'name.required' => 'Tên sản phẩm không được để trống',
            'price.required' => 'Giá sản phẩm không được để trống',
            'price.numeric' => 'Giá phải là một số',
            'status.required' => 'Trạng thái sản phẩm không được để trống',
            'thumbnail.required' => 'Hình ảnh sản phẩm không được để trống',
            'thumbnail.*.image' => 'Tệp tải lên phải là hình ảnh',
            'thumbnail.*.mimes' => 'Hình ảnh phải có định dạng: jpeg, png, jpg',
            'thumbnail.*.max' => 'Kích thước hình ảnh tối đa là 2MB',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
