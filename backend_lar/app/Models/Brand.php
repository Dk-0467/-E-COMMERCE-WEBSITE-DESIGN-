<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory;
    protected $table = 'brand';
    protected $fillable = ['name', 'slug', 'status'];

    // Quan hệ với bảng Product
    public function products()
    {
        return $this->hasMany(Product::class, 'brand_id');
    }
}
