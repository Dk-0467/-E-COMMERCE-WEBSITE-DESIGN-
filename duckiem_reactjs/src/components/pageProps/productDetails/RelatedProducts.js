import React from "react";

const RelatedProducts = ({ relatedProducts = [] }) => {
  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Related Products
      </h3>
      <div className="flex flex-col gap-2">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2"
            >
              <div>
                <img
                  className="w-24"
                  src={
                    relatedProduct.images && relatedProduct.images.length > 0
                      ? `http://127.0.0.1:8000/images/product/${relatedProduct.images[0].thumbnail}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={relatedProduct.name}
                />
              </div>
              <div className="flex flex-col gap-2 font-titleFont">
                <p className="text-base font-medium">{relatedProduct.name}</p>
                <p className="text-sm font-semibold">${relatedProduct.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm liên quan nào.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
