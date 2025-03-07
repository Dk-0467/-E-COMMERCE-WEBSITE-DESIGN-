<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenusTable extends Migration
{
    public function up()
    {
        Schema::create('menu', function (Blueprint $table) {
            $table->id(); // ID chính của menu
            $table->string('name'); // Tên menu
            $table->string('link'); // Đường dẫn liên kết của menu
            $table->string('type')->nullable(); // Loại menu (có thể là trang, danh mục, sản phẩm, v.v.)
            $table->integer('table_id')->nullable(); // ID của bảng liên kết (nếu có)
            $table->integer('created_by')->nullable(); // Người tạo menu
            $table->integer('updated_by')->nullable(); // Người cập nhật menu
            $table->tinyInteger('status')->default(1); // Trạng thái 1: active, 0: inactive
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    public function down()
    {
        Schema::dropIfExists('menu'); // Xóa bảng menus khi rollback
    }
};