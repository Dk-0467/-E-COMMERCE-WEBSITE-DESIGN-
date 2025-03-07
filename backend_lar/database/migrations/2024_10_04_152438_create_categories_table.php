<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('category', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedBigInteger('parent_id')->nullable(); // Cột parent_id để tạo cây phân cấp danh mục
            $table->integer('sort_order')->default(0); // Thứ tự sắp xếp
            $table->string('image')->nullable(); // Ảnh đại diện cho danh mục
            $table->text('description')->nullable(); // Mô tả danh mục
            $table->integer('created_by')->nullable(); // ID người tạo
            $table->integer('updated_by')->nullable(); // ID người cập nhật
            $table->tinyInteger('status')->default(1); // 1: active, 0: inactive
            $table->timestamps(); // created_at và updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('category');
    }
}

