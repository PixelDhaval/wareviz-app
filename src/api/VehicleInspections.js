import AxiosInstance from "./AxiosInstance";

export const createVehicleInspection = async (data) => {
    return await AxiosInstance.post("/vehicle-inspections", data).then(response => response.data).catch(error => error.response);
}   

export const updateVehicleInspection = async (id, data) => {
    return await AxiosInstance.put(`/vehicle-inspections/${id}`, data).then(response => response.data).catch(error => error.response);
}

export const deleteVehicleInspection = async (id) => {
    return await AxiosInstance.delete(`/vehicle-inspections/${id}`).then(response => response.data).catch(error => error.response);
}