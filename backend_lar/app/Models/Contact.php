<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;  // Thêm dòng này

class Contact extends Model
{
    use HasFactory;  // Thêm SoftDeletes vào đây

    protected $table = 'contact';
    protected $fillable = ['name', 'email', 'phone', 'title', 'content', 'replay_id', 'user_id', 'status'];


    // Quan hệ với User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Các phương thức và quan hệ khác nếu cần
}
