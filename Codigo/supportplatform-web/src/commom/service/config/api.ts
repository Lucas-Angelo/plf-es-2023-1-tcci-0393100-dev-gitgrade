import axios from "axios";
import env from "../../config/env";
import { SessionCookieName } from "../../config/session";
import { getCookies } from "../../utils/cookies";

const api = axios.create({
    baseURL: `${env.apiUrl}/`,
});

api.interceptors.request.use((config) => {
    const cookies = getCookies<SessionCookieName>();
    const token = cookies.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
