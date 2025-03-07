import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "https://wareviz.adsvizion.net/api/", 
    headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer 4|9fpvvi9KIhGeU0pPnV27A6a3bVTyOuOwRRAetBw18bcbdd47"
    },
});

export default AxiosInstance;