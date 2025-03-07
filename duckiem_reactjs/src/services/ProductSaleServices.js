import httpAxios from "./httpAxios";

const ProductSaleServices = {
    index: async () => {
        return await httpAxios.get(`productsale`);
    },
    trash: async () => {
        return await httpAxios.get(`productsale/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`productsale/show/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post(`productsale/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`productsale/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`productsale/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`productsale/delete/${id}`);
    },
    restore: async (id) => {
        return await httpAxios.get(`productsale/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`productsale/destroy/${id}`);
    },
}

export default ProductSaleServices;
