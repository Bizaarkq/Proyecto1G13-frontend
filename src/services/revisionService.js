import { endpoints } from "./endpoints";
import axios from "axios";

export const revisionService = {
    getRevisions: async (token) => {
        const headers = {
            accept: "application/json",
            Authorization: `Bearer ${token}`
        }
        const response = await axios.get(endpoints.revision.estudiante.get, { headers });
        return response.data;
    },
    getEvaluaciones: async (token) => {

        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }
            console.log("headers", headers);
            const response = await axios.get(endpoints.revision.estudiante.evaluaciones, { headers });
            console.log("response", response.data);
            console.log("response.data.data", response.data.data);
            console.log("response.data.success", response.data.success);
            return response.data.success ? response.data.data : [];
        }catch(error){
            console.log(error);
            return [];
        }
        
    },
    solicitarRevision: async (token, body) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }
            
            const response = await axios.post(endpoints.revision.estudiante.solicitar, body, { headers });
            console.log("response", response.data);
            console.log("response.data.data", response.data.data);
            console.log("response.data.success", response.data.success);
            return response.data;            
        }catch(error){
            console.log(error);
            return [];
        }
    }
}