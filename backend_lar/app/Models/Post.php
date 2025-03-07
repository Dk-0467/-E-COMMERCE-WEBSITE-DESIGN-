<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $table = 'post';

    protected $fillable = [
        'title', 'topic_id', 'content', 'description', 'thumbnail', 
        'type', 'created_by', 'updated_by', 'status', 
        'created_at', 'updated_at'
    ];
    
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

}
