<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('user', function (Blueprint $table) {
            $table->softDeletes(); // Thêm trường deleted_at
        });
    }

    public function down()
    {
        Schema::table('user', function (Blueprint $table) {
            $table->dropSoftDeletes(); // Xóa trường deleted_at nếu cần
        });
    }
}
