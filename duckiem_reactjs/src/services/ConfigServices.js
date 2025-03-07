import httpAxios from "./httpAxios";

const ConfigServices = {
    index: async () => {
        return await httpAxios.get(`config`);
    },
    show: async (id) => {
        return await httpAxios.get(`config/show/${id}`);
    },
    update: async (data, id) => {
        return await httpAxios.post(`config/update/${id}`, data);
    },
};

export default ConfigServices;
