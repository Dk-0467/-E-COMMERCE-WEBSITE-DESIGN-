import httpAxios from "./httpAxios";

const MenuServices = {
    index: async () => {
        return await httpAxios.get(`menu`);
    },
    trash: async () => {
        return await httpAxios.get(`menu/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`menu/show/${id}`);
    },
    insert: async (data) => {
        return await httpAxios.post(`menu/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`menu/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`menu/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`menu/delete/${id}`); // Xóa mềm
    },
    restore: async (id) => {
        return await httpAxios.get(`menu/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`menu/destroy/${id}`); // Xóa vĩnh viễn
    },
    header: async () => {
        return await httpAxios.get(`menu_header`); // Lấy danh sách menu với điều kiện status = 1
    },
    footer: async () => {
        return await httpAxios.get(`menu_footer`); // Lấy danh sách menu với điều kiện status = 1
    },
};

export default MenuServices;
