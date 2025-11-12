import React, { useState, useEffect, useRef } from "react";
import { View, TextInput } from "react-native";
import { AuthLayout, AuthLayoutRef } from "@shared/layouts/AuthLayout";
import { Input, Button, ErrorMessage } from "@shared/components";
import { useLogin } from "../hooks/useLogin";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        username?: string;
        password?: string;
    }>({});
    const { login, loading, error } = useLogin();
    const passwordInputRef = useRef<TextInput>(null);
    const authLayoutRef = useRef<AuthLayoutRef>(null);

    useEffect(() => {
        if (error) {
            setLocalError(error);
        }
    }, [error]);

    const handleLogin = async () => {
        setLocalError(null);
        setFieldErrors({});

        const trimmedUsername = username.trimEnd();
        const trimmedPassword = password.trimEnd();

        if (trimmedUsername !== username) {
            setUsername(trimmedUsername);
        }
        if (trimmedPassword !== password) {
            setPassword(trimmedPassword);
        }

        if (!trimmedUsername || !trimmedPassword) {
            const errors: { username?: string; password?: string } = {};
            if (!trimmedUsername) errors.username = "Campo obrigatório";
            if (!trimmedPassword) errors.password = "Campo obrigatório";
            setFieldErrors(errors);
            setLocalError("Preencha todos os campos");
            return;
        }

        try {
            await login({ username: trimmedUsername, password: trimmedPassword });
        } catch (err) {
            const errorMessage = error || "Usuário ou senha inválidos";
            setLocalError(errorMessage);
        }
    };

    const handleDismissError = () => {
        setLocalError(null);
    };

    const trimEndSpaces = (text: string): string => {
        return text.replace(/\s+$/, "");
    };

    const handleUsernameChange = (text: string) => {
        const trimmedText = trimEndSpaces(text);
        setUsername(trimmedText);
        if (localError || fieldErrors.username) {
            setLocalError(null);
            setFieldErrors((prev) => ({ ...prev, username: undefined }));
        }
    };

    const handlePasswordChange = (text: string) => {
        const trimmedText = trimEndSpaces(text);
        setPassword(trimmedText);
        if (localError || fieldErrors.password) {
            setLocalError(null);
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
        }
    };

    const handlePasswordFocus = () => {
        authLayoutRef.current?.scrollToEnd();
    };

    return (
        <AuthLayout ref={authLayoutRef}>
            <View className="w-full">
                {localError && (
                    <ErrorMessage
                        message={localError}
                        onDismiss={handleDismissError}
                        visible={true}
                    />
                )}

                <Input
                    label="Usuário"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChangeText={handleUsernameChange}
                    onBlur={() => {
                        const trimmed = username.trimEnd();
                        if (trimmed !== username) {
                            setUsername(trimmed);
                        }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                    error={fieldErrors.username}
                />

                <Input
                    ref={passwordInputRef}
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={() => {
                        const trimmed = password.trimEnd();
                        if (trimmed !== password) {
                            setPassword(trimmed);
                        }
                    }}
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    onFocus={handlePasswordFocus}
                    error={fieldErrors.password}
                />

                <Button
                    title="Entrar"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={!username || !password}
                />
            </View>
        </AuthLayout>
    );
}

