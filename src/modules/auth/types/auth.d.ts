export interface User {
    login: string;
    nome: string | null;
    permissions: {
        administrador: number | null;
        financeiro: number;
        fiscal: number;
        controles: number;
        estoque: number | null;
        faturamento: number | null;
    };
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    user: User;
    token: string;
}

