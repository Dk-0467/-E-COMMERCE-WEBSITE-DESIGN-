<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
{
    public function up()
    {
        Schema::create('contact', function (Blueprint $table) {
            $table->id(); // ID chính của contact
            $table->string('name'); // Tên người liên hệ
            $table->string('email')->nullable(); // Email liên hệ
            $table->string('phone')->nullable(); // Số điện thoại liên hệ
            $table->string('title'); // Tiêu đề liên hệ
            $table->text('content'); // Nội dung liên hệ
            $table->unsignedBigInteger('replay_id')->nullable(); // ID của phản hồi liên hệ (nếu có)
            $table->unsignedBigInteger('user_id')->nullable(); // ID của người dùng gửi liên hệ (nếu có)
            $table->unsignedBigInteger('updated_by')->nullable(); // ID của người cập nhật
            $table->tinyInteger('status')->default(1); // Trạng thái 1: active, 0: inactive
            $table->timestamps(); // Thời gian tạo và cập nhật

            // Định nghĩa khóa ngoại cho các cột user_id, replay_id và updated_by
            $table->foreign('user_id')->references('id')->on('user')->onDelete('set null');
            $table->foreign('replay_id')->references('id')->on('contact')->onDelete('set null'); // Chỉnh sửa từ 'contacts' thành 'contact'
            $table->foreign('updated_by')->references('id')->on('user')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('contact', function (Blueprint $table) {
            // Xóa các ràng buộc khóa ngoại trước khi xóa bảng
            $table->dropForeign(['user_id']);
            $table->dropForeign(['replay_id']);
            $table->dropForeign(['updated_by']);
        });

        Schema::dropIfExists('contact'); // Xóa bảng contacts khi rollback
    }
}
