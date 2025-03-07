<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;
    protected $table = 'orderdetail';
    protected $fillable = [
        'order_id',   // Mã đơn hàng
        'product_id', // Mã sản phẩm
        'qty',        // Số lượng
        'price',      // Giá
        'discount',   // Giảm giá
        'amount',     // Thành tiền
        'created_at', // Ngày tạo
        'updated_at', // Ngày cập nhật
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
