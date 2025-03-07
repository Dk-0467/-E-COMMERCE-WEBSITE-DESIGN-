<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductStore extends Model
{
    use HasFactory;
    protected $table = 'product_store';
    
    protected $fillable = [
        'product_id', 'price_root', 'qty', 'created_by', 'status'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
