import httpAxios from "./httpAxios";

const OrderServices = {
    index: async () => {
        return await httpAxios.get(`order`);
    },
    trash: async () => {
        return await httpAxios.get(`order/trash`);
    },
    show: async (id) => {
        return await httpAxios.get(`order/show/${id}`);
    },
    status: async (id) => {
        return await httpAxios.get(`order/status/${id}`);
    },
    delete: async (id) => {
        return await httpAxios.get(`order/delete/${id}`);
    },
    restore: async (id) => {
        return await httpAxios.get(`order/restore/${id}`);
    },
    destroy: async (id) => {
        return await httpAxios.delete(`order/destroy/${id}`);
    },
    checkout: async (cartData) => {
        return await httpAxios.post(`order/checkout`, cartData); 
    },
    userOrders: async () => {
        return await httpAxios.get(`order/userOrders`); 
    },
}

export default OrderServices;
