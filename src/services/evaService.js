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
    }
}