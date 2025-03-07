<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductSaleController;
use App\Http\Controllers\ProductStoreController;



// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


// UC1. Cấu hình
Route::get('config_web',[ConfigController::class,'config_web']);

// UC2: Menu 
Route::get('menu_list/{position}/{parentid?}/{limit?}',[MenuController::class,'menu_list']);
Route::get('/menu_header',[MenuController::class,'menu_header']);
Route::get('/menu_footer',[MenuController::class,'menu_footer']);



// UC3: Slideshow 
Route::get('slider_list/{position}/{limit?}',[BannerController::class,'slider_list']);

// UC4: Sản phẩm mới 
Route::get('product_new/{limit}',[ProductController::class,'product_new']);

// UC5: Sản phẩm khuyến mãi 
Route::get('product_sale/{limit}',[ProductController::class,'product_sale']);

Route::get('/product_detail/{name}',[ProductController::class,'product_detail']);



// UC6: Sản phẩm bán chạy 
Route::get('product_bestseller/{limit}',[ProductController::class,'product_bestseller']);

// UC7-1: Danh mục 
Route::get('category_list/{parentid?}',[CategoryController::class,'category_list']);

// UC7-2: Sản phẩm theo danh mục 
Route::get('product_category/categoryid/{categoryid}/{limit}',[ProductController::class,'product_category']);

// UC8: Bài viết mới nhất
Route::get('post_new/{limit}',[PostController::class,'post_new']);

// UC9: Trang đơn 
Route::get('post_page/{id}',[PostController::class,'post_page']);

// UC10: Sản phẩm 
// Route::get('product_all/categoryid/{categoryid}/{limit}',[ProductController::class,'product_all']);

//UC: Lọc sản phẩm theo danh mục, thương hiệu, giá
Route::get('product_all/{category_ids?}/{brand_ids?}/{price_min?}/{price_max?}', [ProductController::class, 'product_all']);

//UC11:User
Route::post('/login', [UserController::class, 'loginUser']);
Route::post('/register', [UserController::class, 'register']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/getUserInfo', [UserController::class, 'getUserInfo']);
	Route::post('order/checkout', [OrderController::class, 'processCheckout']);
	Route::get('order/userOrders', [OrderController::class, 'userOrders']);
});


//admin

// UC: Đăng nhập và quên mật khẩu
Route::post('admin/login',[UserController::class, 'login']);
Route::get('admin/forget',[UserController::class, 'getforget']);
Route::post('admin/forget',[UserController::class, 'postforget']);
Route::post('admin/reset-password', [UserController::class, 'resetPassword']);


// UC: Cập nhật cấu hình
Route::get('config',[ConfigController::class, 'index']);
Route::get('config/show/{id}',[ConfigController::class, 'show']);
Route::post('config/update/{id}',[ConfigController::class, 'update']);

// UC: Quản lý banner
Route::prefix('banner')->group(function(){
	Route::get('/',[BannerController::class, 'index']);
	Route::get('/trash',[BannerController::class, 'trash']);
	Route::get('/show/{id}',[BannerController::class, 'show']);
	Route::post('/store',[BannerController::class, 'store']);
	Route::post('/update/{id}',[BannerController::class, 'update']);
	Route::get('/status/{id}',[BannerController::class, 'status']);
	Route::get('/delete/{id}',[BannerController::class, 'delete']);
	Route::get('/restore/{id}',[BannerController::class, 'restore']);
	Route::delete('/destroy/{id}',[BannerController::class, 'destroy']);
});

// UC: Quản lý thương hiệu
Route::prefix('brand')->group(function(){
	Route::get('/',[BrandController::class, 'index']);
	Route::get('/trash',[BrandController::class, 'trash']);
	Route::get('/show/{id}',[BrandController::class, 'show']);
	Route::post('/store',[BrandController::class, 'store']);
	Route::post('/update/{id}',[BrandController::class, 'update']);
	Route::get('/status/{id}',[BrandController::class, 'status']);
	Route::get('/delete/{id}',[BrandController::class, 'delete']);
	Route::get('/restore/{id}',[BrandController::class, 'restore']);
	Route::delete('/destroy/{id}',[BrandController::class, 'destroy']);
});

// UC: Quản lý danh mục
Route::prefix('category')->group(function(){
	Route::get('/',[CategoryController::class, 'index']);
	Route::get('/trash',[CategoryController::class, 'trash']);
	Route::get('/show/{id}',[CategoryController::class, 'show']);
	Route::post('/store',[CategoryController::class, 'store']);
	Route::post('/update/{id}',[CategoryController::class, 'update']);
	Route::get('/status/{id}',[CategoryController::class, 'status']);
	Route::get('/delete/{id}',[CategoryController::class, 'delete']);
	Route::get('/restore/{id}',[CategoryController::class, 'restore']);
	Route::delete('/destroy/{id}',[CategoryController::class, 'destroy']);
});

// UC: Quản lý menu
Route::prefix('menu')->group(function(){
	Route::get('/',[MenuController::class, 'index']);
	Route::get('/trash',[MenuController::class, 'trash']);
	Route::get('/show/{id}',[MenuController::class, 'show']);
	Route::post('/store',[MenuController::class, 'store']);
	Route::post('/update/{id}',[MenuController::class, 'update']);
	Route::get('/status/{id}',[MenuController::class, 'status']);
	Route::get('/delete/{id}',[MenuController::class, 'delete']);
	Route::get('/restore/{id}',[MenuController::class, 'restore']);
	Route::delete('/destroy/{id}',[MenuController::class, 'destroy']);

});

