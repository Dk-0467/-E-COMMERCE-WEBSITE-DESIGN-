<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSale extends Model
{
    use HasFactory;
    protected $table = 'product_sale';
    
    protected $fillable = [
        'product_id',
        'price_sale',
        'date_begin',
        'date_end',
        'status',
        'created_by',
        'created_at',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
