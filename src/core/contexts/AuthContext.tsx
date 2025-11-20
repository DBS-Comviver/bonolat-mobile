import { storageKeys } from "@core/services/storage/storageKeys";
import { storageService } from "@core/services/storage/storageService";
import { authApi } from "@modules/auth/api/auth.api";
import { User } from "@modules/auth/types/auth.d";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextProps>(
    {} as AuthContextProps
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await storageService.getItem<User>(
                storageKeys.USER
            );
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (username: string, password: string) => {
        try {
            const storedUser = await storageService.getItem<User>(
                storageKeys.USER
            );
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            try {
                await authApi.logout();
            } catch (apiError) {
                console.warn("Logout API call failed, proceeding with local logout:", apiError);
            }
            await storageService.removeItem(storageKeys.TOKEN);
            await storageService.removeItem(storageKeys.USER);
            await storageService.removeItem(storageKeys.PASSWORD);
            setUser(null);
        } catch (error) {
            console.error("Error during logout:", error);
            setUser(null);
            throw error;
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        storageService.setItem(storageKeys.USER, updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, signIn, signOut, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

