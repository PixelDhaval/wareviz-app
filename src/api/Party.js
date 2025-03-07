import AxiosInstance from "./AxiosInstance";

export const getAllParties = async () => { 
    return await AxiosInstance.get("/parties").then((res) => res.data).catch((err) => console.log(err)); 
}