// UC: Quản lý liên hệ
Route::prefix('contact')->group(function(){
	Route::get('/',[ContactController::class, 'index']);
	Route::get('/trash',[ContactController::class, 'trash']);
	Route::get('/show/{id}',[ContactController::class, 'show']);
	Route::post('/store', [ContactController::class, 'store']);
	Route::post('/reply/{id}',[ContactController::class, 'reply']);
	Route::get('/status/{id}',[ContactController::class, 'status']);
	Route::get('/delete/{id}',[ContactController::class, 'delete']);
	Route::get('/restore/{id}',[ContactController::class, 'restore']);
	Route::delete('/destroy/{id}',[ContactController::class, 'destroy']);
});

// UC: Quản lý bài viết
Route::prefix('post')->group(function(){
	Route::get('/',[PostController::class, 'index']);
	Route::get('/trash',[PostController::class, 'trash']);
	Route::get('/show/{id}',[PostController::class, 'show']);
	Route::post('/store',[PostController::class, 'store']);
	Route::post('/update/{id}',[PostController::class, 'update']);
	Route::get('/status/{id}',[PostController::class, 'status']);
	Route::get('/delete/{id}',[PostController::class, 'delete']);
	Route::get('/restore/{id}',[PostController::class, 'restore']);
	Route::delete('/destroy/{id}',[PostController::class, 'destroy']);
});

// UC: Quản lý chủ đề bài viết
Route::prefix('topic')->group(function(){
	Route::get('/',[TopicController::class, 'index']);
	Route::get('/trash',[TopicController::class, 'trash']);
	Route::get('/show/{id}',[TopicController::class, 'show']);
	Route::post('/store',[TopicController::class, 'store']);
	Route::post('/update/{id}',[TopicController::class, 'update']);
	Route::get('/status/{id}',[TopicController::class, 'status']);
	Route::get('/delete/{id}',[TopicController::class, 'delete']);
	Route::get('/restore/{id}',[TopicController::class, 'restore']);
	Route::delete('/destroy/{id}',[TopicController::class, 'destroy']);
});  

// UC: Quản lý thành viên
Route::prefix('user')->group(function(){
	Route::get('/',[UserController::class, 'index']);
	Route::get('/trash',[UserController::class, 'trash']);
	Route::get('/show/{id}',[UserController::class, 'show']);
	Route::post('/store',[UserController::class, 'store']);
	Route::post('/update/{id}',[UserController::class, 'update']);
	Route::get('/status/{id}',[UserController::class, 'status']);
	Route::get('/delete/{id}',[UserController::class, 'delete']);
	Route::get('/restore/{id}',[UserController::class, 'restore']);
	Route::delete('/destroy/{id}',[UserController::class, 'destroy']);
});

// UC: Quản lý đơn hàng
Route::prefix('order')->group(function(){
	Route::get('/',[OrderController::class, 'index']);
	Route::get('/trash',[OrderController::class, 'trash']);
	Route::get('/show/{id}',[OrderController::class, 'show']);
	Route::get('/status/{id}',[OrderController::class, 'status']);
	Route::get('/delete/{id}',[OrderController::class, 'delete']);
	Route::get('/restore/{id}',[OrderController::class, 'restore']);
	Route::delete('/destroy/{id}',[OrderController::class, 'destroy']);
});

// UC: Quản lý sản phẩm
Route::prefix('product')->group(function(){
	Route::get('/',[ProductController::class, 'index']);
	Route::get('/trash',[ProductController::class, 'trash']);
	Route::get('/show/{id}',[ProductController::class, 'show']);
	Route::post('/store',[ProductController::class, 'store']);
	Route::post('/update/{id}',[ProductController::class, 'update']);
	Route::get('/status/{id}',[ProductController::class, 'status']);
	Route::get('/delete/{id}',[ProductController::class, 'delete']);
	Route::get('/restore/{id}',[ProductController::class, 'restore']);
	Route::delete('/destroy/{id}',[ProductController::class, 'destroy']);
});

// UC: Quản lý sản phẩm khuyến mãi
Route::prefix('productsale')->group(function(){
	Route::get('/',[ProductSaleController::class, 'index']);
	Route::get('/trash',[ProductSaleController::class, 'trash']);
	Route::get('/show/{id}',[ProductSaleController::class, 'show']);
	Route::post('/store',[ProductSaleController::class, 'store']);
	Route::post('/update/{id}',[ProductSaleController::class, 'update']);
	Route::get('/status/{id}',[ProductSaleController::class, 'status']);
	Route::get('/delete/{id}',[ProductSaleController::class, 'delete']);
	Route::get('/restore/{id}',[ProductSaleController::class, 'restore']);
	Route::delete('/destroy/{id}',[ProductSaleController::class, 'destroy']);
});

// UC: Quản lý nhập kho
Route::prefix('productstore')->group(function(){
	Route::get('/',[ProductStoreController::class, 'index']);
	Route::get('/trash',[ProductStoreController::class, 'trash']);
	Route::get('/show/{id}',[ProductStoreController::class, 'show']);
	Route::post('/store',[ProductStoreController::class, 'store']);
	Route::post('/update/{id}',[ProductStoreController::class, 'update']);
	Route::get('/status/{id}',[ProductStoreController::class, 'status']);
	Route::get('/delete/{id}',[ProductStoreController::class, 'delete']);
	Route::get('/restore/{id}',[ProductStoreController::class, 'restore']);
	Route::delete('/destroy/{id}',[ProductStoreController::class, 'destroy']);
});
