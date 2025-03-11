import AxiosInstance from "./AxiosInstance";

export const getAllGodowns = (sortBy, order, page, pageSize, filters) => {
    let data = {
        sortBy: sortBy != "" ? sortBy : "id",
        order: order != "" ? order : "asc",
        page: page != "" ? page : 1,
        perPage: pageSize,
        filters: filters
    }
    return AxiosInstance.get("/godowns", { params: data });
};

export const godown = async (inputValue) => {
    return await AxiosInstance.get("/get-all-godowns",{params: {search: inputValue}}).then(response => response.data).catch(error => error.response);
}

export const getGodown = async (id) => {
    return await AxiosInstance.get(`/godowns/${id}`).then(response => response.data).catch(error => error.response);
};

export const createGodown = async (data) => {
    return await AxiosInstance.post("/godowns", data).then(response => response.data).catch(error => error.response);
};

export const updateGodown = async (id, data) => {
    return await AxiosInstance.put(`/godowns/${id}`, data).then(response => response.data).catch(error => error.response);
};

export const deleteGodown = async (id) => {
    return await AxiosInstance.delete(`/godowns/${id}`).then(response => response.data).catch(error => error.response);
};