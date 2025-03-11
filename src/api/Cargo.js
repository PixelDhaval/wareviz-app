import AxiosInstance from "./AxiosInstance";

export const getAllcargos = async (sortBy, order, page, pageSize, filters) => {
    let data = {
        sortBy: sortBy != "" ? sortBy : "id",
        order: order != "" ? order : "asc",
        page: page != "" ? page : 1,
        perPage: pageSize,
        filters: filters
    }
    return await AxiosInstance.get("/cargos", { params: data }).then(response => response.data).catch(error => error.response);
};

export const cargo = async (inputValue) => {
    return await AxiosInstance.get("/get-all-cargos",{params: {search: inputValue}}).then(response => response.data).catch(error => error.response);
}

export const getCargo = async (id) => {
    return await AxiosInstance.get(`/cargos/${id}`).then(response => response.data).catch(error => error.response);
};

export const createCargo = async (data) => {
    return await AxiosInstance.post("/cargos", data).then(response => response.data).catch(error => error.response);
};

export const updateCargo = async (id, data) => {
    return await AxiosInstance.put(`/cargos/${id}`, data).then(response => response.data).catch(error => error.response);
};

export const deleteCargo = async (id) => {
    return await AxiosInstance.delete(`/cargos/${id}`).then(response => response.data).catch(error => error.response);
};