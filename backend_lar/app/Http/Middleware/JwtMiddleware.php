<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            // Giải mã token và xác thực người dùng
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['message' => 'Người dùng không được tìm thấy.'], Response::HTTP_NOT_FOUND);
            }
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token không hợp lệ.'], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Nếu token hợp lệ, gán người dùng vào request
        $request->user = $user;

        return $next($request);
    }
}
