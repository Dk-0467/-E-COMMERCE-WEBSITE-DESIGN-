<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id(); // ID chính của người dùng
            $table->string('name'); // Tên của người dùng
            $table->string('fullname')->nullable(); // Họ và tên đầy đủ
            $table->string('gender')->nullable(); // Giới tính
            $table->string('thumbnail')->nullable(); // Hình ảnh đại diện
            $table->string('email')->unique(); // Email của người dùng
            $table->string('phone')->nullable(); // Số điện thoại
            $table->text('address')->nullable(); // Địa chỉ
            $table->string('roles')->default('user'); // Vai trò của người dùng
            $table->timestamp('email_verified_at')->nullable(); // Thời gian xác minh email
            $table->string('password'); // Mật khẩu
            $table->rememberToken(); // Token để ghi nhớ đăng nhập
            $table->integer('created_by')->nullable(); // Người tạo
            $table->integer('updated_by')->nullable(); // Người cập nhật
            $table->tinyInteger('status')->default(1); // Trạng thái (1: active, 0: inactive)
            $table->timestamps(); // Thời gian tạo và cập nhật
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // Email của người dùng
            $table->string('token'); // Token đặt lại mật khẩu
            $table->timestamp('created_at')->nullable(); // Thời gian tạo token
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // ID phiên làm việc
            $table->foreignId('user_id')->nullable()->index(); // Khóa ngoại với bảng users
            $table->string('ip_address', 45)->nullable(); // Địa chỉ IP
            $table->text('user_agent')->nullable(); // Thông tin về trình duyệt
            $table->longText('payload'); // Dữ liệu phiên
            $table->integer('last_activity')->index(); // Thời gian hoạt động cuối cùng
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions'); // Xóa bảng sessions
        Schema::dropIfExists('password_reset_tokens'); // Xóa bảng password_reset_tokens
        Schema::dropIfExists('user'); // Xóa bảng users
    }
};