import React, { createContext, useState, useEffect, ReactNode } from "react";
import { storageService } from "@core/services/storage/storageService";
import { storageKeys } from "@core/services/storage/storageKeys";
import { User } from "@modules/auth/types/auth.d";

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
            await storageService.removeItem(storageKeys.TOKEN);
            await storageService.removeItem(storageKeys.USER);
            await storageService.removeItem(storageKeys.PASSWORD);
            setUser(null);
        } catch (error) {
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

