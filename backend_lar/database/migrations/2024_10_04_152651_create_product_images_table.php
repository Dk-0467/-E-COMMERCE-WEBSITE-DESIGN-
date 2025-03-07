<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductImagesTable extends Migration
{
    public function up()
    {
        Schema::create('product_image', function (Blueprint $table) {
            $table->id(); // Khóa chính
            $table->unsignedBigInteger('product_id'); // Khóa ngoại với bảng products
            $table->string('thumbnail'); // Đường dẫn tới ảnh đại diện
            $table->timestamps(); // created_at và updated_at

            // Thêm ràng buộc khóa ngoại
            $table->foreign('product_id')->references('id')->on('product')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_image'); // Xóa bảng khi rollback
    }
}
