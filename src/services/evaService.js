import { endpoints} from "./endpoints";
import axios from "axios";

export const evaluacionService = {
    getEvaluaciones: async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.get(endpoints.evaluacion.estudiante.getEvaluaciones, { headers });
            return response.data.success ? response.data : [];
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al obtener las evaluaciones",
                data: []
            }
        }
    },
    solicitarDifRep: async (token, data) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.post(endpoints.evaluacion.estudiante.solicitarDifRep, data, { headers });
            return response.data;
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al solicitar diferido/repetido"
            }
        }
    },
    getSolicitudesDifRep: async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.get(endpoints.evaluacion.docente.getSolicitudDifRep, { headers });
            console.log(response.data);
            return response.data.success ? response.data : [];
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al obtener las solicitudes de diferido/repetido",
                data: []
            }
        }
    },
    aprobarDiffRep: async (token, data) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.post(endpoints.evaluacion.docente.aprobarDifRep, data, { headers });
            console.log(response.data);
            return response.data;
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al aprobar diferido/repetido"
            }
        }
    },
    getEvaDocente: async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.get(endpoints.evaluacion.docente.getEvaluaciones, { headers });
            return response.data.success ? response.data : {
                success: false,
                message: "Error al obtener las evaluaciones",
                data: []
            };
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al obtener las evaluaciones",
                data: []
            }
        }
    },
    solicitarImp: async (token, data) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.post(endpoints.evaluacion.docente.solImp, data, { headers });
            return response.data;
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al solicitar impresión"
            }
        }
    },
    getSolImpresion: async (token) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.get(endpoints.evaluacion.impresor.getSolicitudes, { headers });
            return response.data.success ? response.data : {
                success: false,
                message: "Error al obtener las solicitudes de impresión",
                data: []
            };
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al obtener las solicitudes de impresión",
                data: []
            }
        }
    },
    aprobarImpresion: async (token, data) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.post(endpoints.evaluacion.impresor.aprobar, data, { headers });
            return response.data;
        } catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al aprobar la impresión"
            }
        }
    },
    imprimirEvaluacion: async (token, data) => {
        try{
            const headers = {
                accept: "application/json",
                Authorization: "Bearer " +token
            }

            const response = await axios.post(endpoints.evaluacion.impresor.impresion, data, { headers });
            return response.data;
        } catch(error){
            console.log(error);
            return {
                success: false,
                message: "Error al aprobar la impresión"
            }
        }
    }
}