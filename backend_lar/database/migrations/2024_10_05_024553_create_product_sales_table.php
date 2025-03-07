<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductSalesTable extends Migration
{
    public function up()
    {
        Schema::create('product_sale', function (Blueprint $table) {
            $table->id(); // ID chính của sản phẩm giảm giá
            $table->foreignId('product_id')->constrained('product')->onDelete('cascade'); // Khóa ngoại với bảng products
            $table->decimal('price_sale', 10, 2); // Giá bán của sản phẩm
            $table->date('date_begin'); // Ngày bắt đầu chương trình giảm giá
            $table->date('date_end'); // Ngày kết thúc chương trình giảm giá
            $table->timestamps(); // Thời gian tạo và cập nhật
            $table->integer('created_by')->nullable(); // Người tạo bản ghi
            $table->integer('updated_by')->nullable(); // Người cập nhật bản ghi
            $table->tinyInteger('status')->default(1); // Trạng thái của sản phẩm giảm giá (1: active, 0: inactive)
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_sale'); // Xóa bảng product_sales khi rollback
    }
}
