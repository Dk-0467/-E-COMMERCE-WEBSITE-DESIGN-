<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Topic extends Model
{
    use HasFactory;
    protected $table = 'topic';
    protected $fillable = ['name'];  // Tên của chủ đề

    // Khai báo mối quan hệ với Post
    public function post()
    {
        return $this->hasMany(Post::class);
    }
}
