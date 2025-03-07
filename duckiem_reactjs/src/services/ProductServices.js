import httpAxios from "./httpAxios";

const ProductServices = {
    index: async () => {
        return await httpAxios.get(`product`);
    },
    trash: async () => {
        return await httpAxios.get(`product/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`product/show/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post(`product/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`product/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`product/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`product/delete/${id}`);
    },
    restore: async (id) => {
        return await httpAxios.get(`product/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`product/destroy/${id}`);
    },
    product_new: async ()=>{
        return await httpAxios.get(`product_new/10`);
    },
    product_sale: async () => {
        return await httpAxios.get(`product_sale/10`);
    },
    product_bestseller: async (t) => {
        return await httpAxios.get(`product_bestseller/10`);
    },
    product_detail: async (name) => {
        return await httpAxios.get(`product_detail/${name}`);
    },
    product_category: async (categoryid, limit) => {
        return await httpAxios.get(`product_category/categoryid/${categoryid}/${limit}`);
    },
    product_all: async (category_ids = [], brand_ids = [], price_min = 0, price_max = 9999999999) => {
        // Nếu category_ids và brand_ids là mảng rỗng, gán giá trị là 'null'
        category_ids = category_ids.length > 0 ? category_ids.join(',') : 'null';
        brand_ids = brand_ids.length > 0 ? brand_ids.join(',') : 'null';
        
        // Thêm console.log để kiểm tra các tham số trước khi gọi API
        console.log("Formatted Category IDs:", category_ids);
        console.log("Formatted Brand IDs:", brand_ids);
        console.log("Price Min:", price_min);
        console.log("Price Max:", price_max);
        
        try {
            // Gọi API với các tham số đã định dạng
            const response = await httpAxios.get(`product_all/${category_ids}/${brand_ids}/${price_min}/${price_max}`);
            
            // Thêm console.log để kiểm tra dữ liệu trả về từ API
            console.log("API response data:", response);           
            return response;
        } catch (error) {
            console.error("Error in product_all:", error);
            throw error;
        }
    }
            
}

export default ProductServices;
