<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Hoặc bạn có thể thêm logic xác thực quyền
    }

    public function rules()
    {
        return [
            'product_id' => 'required|exists:product,id', // Kiểm tra xem sản phẩm có tồn tại không
            'price_root' => 'required|numeric|min:0', // Kiểm tra giá phải là số và lớn hơn hoặc bằng 0
            'qty' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'product_id.required' => 'Product ID is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'price_root.required' => 'Price is required.',
            'price_root.numeric' => 'Price must be a number.',
            'price_root.min' => 'Price must be at least 0.',
        ];
    }
}
