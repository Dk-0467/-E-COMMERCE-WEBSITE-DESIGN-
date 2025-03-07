
import { data } from "autoprefixer";
import httpAxios from "./httpAxios";

const UserServices = {
    index: async () => {
        return await httpAxios.get(`user`);
    },
    trash: async () => {
        return await httpAxios.get(`user/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`user/show/${id}`);
    },
    insert: async (data) => {
        return await httpAxios.post(`user/store`, data);
    },
    update: async (data, id) => {
        return await httpAxios.post(`user/update/${id}`, data);
    },
    status: async (id) => {
        return await httpAxios.get(`user/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`user/delete/${id}`);
    },
    restore: async (id) => {
        return await httpAxios.get(`user/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`user/destroy/${id}`);
    },
    registerUser: async (data) => {
        return await httpAxios.post(`/register`, data); // Đăng ký người dùng
    },
    loginUser: async (data) => {
        return await httpAxios.post(`/login`, data); // Đăng nhập người dùng
    },
    getUserInfo: async () => {
        return await httpAxios.get(`/getUserInfo`); // Lấy thông tin người dùng
    },
    login: async (data) => {
        return await httpAxios.post(`admin/login`, data);
    },
    getforget: async () => {
        return await httpAxios.get(`admin/forget`);
    },
    postforget: async (data) => {
        return await httpAxios.post(`admin/forget`, data);
    },



};

export default UserServices;
