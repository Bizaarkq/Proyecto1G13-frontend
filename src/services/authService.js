import { endpoints } from "./endpoints";
import axios from "axios";

export const authService = {
    login: async (email, password) => {

        try {
            const response = await axios.post(endpoints.auth.login, {
                email,
                password
            });

            return response.data;
        }catch (error) {
            console.log("error", error);
            console.log("error.response", error.message);
            return {
                success: false,
                message: error.message
            };
        }
    },
    me: async () => {
        const response = await axios.get(endpoints.auth.me);
        return response.data;
    },
    logout: async () => {
        const response = await axios.post(endpoints.auth.logout);
        return response.data;
    },
    register: async (body) => {
        const response = await axios.post(endpoints.auth.register, body);
        console.log("response", response);
        return response.data;
    },
    aprobarRegistro: async (token, body) => {
        const headers = {
            application: "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await axios.post(endpoints.auth.aprobarRegistro, body, {headers});
        return response.data;
    },
    solicitudes: async (token) => {
        try {
            const headers = {
                application: "application/json",
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get(endpoints.auth.solicitudes, {headers});
            return response.data;
        }catch (error) {
            console.log("error", error);
            console.log("error.response", error.message);
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
    }
}