<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ProductImage;
use Illuminate\Support\Str;
use App\Http\Requests\StoreProductRequest;
use App\Models\Category;
use App\Models\OrderDetail;
use App\Models\ProductStore;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(){
        $products = Product::where('product.status','!=', 0)
            ->join('category', 'product.category_id', '=', 'category.id')
            ->join('brand', 'product.brand_id', '=', 'brand.id')
            ->with('images')
            ->orderBy('product.created_at', 'DESC')
            ->select("product.id","product.name","product.status","category.name as catname", "brand.name as brandname","product.price" )
            ->get();
            $result =[
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'products' =>$products,
            ];
            return response()->json($result);
    }

    public function store(StoreProductRequest $request)
    {
        $product = new Product();
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->name = $request->name;
    
        // Kiểm tra slug có bị trùng không
        $slug = Str::slug($request->name);
        $count = Product::where('slug', 'like', "{$slug}%")->count();
        $product->slug = $count ? "{$slug}-{$count}" : $slug;
    
        $product->content = $request->content;
        $product->price = $request->price;
        $product->description = $request->description;
        $product->created_by = 1;
        $product->created_at = now(); // Thay thế bằng hàm now() của Laravel
        $product->status = $request->status;
    
        if ($product->save()) {
            $images = []; // Khởi tạo mảng để lưu tên ảnh
    
            if ($request->hasFile('thumbnail')) {
                foreach ($request->file('thumbnail') as $file) {
                    $productImage = new ProductImage();
                    $productImage->product_id = $product->id;
    
                    // Tạo tên file duy nhất cho ảnh
                    $imageName = $product->slug . '-' . uniqid() . '.' . $file->extension();
    
                    // Di chuyển file vào thư mục và lưu tên
                    $file->move(public_path('images/product'), $imageName);
                    $productImage->thumbnail = $imageName;
                    $productImage->save();
    
                    // Thêm đường dẫn vào mảng phản hồi
                    $images[] = $imageName;
                }
            }
    
            $result = [
                'status' => true,
                'message' => 'Thêm sản phẩm thành công',
                'product' => [
                    'id' => $product->id,
                    'category_id' => $product->category_id,
                    'brand_id' => $product->brand_id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'content' => $product->content,
                    'price' => $product->price,
                    'description' => $product->description,
                    'created_by' => $product->created_by,
                    'created_at' => $product->created_at,
                    'status' => $product->status,
                    'images' => $images, // Thêm hình ảnh vào phản hồi
                ],
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Không thêm được sản phẩm',
                'product' => null,
            ];
        }
    
        return response()->json($result);
    }
    
    public function show($id)
    {
        // Tải sản phẩm cùng với hình ảnh, danh mục và thương hiệu
        $product = Product::with(['images', 'category', 'brand'])->find($id);
    
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại',
            ], 404);
        }
    
        return response()->json([
            'status' => true,
            'message' => 'Tải sản phẩm thành công',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'content' => $product->content,
                'price' => $product->price,
                'description' => $product->description,
                'created_by' => $product->created_by,
                'created_at' => $product->created_at,
                'status' => $product->status,
                'images' => $product->images, // Hình ảnh của sản phẩm
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ],
                'brand' => [
                    'id' => $product->brand->id,
                    'name' => $product->brand->name,
                ],
            ],
        ]);
    }

