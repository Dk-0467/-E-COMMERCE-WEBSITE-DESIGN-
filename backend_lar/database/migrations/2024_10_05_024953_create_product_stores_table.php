<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductStoresTable extends Migration
{
    public function up()
    {
        Schema::create('product_store', function (Blueprint $table) {
            $table->id(); // ID chính của sản phẩm trong kho
            $table->foreignId('product_id')->constrained('product')->onDelete('cascade'); // Khóa ngoại với bảng products
            $table->decimal('price_root', 10, 2); // Giá gốc của sản phẩm
            $table->integer('qty'); // Số lượng sản phẩm trong kho
            $table->timestamps(); // Thời gian tạo và cập nhật
            $table->integer('created_by')->nullable(); // Người tạo bản ghi
            $table->integer('updated_by')->nullable(); // Người cập nhật bản ghi
            $table->tinyInteger('status')->default(1); // Trạng thái của sản phẩm (1: active, 0: inactive)
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_store'); // Xóa bảng product_stores khi rollback
    }
}
