import AxiosInstance from "./AxiosInstance";

export const getAllParties = async (sortBy, order, page, pageSize, filters) => {
    let data = {
        sortBy: sortBy != "" ? sortBy : "id",
        order: order != "" ? order : "asc",
        page: page != "" ? page : 1,
        perPage: pageSize,
        filters: filters
    }
    return await AxiosInstance.get("/parties", {params: data}).then((res) => res.data).catch((err) => console.log(err));
}

export const party = async (inputValue) => {
    return await AxiosInstance.get("/get-all-parties",{params: {search: inputValue}}).then(response => response.data).catch(error => error.response);
}

export const getParty = async (id) => {
    return await AxiosInstance.get(`/parties/${id}`).then((res) => res.data).catch((err) => console.log(err));
}

export const createParty = async (data) => {
    return await AxiosInstance.post("/parties", data).then(response => response.data).catch(error => error.response);
}

export const updateParty = async (id, data) => {
    return await AxiosInstance.put(`/parties/${id}`, data).then((res) => res.data).catch((err) => console.log(err));
}

export const deleteParty = async (id) => {
    return await AxiosInstance.delete(`/parties/${id}`).then((res) => res.data).catch((err) => console.log(err));
}