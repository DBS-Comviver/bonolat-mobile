import { api } from "@core/api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth.d";

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/auth/login", {
            username: data.username,
            password: data.password,
        });
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>("/auth/register", data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout");
    },

    refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
        const response = await api.post<{ token: string }>("/auth/refresh", {
            refreshToken,
        });
        return response.data;
    },
};

