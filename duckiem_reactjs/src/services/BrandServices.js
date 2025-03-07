import httpAxios from "./httpAxios";

const BrandServices = {
    index: async () => {
        return await httpAxios.get(`brand`);
    },
    trash: async () => {
        return await httpAxios.get(`brand/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`brand/show/${id}`);
    },
    insert: async (data) => {
        return await httpAxios.post(`brand/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`brand/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`brand/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`brand/delete/${id}`); // Xóa mềm
    },
    restore: async (id) => {
        return await httpAxios.get(`brand/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`brand/destroy/${id}`); // Xóa vĩnh viễn
    },
};

export default BrandServices;
