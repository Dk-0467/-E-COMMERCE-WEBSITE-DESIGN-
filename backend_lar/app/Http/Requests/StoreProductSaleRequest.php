<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductSaleRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Thay đổi thành logic kiểm tra quyền truy cập nếu cần
    }

    public function rules()
    {
        return [
            'product_id' => 'required|exists:product,id', // Kiểm tra sản phẩm tồn tại
            'price_sale' => 'required|numeric|min:0', // Giá bán phải là số dương
            'date_begin' => 'required|date', // Ngày bắt đầu phải hợp lệ
            'date_end' => 'required|date|after:date_begin', // Ngày kết thúc phải sau ngày bắt đầu
        ];
    }

    public function messages()
    {
        return [
            'product_id.required' => 'Product ID is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'price_sale.required' => 'Price sale is required.',
            'price_sale.numeric' => 'Price sale must be a number.',
            'price_sale.min' => 'Price sale must be at least 0.',
            'date_begin.required' => 'Date begin is required.',
            'date_begin.date' => 'Date begin must be a valid date.',
            'date_end.required' => 'Date end is required.',
            'date_end.date' => 'Date end must be a valid date.',
            'date_end.after' => 'Date end must be after date begin.',
        ];
    }
}
