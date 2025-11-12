import React from "react";
import { TextInput } from "react-native";
import { cssInterop } from "nativewind";
import "../global.css";
import "@core/api/interceptors";
import { ThemeProvider } from "@core/contexts/ThemeContext";
import { AuthProvider } from "@core/contexts/AuthContext";
import RootNavigator from "@navigation/RootNavigator";

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
