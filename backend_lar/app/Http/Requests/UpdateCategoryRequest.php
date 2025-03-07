<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
{
        return true;//true
}
//Khai báo ràng buộc
 public function rules(): array
{
        return [
            'name' => 'required',
'image' => [
                'required',
                'image',
                'mimes:jpeg,png,webp',
                'mimetypes:image/jpeg,image,webp/png',
            ],
        ];
        
}
//Khai báo thông báo
public function messages()
{
        return [
            'name.required' => 'Tên không được để trống',
            'image.mimes' => 'Hình ảnh phải có định dạng jpeg, png hoặc webp',
        ];

}
//Xuất thông báo nếu bị lỗi
public function failedValidation(Validator $validator)
{
        throw new HttpResponseException(response()->json([
            'status'   => false,
            'message'   => 'Validation errors',
            'banners'      => $validator->errors()
        ]));
}

}
