<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBannersTable extends Migration
{
    public function up()
    {
        Schema::create('banner', function (Blueprint $table) {
            $table->id(); // ID chính của banner
            $table->string('name'); // Tên banner
            $table->string('link')->nullable(); // Đường dẫn (liên kết) của banner
            $table->string('image'); // Hình ảnh của banner
            $table->text('description')->nullable(); // Mô tả banner
            $table->string('position')->nullable(); // Vị trí banner
            $table->integer('sort_order')->default(0); // Thứ tự sắp xếp
            $table->integer('created_by')->nullable(); // Người tạo banner
            $table->integer('updated_by')->nullable(); // Người cập nhật banner
            $table->tinyInteger('status')->default(1); // 1: active, 0: inactive
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    public function down()
    {
        Schema::dropIfExists('banner'); // Xóa bảng banners khi rollback
    }
};
