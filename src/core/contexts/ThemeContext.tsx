import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useDeviceScheme, Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

interface ThemeContextProps {
    theme: ThemeType;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const deviceTheme = useDeviceScheme();
    const [theme, setTheme] = useState<ThemeType>(deviceTheme ?? "light");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("@theme").then((saved) => {
            if (saved && (saved === "light" || saved === "dark")) {
                setTheme(saved as ThemeType);
                Appearance.setColorScheme(saved as ThemeType);
            } else {
                Appearance.setColorScheme(deviceTheme ?? "light");
            }
            setIsInitialized(true);
        });
    }, [deviceTheme]);

    useEffect(() => {
        if (isInitialized) {
            Appearance.setColorScheme(theme);
        }
    }, [theme, isInitialized]);

    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        await AsyncStorage.setItem("@theme", newTheme);
        Appearance.setColorScheme(newTheme);
        
        if (__DEV__) {
            console.log("Theme changed to:", newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
