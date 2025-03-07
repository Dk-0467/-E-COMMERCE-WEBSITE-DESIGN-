<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('orderdetail', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id'); // Đảm bảo kiểu dữ liệu giống với cột 'id' trong bảng 'cdtt_order'
            $table->unsignedBigInteger('product_id');
            $table->integer('qty');
            $table->decimal('price', 8, 2);
            $table->decimal('discount', 8, 2)->nullable();
            $table->decimal('amount', 8, 2);
            $table->timestamps();
        
            // Đảm bảo tạo foreign key constraint
            $table->foreign('order_id')->references('id')->on('order')->onDelete('cascade'); // Tạo foreign key với bảng 'cdtt_order'
        });
    }

    public function down()
    {
        Schema::dropIfExists('orderdetail'); // Xóa bảng orderdetails khi rollback
    }
}
