import httpAxios from "./httpAxios";

const ContactServices = {
    index: async () => {
        return await httpAxios.get(`contact`);
    },
    trash: async () => {
        return await httpAxios.get(`contact/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`contact/show/${id}`);
    },
    insert: async (data) => {
        return await httpAxios.post(`contact/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`contact/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`contact/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`contact/delete/${id}`); // Xóa mềm
    },
    restore: async (id) => {
        return await httpAxios.get(`contact/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`contact/destroy/${id}`); // Xóa vĩnh viễn
    },
    reply:async (id, data) => {
        return httpAxios.post(`/contact/reply/${id}`, data); 
    },
};

export default ContactServices;
