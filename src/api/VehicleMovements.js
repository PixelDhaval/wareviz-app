import AxiosInstance from "./AxiosInstance";

export const getAllVehicleMovements = async (filter, perPage, page, pageSize,paginate) => {
    let data = {
        paginate,
        sortBy: "movement_at",
        order: "desc",
        page: page,
        pageSize: pageSize,
        perPage: perPage,
        filters: filter
    }
    return await AxiosInstance.get("/vehicle-movements", { params: data }).then((res) => res.data).catch((err) => err.response);
}

export const getVehicleMovements = async (id) => {
    return await AxiosInstance.get(`vehicle-movements/${id}`).then((res) => res.data).catch((err) => err.response);
}

export const createUnloadVehicle = async (data) => {
    return await AxiosInstance.post("/vehicle-movements", data).then(response => response.data).catch(error => error.response);
}

export const updateVehicle = async (id, data) => {
    return await AxiosInstance.put(`vehicle-movements/${id}`, data).then(response => response.data).catch(error => error.response);
}