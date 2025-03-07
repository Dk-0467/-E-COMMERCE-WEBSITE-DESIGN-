<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBrandTable extends Migration
{
    public function up()
    {
        Schema::create('brand', function (Blueprint $table) {
            $table->id(); // Khóa chính
            $table->string('name'); // Tên thương hiệu
            $table->string('slug')->unique(); // Đường dẫn duy nhất
            $table->string('image')->nullable(); // Ảnh của thương hiệu
            $table->text('description')->nullable(); // Mô tả thương hiệu
            $table->integer('sort_order')->default(0); // Thứ tự sắp xếp
            $table->integer('created_by')->nullable(); // Người tạo
            $table->integer('updated_by')->nullable(); // Người cập nhật
            $table->tinyInteger('status')->default(1); // 1: active, 0: inactive
            $table->timestamps(); // created_at và updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('brand'); // Xóa bảng cdtt_brand
    }
}
