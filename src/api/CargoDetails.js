import AxiosInstance from "./AxiosInstance";

export const createCargoDetails = async (data) => {
    return await AxiosInstance.post("/cargo-details", data).then(response => response.data).catch(error => error.response);
}

export const updateCargoDetails = async (id, data) => {
    return await AxiosInstance.put(`/cargo-details/${id}`, data).then(response => response.data).catch(error => error.response);
}

export const deleteCargoDetails = async (id) => {
    return await AxiosInstance.delete(`/cargo-details/${id}`).then(response => response.data).catch(error => error.response);
}