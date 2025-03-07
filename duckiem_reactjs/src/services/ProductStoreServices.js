import httpAxios from "./httpAxios";

const ProductStoreServices = {
    index: async () => {
        return await httpAxios.get(`productstore`);
    },
    trash: async () => {
        return await httpAxios.get(`productstore/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`productstore/show/${id}`);
    },
    store: async (data) => {
        return await httpAxios.post(`productstore/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`productstore/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`productstore/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`productstore/delete/${id}`);
    },
    restore: async (id) => {
        return await httpAxios.get(`productstore/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`productstore/destroy/${id}`);
    },
}

export default ProductStoreServices;
