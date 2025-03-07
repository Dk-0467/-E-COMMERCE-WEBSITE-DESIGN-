<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('status', '!=', 0)
            ->orderBy('id', 'ASC')
            ->select('id', 'name', 'email', 'phone', 'roles', 'status')
            ->get();
        
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'users' => $users
        ];
        return response()->json($result);
    }

    public function trash()
    {
        $users = User::where('status', '=', 0)
            ->orderBy('id', 'ASC')
            ->select('id', 'fullname', 'email', 'phone', 'roles', 'status')
            ->get();
        
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'users' => $users
        ];
        return response()->json($result);
    }

    public function show($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'user' => $user
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'user' => $user
            ];
        }
        return response()->json($result);
    }

    public function store(Request $request)
    {
        try {
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->fullname = $request->fullname;
            $user->gender = $request->gender;
            $user->phone = $request->phone;
            $user->address = $request->address;
            $user->roles = $request->roles;
            $user->created_by = 1;
            $user->created_at = now();
            $user->status = $request->status;

            if ($user->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Thêm người dùng thành công',
                    'user' => $user
                ]);
            }
            
            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm người dùng'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }
    
            // Cập nhật thông tin cơ bản của người dùng
            $user->name = $request->name;
            $user->email = $request->email;
            $user->fullname = $request->fullname;
            $user->gender = $request->gender;
            $user->phone = $request->phone;
            $user->address = $request->address;
            $user->roles = $request->roles ?? 'user';
            $user->status = $request->status ?? '1';
    
            // Kiểm tra và lưu hình ảnh nếu có
            if ($request->hasFile('thumbnail')) {
                // Xóa hình ảnh cũ nếu có
                if ($user->thumbnail && file_exists(public_path('images/users/' . $user->thumbnail))) {
                    unlink(public_path('images/users/' . $user->thumbnail));
                }
                
                // Lưu hình ảnh mới
                $image = $request->file('thumbnail');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('images/users'), $imageName);
                
                // Cập nhật tên hình ảnh vào cơ sở dữ liệu
                $user->thumbnail = $imageName;
            }
    
            if ($user->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Cập nhật người dùng thành công',
                    'user' => $user
                ]);
            }
            
            return response()->json([
                'status' => false,
                'message' => 'Không thể cập nhật người dùng'
            ], 500);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
        
    public function status($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }

            $user->status = $user->status == 1 ? 2 : 1;
            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'Thay đổi trạng thái thành công',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }

            $user->status = 0;
            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'Xóa người dùng thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function restore($id)
    {
        try {
            $user = User::withTrashed()->find($id); 
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }

            $user->status = 1;
            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'Khôi phục người dùng thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::withTrashed()->find($id); 
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }

            $user->forceDelete(); 

            return response()->json([
                'status' => true,
                'message' => 'Xóa vĩnh viễn thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }


    public function register(Request $request)
    {
        // Kiểm tra dữ liệu hợp lệ (validation)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:user',
            'password' => 'required|string|min:6',
            'fullname' => 'required|string|max:255',
            'roles' => 'in:user,admin', // Chỉ cho phép 'user' hoặc 'admin' làm giá trị cho roles
        ]);
    
        // Chèn người dùng mới vào cơ sở dữ liệu
        DB::table('user')->insert([
            'name' => $request->name,
            'phone' => $request->phone ?? null,
            'email' => $request->email,
            'gender' => $request->gender ?? null,
            'address' => $request->address ?? null,
            'fullname' => $request->fullname,
            'password' => bcrypt($request->password),
            'roles' => $request->roles ?? 'user', // Mặc định là 'user' nếu không truyền roles
            'status' => '1',
            'created_at' => now(), // Sử dụng hàm now() để lấy thời gian hiện tại
            'created_by' => Auth::id() ?? 1, // Người tạo
        ]);
    
        // Trả về phản hồi hoặc chuyển hướng
        return response()->json(['message' => 'Đăng ký thành công!']);
    }
    
    public function loginUser(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'login' => 'required|string', // email hoặc username
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Tìm người dùng theo email hoặc username
        $user = User::where('email', $request->login)
                    ->orWhere('name', $request->login)
                    ->first();
    
        // Kiểm tra thông tin đăng nhập
        if ($user && Hash::check($request->password, $user->password)) {
            // Tạo token cho người dùng và lưu vào bảng personal_access_tokens
            $token = $user->createToken('AdminAppName')->plainTextToken;
    
            // Trả về phản hồi với thông tin người dùng và token
            return response()->json([
                'message' => 'Đăng nhập thành công!',
                'user' => $user->only(['id', 'name', 'email', 'created_at', 'updated_at']),
                'token' => $token,
            ], 200);
        }
    
        // Trả về phản hồi lỗi nếu đăng nhập không thành công
        return response()->json(['message' => 'Thông tin đăng nhập không chính xác.'], 401);
    }
    
    public function login(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'login' => 'required|string', // email hoặc username
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Tìm người dùng theo email hoặc username
        $user = User::where('email', $request->login)
                    ->orWhere('name', $request->login)
                    ->first();

        // Kiểm tra thông tin đăng nhập
        if ($user && Hash::check($request->password, $user->password)) {
            // Kiểm tra vai trò của người dùng
            if ($user->roles !== 'admin') {
                return response()->json(['message' => 'Chỉ có admin mới được phép đăng nhập vào trang này.'], 403);
            }

            // Tạo token cho người dùng và lưu vào bảng personal_access_tokens
            $token = $user->createToken('AdminAppName')->plainTextToken;

            // Trả về phản hồi với thông tin người dùng và token
            return response()->json([
                'message' => 'Đăng nhập thành công!',
                'user' => $user->only(['id', 'name', 'email', 'created_at', 'updated_at']),
                'token' => $token,
            ], 200);
        }

        // Trả về phản hồi lỗi nếu đăng nhập không thành công
        return response()->json(['message' => 'Thông tin đăng nhập không chính xác.'], 401);
    }

    public function getUserInfo(Request $request)
    {
        // Lấy người dùng đã xác thực
        $user = $request->user(); // Sử dụng $request->user() thay vì $request->user
        
        // Kiểm tra xem người dùng có tồn tại không
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Người dùng không được tìm thấy.',
            ], 404);
        }
    
        // Trả về thông tin người dùng
        return response()->json([
            'status' => true,
            'message' => 'Lấy thông tin người dùng thành công',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'fullname' => $user->fullname,
                'gender' => $user->gender,
                'phone' => $user->phone,
                'address' => $user->address,
                'thumbnail' => $user->thumbnail, // Thêm thông tin hình ảnh
                // 'roles' => $user->roles,
            ],
        ]);
    }

    public function getforget()
    {
        // Trả về một thông báo yêu cầu người dùng nhập email của họ để gửi mã reset mật khẩu.
        return response()->json([
            'status' => true,
            'message' => 'Vui lòng nhập email để đặt lại mật khẩu.'
        ]);
    }

    public function postforget(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:user,email',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Gửi email đặt lại mật khẩu
        $status = Password::sendResetLink(
            $request->only('email')
        );
    
        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => true,
                'message' => 'Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến.'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.'
            ], 500);
        }
    }
        
    public function resetPassword(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:user,email',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Tiến hành đặt lại mật khẩu
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'status' => true,
                'message' => 'Mật khẩu đã được thay đổi thành công. Bạn có thể đăng nhập với mật khẩu mới.',
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.',
            ], 500);
        }
    }
        
}
