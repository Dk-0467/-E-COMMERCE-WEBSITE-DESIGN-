<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductSaleRequest;
use App\Models\Product;
use App\Models\ProductSale;
use Illuminate\Http\Request;

class ProductSaleController extends Controller
{
    public function index()
    {
        $productsales = ProductSale::where('product_sale.status', '!=', 0)
            ->rightJoin('product', 'product.id', '=', 'product_sale.product_id')
            ->orderBy('product_sale.created_at', 'DESC')
            ->select(
                'product_sale.id',
                'product_sale.product_id',
                'product_sale.price_sale',
                'product_sale.date_begin',
                'product_sale.date_end',
                'product_sale.created_at',
                'product_sale.updated_at',
                'product_sale.status'
            )
            ->get();
        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productsales' => $productsales,
            'total' => count($productsales),
        ];       
        return response()->json($result);
    }

    public function store(StoreProductSaleRequest $request)
    {
        $product = Product::find($request->product_id);

        if ($product == null) {
            $result = [
                'status' => false,
                'message' => 'Invalid product code',
                'productsale' => null
            ];
            return response()->json($result);
        }

        $productsale = new ProductSale();
        $productsale->product_id = $request->product_id;
        $productsale->price_sale = $request->price_sale;
        $productsale->date_begin = $request->date_begin;
        $productsale->date_end = $request->date_end;
        $productsale->status = 2;
        $productsale->created_by = 1;
        $productsale->created_at = date('Y-m-d H:i:s');

        if ($productsale->save()) {
            $result = [
                'status' => true,
                'message' => 'Added successfully',
                'productsale' => $productsale
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Cannot add',
                'productsale' => null
            ];
        }

        return response()->json($result);
    }

    // Show a specific product sale by ID
    public function show($id)
    {
        // Tải chi tiết giảm giá sản phẩm cùng với thông tin sản phẩm
        $productsale = ProductSale::with(['product'])->find($id);
    
        if (!$productsale) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chi tiết giảm giá sản phẩm',
            ], 404);
        }
    
        $product = $productsale->product;
    
        return response()->json([
            'status' => true,
            'message' => 'Tải chi tiết giảm giá sản phẩm thành công',
            'productsale' => [
                'id' => $productsale->id,
                'product_id' => $product->id,
                'price_sale' => $productsale->price_sale,
                'date_begin' => $productsale->date_begin,
                'date_end' => $productsale->date_end,
                'status' => $productsale->status,
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                ],
            ],
        ]);
    }
    
    // Update a product sale
    public function update(StoreProductSaleRequest $request, $id)
    {
        // Tìm kiếm sản phẩm giảm giá theo ID
        $productsale = ProductSale::find($id);
    
        if ($productsale) {
            // Cập nhật các trường của sản phẩm giảm giá
            $productsale->product_id = $request->product_id; // ID sản phẩm
            $productsale->price_sale = $request->price_sale; // Giá giảm
            $productsale->date_begin = $request->date_begin; // Ngày bắt đầu
            $productsale->date_end = $request->date_end; // Ngày kết thúc
            $productsale->updated_at = now(); // Thời gian cập nhật
            $productsale->created_by = $productsale->created_by; // Người tạo (không thay đổi)
            $productsale->status = $request->status; // Trạng thái (nếu có trường này trong request)
    
            // Lưu sản phẩm giảm giá đã cập nhật
            if ($productsale->save()) {
                $result = [
                    'status' => true,
                    'message' => 'Cập nhật thành công',
                    'productsale' => $productsale
                ];
            } else {
                $result = [
                    'status' => false,
                    'message' => 'Không thể cập nhật',
                    'productsale' => null
                ];
            }
        } else {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm giảm giá',
                'productsale' => null
            ];
        }
    
        return response()->json($result);
    }
    

    // Soft delete (move to trash)
    public function delete($id)
    {
        $productsale = ProductSale::find($id);

        if ($productsale) {
            $productsale->status = 0; // Assuming 0 is the 'deleted' status
            $productsale->save();

            $result = [
                'status' => true,
                'message' => 'Deleted successfully',
                'productsale' => $productsale
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Product sale not found',
                'productsale' => null
            ];
        }

        return response()->json($result);
    }

    public function trash()
    {
        $productSales = ProductSale::where('status', '=', 0) // Lọc theo trạng thái là 0 (đã xóa)
            ->orderBy('created_at', 'ASC') // Sắp xếp theo thời gian tạo
            ->select("id", "product_id", "price_sale", "date_begin", "date_end", "created_at", "updated_at", "created_by", "updated_by", "status") // Chọn các trường cụ thể
            ->get();
        
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'productSales' => $productSales // Trả về danh sách sản phẩm sale
        ]);
    }
    
    public function restore($id)
    {
        $productSale = ProductSale::find($id);
        if ($productSale) {
            $productSale->status = 1; // Đánh dấu lại là chưa xóa
            $productSale->save();
            return response()->json(['status' => true, 'message' => 'Phục hồi sản phẩm thành công!']);
        }
        return response()->json(['status' => false, 'message' => 'Không tìm thấy sản phẩm!']);
    }
    
    public function destroy($id)
    {
        $productSale = ProductSale::find($id);
        if ($productSale) {
            $productSale->delete(); // Xóa sản phẩm vĩnh viễn
            return response()->json(['status' => true, 'message' => 'Xóa sản phẩm thành công!']);
        }
        return response()->json(['status' => false, 'message' => 'Không tìm thấy sản phẩm!']);
    }
    
    // Toggle the status of a product sale (activate/deactivate)
    public function status($id)
    {
        $productsale = ProductSale::find($id);

        if (!$productsale) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm bán hàng',
            ]);
        }

        // Chuyển đổi trạng thái giữa 1 và 0
        $productsale->status = $productsale->status === 1 ? 2 : 1;

        if ($productsale->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật trạng thái thành công',
                'productsale' => $productsale
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Không thể cập nhật trạng thái',
        ]);
    }


    

}
