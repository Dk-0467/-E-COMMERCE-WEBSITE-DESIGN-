<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConfigsTable extends Migration
{
    public function up()
    {
        Schema::create('config', function (Blueprint $table) {
            $table->id(); // ID chính
            $table->string('site_name'); // Tên trang web
            $table->string('email')->nullable(); // Email
            $table->string('phones')->nullable(); // Các số điện thoại
            $table->string('address')->nullable(); // Địa chỉ
            $table->string('hotline')->nullable(); // Số hotline
            $table->string('zalo')->nullable(); // Zalo liên hệ
            $table->string('facebook')->nullable(); // Facebook liên hệ
            $table->tinyInteger('status')->default(1); // Trạng thái 1: active, 0: inactive
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    public function down()
    {
        Schema::dropIfExists('config'); // Xóa bảng khi rollback
    }
};

