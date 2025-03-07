<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductTable extends Migration
{
    public function up()
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id(); // ID chính của sản phẩm
            $table->foreignId('category_id')->constrained('category')->onDelete('cascade'); // Khóa ngoại với bảng cdtt_category
            $table->foreignId('brand_id')->constrained('brand')->onDelete('cascade'); // Khóa ngoại với bảng cdtt_brand
            $table->string('name'); // Tên sản phẩm
            $table->string('slug')->unique(); // Slug của sản phẩm (để sử dụng trong URL)
            $table->text('content'); // Nội dung chi tiết của sản phẩm
            $table->decimal('price', 10, 2); // Giá của sản phẩm
            $table->text('description'); // Mô tả sản phẩm
            $table->integer('created_by')->nullable(); // ID của người tạo sản phẩm
            $table->integer('updated_by')->nullable(); // ID của người cập nhật sản phẩm
            $table->tinyInteger('status')->default(1); // Trạng thái sản phẩm (1: active, 0: inactive)
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    public function down()
    {
        Schema::dropIfExists('product'); // Xóa bảng sản phẩm
    }
}
