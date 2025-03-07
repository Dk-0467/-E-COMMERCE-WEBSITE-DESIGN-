<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    public function up()  
    {
        Schema::create('post', function (Blueprint $table) {
            $table->id(); // ID chính của bài viết
            $table->string('title'); // Tiêu đề bài viết
            $table->foreignId('topic_id')->nullable()->constrained('topic')->onDelete('cascade'); // Khóa ngoại với bảng topics
            $table->text('content'); // Nội dung bài viết
            $table->text('description')->nullable(); // Mô tả ngắn về bài viết (có thể để trống)
            $table->string('thumbnail')->nullable(); // Hình ảnh đại diện cho bài viết (có thể để trống)
            $table->string('type')->nullable(); // Loại bài viết (có thể để trống)
            $table->integer('created_by')->nullable(); // Người tạo bài viết
            $table->integer('updated_by')->nullable(); // Người cập nhật bài viết
            $table->tinyInteger('status')->default(1); // Trạng thái bài viết (1: active, 0: inactive)
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    public function down()
    {
        Schema::dropIfExists('post'); // Xóa bảng post khi rollback
    }
}
