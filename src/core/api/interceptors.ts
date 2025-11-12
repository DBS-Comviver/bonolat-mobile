import { api } from "./api";
import { storageService } from "@core/services/storage/storageService";
import { storageKeys } from "@core/services/storage/storageKeys";

api.interceptors.request.use(
    async (config) => {
        const token = await storageService.getItem(storageKeys.TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await storageService.removeItem(storageKeys.TOKEN);
            await storageService.removeItem(storageKeys.USER);
        }
        return Promise.reject(error);
    }
);