public function update(StoreProductRequest $request, $id)
{
    $product = Product::find($id);

    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Sản phẩm không tồn tại',
        ], 404);
    }

    $product->category_id = $request->category_id;
    $product->brand_id = $request->brand_id;
    $product->name = $request->name;

    // Kiểm tra slug có bị trùng không
    $slug = Str::slug($request->name);
    $count = Product::where('slug', 'like', "{$slug}%")->where('id', '!=', $id)->count();
    $product->slug = $count ? "{$slug}-{$count}" : $slug;

    $product->content = $request->content;
    $product->price = $request->price;
    $product->description = $request->description;
    $product->status = $request->status;

    if ($product->save()) {
        // Cập nhật hình ảnh nếu có
        if ($request->hasFile('thumbnail')) {
            // Xóa hình ảnh cũ khỏi thư mục và cơ sở dữ liệu
            $oldImages = ProductImage::where('product_id', $product->id)->get();
            foreach ($oldImages as $oldImage) {
                $oldImagePath = public_path('images/product/' . $oldImage->thumbnail);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath); // Xóa file ảnh cũ khỏi thư mục
                }
                $oldImage->delete(); // Xóa bản ghi ảnh cũ khỏi cơ sở dữ liệu
            }

            // Lưu hình ảnh mới
            foreach ($request->file('thumbnail') as $file) {
                $productImage = new ProductImage();
                $productImage->product_id = $product->id;

                // Tạo tên file duy nhất cho ảnh
                $imageName = $product->slug . '-' . uniqid() . '.' . $file->extension();

                // Di chuyển file vào thư mục và lưu tên
                $file->move(public_path('images/product'), $imageName);
                $productImage->thumbnail = $imageName;
                $productImage->save();
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'product' => $product,
        ]);
    }

    return response()->json([
        'status' => false,
        'message' => 'Không cập nhật được sản phẩm',
    ]);
}

    public function status($id)
    {
        // Tìm sản phẩm theo id
        $product = Product::find($id);
        
        // Kiểm tra nếu sản phẩm không tồn tại
        if ($product === null) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại',
            ]);
        }
    
        // Thay đổi trạng thái của sản phẩm
        $product->status = $product->status == 1 ? 2 : 1;
        $product->updated_at = now();
    
        // Lưu trạng thái mới và trả về kết quả
        if ($product->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật trạng thái thành công',
                'product' => $product
            ]);
        }
    
        // Nếu lưu thất bại, trả về thông báo lỗi
        return response()->json([
            'status' => false,
            'message' => 'Không thể cập nhật trạng thái',
        ]);
    }
    
    public function trash()
    {
        $products = Product::where('status', '=', 0) // Lọc theo trạng thái là 0 (đã xóa)
            ->orderBy('created_at', 'ASC') // Sắp xếp theo thời gian tạo
            ->select("id", "category_id", "brand_id", "name", "slug", "content", "price", "description", "created_by", "updated_by", "status", "created_at", "updated_at") // Chọn các trường cụ thể
            ->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products // Trả về danh sách sản phẩm
        ]);
    }
    
    // Xóa sản phẩm (chuyển vào thùng rác)
    public function delete($id)
    {
        $product = Product::find($id);
        if ($product === null) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại',
            ], 404);
        }

        $product->status = 0; // Đánh dấu sản phẩm là đã xóa
        $product->updated_at = now();

        if ($product->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Đã chuyển vào thùng rác',
                'product' => $product
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa',
        ], 500);
    }

    // Phục hồi sản phẩm đã xóa
    public function restore($id)
    {
        $product = Product::find($id);
        if ($product === null || $product->status != 0) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại hoặc không cần phục hồi',
            ], 404);
        }

        $product->status = 1; // Khôi phục trạng thái
        $product->updated_at = now();

        if ($product->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Phục hồi thành công',
                'product' => $product
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể phục hồi',
        ], 500);
    }

    // Xóa vĩnh viễn sản phẩm
    public function destroy($id)
    {
        $product = Product::find($id);
        if ($product === null) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại',
            ], 404);
        }

        // Xóa ảnh nếu cần thiết
        if ($product->image) {
            $oldImagePath = public_path('images/product/') . $product->image;
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        if ($product->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'Xóa thành công',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể xóa',
        ], 500);
    }

    // sản phảm mới nhất 
    public function product_new($limit)
    {
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
        ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
            ->joinSub($subproductstore, "product_store", function($join){
                $join->on('product.id', '=', 'product_store.product_id');
            })
            ->leftJoin('product_sale', function ($join){
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                ->where([
                    ['product_sale.date_begin', '<=', $today],
                    ['product_sale.date_begin', '>=', $today],
                    ['product_sale.status', '=', 1],
                ]);
            })
        ->with('images')
        ->orderBy('product.created_at', 'DESC')
        ->select("product.id", "product.name", "product.price", "product.slug", "product_sale.price_sale")
        ->limit($limit)
        ->get();
        $result = [
            'status' =>true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products
        ];
        return response()->json($result);
    }
    
    //sản phẩm sale
    public function product_sale($limit)
    {
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');

        $products = Product::where('product.status', '=', 1)
            ->joinSub($subproductstore, 'product_store', function ($join) {
                $join->on('product.id', '=', 'product_store.product_id');
            })
            ->join('product_sale', function ($join) {
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                    ->where([
                        ['product_sale.date_begin', '<=', $today],
                        ['product_sale.date_end', '>=', $today],
                        ['product_sale.status', '=', 1]
                    ]);
            })
            ->with('images')
            ->orderBy('product_sale.price_sale', 'DESC')
            ->select("product.id", "product.name", "product.price", "product.slug", "product_sale.price_sale")
            ->limit($limit)
            ->get();

        $result = [
            'status' => true,
            'message' => 'Data loaded successfully',
            'products' => $products,
        ];

        return response()->json($result);
    }

    public function product_bestseller($limit)
    {
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');

        $suborderdetail = OrderDetail::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');

        $products = Product::where('product.status', '=', 1)
            ->joinSub($subproductstore, 'product_store', function ($join) {
                $join->on('product.id', '=', 'product_store.product_id');
            })
            ->joinSub($suborderdetail, 'orderdetail', function ($join) {
                $join->on('product.id', '=', 'orderdetail.product_id');
            })
            ->leftJoin('product_sale', function ($join) {
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                    ->where([
                        ['product_sale.date_begin', '<=', $today],
                        ['product_sale.date_end', '>=', $today],
                        ['product_sale.status', '=', 1]
                    ]);
            })
            ->with('images')
            ->orderBy('orderdetail.qty', 'DESC')
            ->select("product.id", "product.name", "product.price", "product.slug", "product_sale.price_sale", "orderdetail.qty")
            ->limit($limit)
            ->get();

        $result = [
            'status' => true,
            'message' => 'Data loaded successfully',
            'products' => $products,
        ];

        return response()->json($result);
    }
    
    
    public function product_detail($name)
    {
        // Tìm sản phẩm theo slug và trạng thái
        $product = Product::with('images') // Eager load hình ảnh
            ->where([['name', '=', $name], ['status', '=', 1]])
            ->first();
    
        // Kiểm tra xem sản phẩm có tồn tại không
        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }
    
        // Lấy danh sách ID danh mục liên quan
        $listcatid = $this->getListCategoryId($product->category_id);
    
        // Lấy danh sách sản phẩm liên quan
        $product_list = Product::with('images') // Eager load hình ảnh sản phẩm liên quan
            ->where([['status', '=', 1], ['id', '!=', $product->id]])
            ->whereIn('category_id', $listcatid)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();
    
        // Trả về dữ liệu sản phẩm chi tiết cùng với sản phẩm liên quan
        return response()->json([
            'product' => $product,
            'related_products' => $product_list,
        ]);
    }

    // UC7-2: Sản phẩm theo danh mục 
    public function product_category($categoryid, $limit)
    {
        // Lấy danh sách sản phẩm theo danh mục
        $products = Product::where('category_id', $categoryid)
            ->where('status', '!=', 0) // Lọc các sản phẩm đang hoạt động
            ->with('images') // Tải hình ảnh liên quan
            ->orderBy('created_at', 'DESC') // Sắp xếp theo thời gian tạo
            ->limit($limit) // Giới hạn số lượng sản phẩm
            ->get();

        // Kiểm tra xem có sản phẩm hay không
        if ($products->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm nào', // Thông báo khi không có sản phẩm
                'products' => [], // Trả về mảng sản phẩm rỗng
            ], 404);
        }

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products,
        ];

        return response()->json($result);
    }
    
    //UC: Lọc sản phẩm theo danh mục, thương hiệu, giá
    public function product_all($category_ids = null, $brand_ids = null, $price_min = 0, $price_max = 999999999)
    {
        $list_categoryid = [];
        $list_brandid = [];
        $where_arg = [
            ['product.status', '=', '1']
        ];
    
        // Xử lý danh mục (không lấy danh mục con)
        if (!empty($category_ids) && $category_ids !== 'null') {
            $list_categoryid = explode(',', $category_ids); // Tách các ID thành mảng
        }
    
        // Xử lý thương hiệu
        if (!empty($brand_ids) && $brand_ids !== 'null') {
            $list_brandid = explode(',', $brand_ids); // Tách các ID thương hiệu thành mảng
        }
    
        // Thêm điều kiện lọc theo giá
        if ($price_min !== null && $price_max !== null) {
            $where_arg[] = ['product.price', '>=', $price_min];
            $where_arg[] = ['product.price', '<=', $price_max];
        }
    
        // Áp dụng điều kiện lọc theo giá
        $subproductstore = ProductStore::select('product_id', DB::raw('SUM(qty) as qty'))
            ->groupBy('product_id');
    
        $suborderdetail = OrderDetail::select('product_id', DB::raw('SUM(qty) as total_sold'))
            ->groupBy('product_id');
    
        $products_tmp = Product::where($where_arg)
            ->whereBetween('product.price', [$price_min, $price_max])
            ->joinSub($subproductstore, 'product_store', function ($join) {
                $join->on('product.id', '=', 'product_store.product_id');
            })
            ->leftJoinSub($suborderdetail, 'order_detail', function ($join) {
                $join->on('product.id', '=', 'order_detail.product_id');
            })
            ->leftJoin('product_sale', function ($join) {
                $today = Carbon::now()->format('Y-m-d H:i:s');
                $join->on('product.id', '=', 'product_sale.product_id')
                    ->where([
                        ['product_sale.date_begin', '<=', $today],
                        ['product_sale.date_end', '>=', $today],
                        ['product_sale.status', '=', 1]
                    ]);
            })
            ->with('images')
            ->orderBy('product.created_at', 'DESC')
            ->select("product.id", "product.name", "product.brand_id", "product.category_id", "product.price", "product.slug", "product_sale.price_sale", "product_store.qty", "order_detail.total_sold");
        
        // Thêm điều kiện lọc theo danh mục (nếu có)
        if (count($list_categoryid) > 0) {
            $products_tmp->whereIn('product.category_id', $list_categoryid);
        }
    
        // Thêm điều kiện lọc theo thương hiệu (nếu có)
        if (count($list_brandid) > 0) {
            $products_tmp->whereIn('product.brand_id', $list_brandid);
        }
    
        // Lấy tất cả sản phẩm mà không phân trang
        $products = $products_tmp->get();
        
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'products' => $products
        ];
        
        return response()->json($result);
    }
             

    function getListCategoryId($category_id)
    {
        $list = [];
        
        // Thêm ID của danh mục gốc vào danh sách
        array_push($list, $category_id);

        // Lấy danh sách các danh mục con cấp 1 của danh mục gốc
        $list_cat1 = Category::where([
            ['status', '=', 1], 
            ['parent_id', '=', $category_id]
        ])->get();

        // Nếu có danh mục con cấp 1
        if (count($list_cat1) > 0) {
            foreach ($list_cat1 as $row_cat1) {
                // Thêm ID danh mục con cấp 1 vào danh sách
                array_push($list, $row_cat1->id);

                // Lấy danh sách các danh mục con cấp 2 của danh mục con cấp 1 hiện tại
                $list_cat2 = Category::where([
                    ['status', '=', 1], 
                    ['parent_id', '=', $row_cat1->id]
                ])->get();

                // Nếu có danh mục con cấp 2
                if (count($list_cat2) > 0) {
                    foreach ($list_cat2 as $row_cat2) {
                        array_push($list, $row_cat2->id);
                    }
                }
            }
        }

        return $list;
    }

}
