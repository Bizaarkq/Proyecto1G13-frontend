import { endpoints } from "./endpoints";
import axios from "axios";

export const authService = {
    login: async (email, password) => {

        try {
            const response = await axios.post(endpoints.auth.login, {
                email,
                password
            });
            console.log("response", response.data);
            return response.data;
        }catch (error) {
            console.log("error", error);
            console.log("error.response", error.message);
            return error.message;
        }
    },
    me: async () => {
        const response = await axios.get(endpoints.auth.me);
        return response.data;
    },
    logout: async () => {
        const response = await axios.post(endpoints.auth.logout);
        return response.data;
    }
}