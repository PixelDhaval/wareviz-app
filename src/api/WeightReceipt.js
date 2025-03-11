import AxiosInstance from "./AxiosInstance";

export const createWeightReceipt = async (data) => {
    return await AxiosInstance.post("/weigh-receipts", data).then(response => response.data).catch(error => error.response);
}

export const updateWeightReceipt = async (id, data) => {
    return await AxiosInstance.put(`/weigh-receipts/${id}`, data).then(response => response.data).catch(error => error.response);
}

export const deleteWeightReceipt = async (id) => {
    return await AxiosInstance.delete(`/weigh-receipts/${id}`).then(response => response.data).catch(error => error.response);
}