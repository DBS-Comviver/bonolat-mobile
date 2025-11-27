import "@core/api/interceptors";
import { AuthProvider } from "@core/contexts/AuthContext";
import { ThemeProvider } from "@core/contexts/ThemeContext";
import RootNavigator from "@navigation/RootNavigator";
import { cssInterop } from "nativewind";
import React from "react";
import { TextInput } from "react-native";
import "../global.css";

cssInterop(TextInput, {
    className: "style",
});

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </ThemeProvider>
    );
}
