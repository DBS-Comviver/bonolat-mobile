import { useState } from "react";
import { authApi } from "../api/auth.api";
import { useAuth } from "@core/hooks/useAuth";
import { storageService } from "@core/services/storage/storageService";
import { storageKeys } from "@core/services/storage/storageKeys";
import { LoginRequest } from "../types/auth.d";

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();

    const login = async (data: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authApi.login(data);
            await storageService.setItem(storageKeys.TOKEN, response.token);
            await storageService.setItem(storageKeys.USER, response.user);
            await storageService.setItem(storageKeys.PASSWORD, data.password);
            await signIn(data.username, data.password);
        } catch (err: any) {
            let errorMessage = "Erro ao fazer login";
            
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 404) {
                    errorMessage = "Usuário ou senha inválidos";
                } else {
                    errorMessage = err.response.data?.message || `Erro ${err.response.status}`;
                }
            } else if (err.request) {
                errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando e se você está na mesma rede.";
            } else {
                errorMessage = err.message || "Erro desconhecido";
            }
            
            if (__DEV__) {
                console.error("Login error:", {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    code: err.code,
                });
            }
            
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}

