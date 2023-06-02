import { endpoints } from "./endpoints";
import axios from "axios";

export const adminService = {
    getConfig: async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            console.log(headers, "headers");

            const response = await axios.get(endpoints.admin.getConfig, { headers });
            return response.data.success ? response.data : {
                success: false,
                message: "Error al obtener la configuración",
                data: []
            };
        }catch(error){
            return {
                success: false,
                message: "Error al obtener la configuración",
                data: []
            }
        }
    },
    setConfig: async (token, body) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }
            
            const response = await axios.post(endpoints.admin.setConfig, body, { headers });
            return response.data.success ? response.data : {
                success: false,
                message: "Error al actualizar la configuración",
                data: []
            };
        }catch(error){
            return {
                success: false,
                message: "Error al actualizar la configuración",
                data: []
            }
        }
    }
}