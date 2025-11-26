import { api } from "@core/api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth.d";

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/api/auth/login", {
            username: data.username,
            password: data.password,
        });
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>("/api/auth/register", data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post("/api/auth/logout");
    },

    refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
        const response = await api.post<{ token: string }>("/api/auth/refresh", {
            refreshToken,
        });
        return response.data;
    },
};

