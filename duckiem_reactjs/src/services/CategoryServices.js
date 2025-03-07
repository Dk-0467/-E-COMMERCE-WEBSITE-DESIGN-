import httpAxios from "./httpAxios";

const CategoryServices = {
    index: async () => {
        return await httpAxios.get(`category`);
    },
    trash: async () => {
        return await httpAxios.get(`category/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`category/show/${id}`);
    },
    insert: async (data) => {
        return await httpAxios.post(`category/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`category/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`category/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`category/delete/${id}`); // Xóa mềm
    },
    restore: async (id) => {
        return await httpAxios.get(`category/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`category/destroy/${id}`); // Xóa vĩnh viễn
    },
    categoryList: async (parentid = null) => {
        const url = parentid ? `category_list/${parentid}` : `category_list`;
        return await httpAxios.get(url);
    },
};

export default CategoryServices;
