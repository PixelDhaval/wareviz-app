import AxiosInstance from "./AxiosInstance";

export const getAllStates = async () => { 
    return await AxiosInstance.get("/states").then((res) => res.data).catch((err) => console.log(err)); 
}