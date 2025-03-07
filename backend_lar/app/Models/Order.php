<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory;

    protected $table = 'order'; // Đặt tên bảng nếu khác tên mặc định

    protected $fillable = [
        'user_id', 'name', 'email', 'phone', 'address', 'updated_by', 'status'
    ];

    // Định nghĩa mối quan hệ với User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Liên kết với user_id
    }
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
}
