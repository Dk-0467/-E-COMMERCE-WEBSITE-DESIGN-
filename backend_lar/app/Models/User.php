<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Thêm trait HasApiTokens
use Tymon\JWTAuth\Contracts\JWTSubject; // Thêm giao diện JWTSubject
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable 
{
    use HasFactory, Notifiable, HasApiTokens,SoftDeletes; // Thêm HasApiTokens vào đây

    protected $table = 'user';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'fullname',
        'gender',
        'thumbnail',
        'phone',
        'address',
        'roles',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function contact()
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Triển khai phương thức của JWTSubject
     * Lấy khoá định danh JWT
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Lấy ID người dùng
    }

    /**
     * Trả về một mảng các thông tin bổ sung để thêm vào JWT
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return []; // Không có thông tin bổ sung
    }
}
