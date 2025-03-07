<?php

namespace App\Models;

use App\Models\Brand;
use App\Models\Category;
use App\Models\OrderDetail;
use App\Models\ProductSale;
use App\Models\ProductImage;
use App\Models\ProductStore;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    protected $table = 'product';

    protected $fillable = [
        'category_id', 'brand_id', 'name', 'slug', 'content', 'price', 'description', 'status', 'created_by'
    ];
    
    // Quan hệ với bảng Category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Quan hệ với bảng Brand
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    // Quan hệ với ProductImage
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
    // Mối quan hệ với bảng ProductSale (1 sản phẩm có nhiều khuyến mãi)
    public function product_sale()
    {
        return $this->hasMany(ProductSale::class, 'product_id');
    }

    // Mối quan hệ với bảng ProductStore (1 sản phẩm có thể có ở nhiều kho)
    public function product_store()
    {
        return $this->hasMany(ProductStore::class, 'product_id');
    }

    public function orderdetail()
    {
        return $this->hasMany(OrderDetail::class, 'product_id');
    }

    
}
