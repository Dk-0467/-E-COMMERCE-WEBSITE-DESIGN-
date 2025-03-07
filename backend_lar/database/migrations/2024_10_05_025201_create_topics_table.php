<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTopicsTable extends Migration
{
    public function up()
    {
        Schema::create('topic', function (Blueprint $table) {
            $table->id(); // ID chính của chủ đề
            $table->string('name'); // Tên của chủ đề
            $table->string('slug')->unique(); // Slug của chủ đề, đảm bảo duy nhất
            $table->integer('sort_order')->default(0); // Thứ tự sắp xếp của chủ đề
            $table->text('description')->nullable(); // Mô tả của chủ đề (có thể để trống)
            $table->integer('created_by')->nullable(); // Người tạo chủ đề
            $table->integer('updated_by')->nullable(); // Người cập nhật chủ đề
            $table->tinyInteger('status')->default(1); // Trạng thái của chủ đề (1: active, 0: inactive)
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    public function down()
    {
        Schema::dropIfExists('topic'); // Xóa bảng topics khi rollback
    }
};