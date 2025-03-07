<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('order', function (Blueprint $table) {
            $table->id(); // ID chính của đơn hàng
            $table->foreignId('user_id')->nullable()->constrained('user', 'id')->onDelete('cascade'); // Khóa ngoại với bảng users, chỉ định cột id
            $table->string('name'); // Tên người đặt hàng
            $table->string('email')->nullable(); // Email của người đặt hàng
            $table->string('phone')->nullable(); // Số điện thoại của người đặt hàng
            $table->string('address')->nullable(); // Địa chỉ người đặt hàng
            $table->integer('updated_by')->nullable(); // Người cập nhật đơn hàng
            $table->tinyInteger('status')->default(1); // Trạng thái đơn hàng (1: active, 0: inactive)
            $table->timestamps(); // Thời gian tạo và cập nhật đơn hàng
        });
    }

    public function down()
    {
        Schema::dropIfExists('order'); // Xóa bảng orders khi rollback
    }
}
