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
            const response = await axios.get(endpoints.revision.estudiante.evaluaciones, { headers });
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
            return response.data;            
        }catch(error){
            return [];
        }
    },
    getRevisionesDocente: async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.get(endpoints.revision.docente.get, { headers });
            return response.data.success ? response.data : [];
        }catch(error){
            return {
                success: false,
                message: "Error al obtener las revisiones",
                data: []
            }
        }
    },
    getSolicitudesDocente: async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.get(endpoints.revision.docente.solicitudes, { headers });
            return response.data.success ? response.data : [];
        }catch(error){
            return {
                success: false,
                message: "Error al obtener las solicitudes"
            }
        }
    },
    aprobarSolicitud: async (token, body) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }
            const response = await axios.post(endpoints.revision.docente.aprobar, body, { headers });
            return response.data.success ? response.data : [];
        }catch(error){
            return {
                success: false,
                message: "Error al aprobar la revisión"
            }
        }
    },
    getMotivosCambios : async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }
            
            console.log("headers", headers);
            const response = await axios.get(endpoints.revision.motivos, { headers });
            return response.data.success ? response.data.data : [];
        }catch(error){
            return []
        }
    },
    getResponsableSoc : async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }
            console.log("headers", headers);
            const response = await axios.get(endpoints.revision.respsoc, { headers });
            return response.data.success ? response.data.data : [];
        }catch(error){
            console.log("error resp", error);
            return []
        }
    },
    agregarRevision: async (token, body) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.post(endpoints.revision.docente.agregar, body, { headers });
            return response.data;
        }catch(error){
            return {
                success: false,
                message: "Error al agregar la revisión"
            }
        }
    }
}