import React, { useState, forwardRef } from "react";
import { TextInput, TextInputProps, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@core/hooks/useThemeColors";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    secureTextEntry?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
    ({ label, error, secureTextEntry, ...props }, ref) => {
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const [isFocused, setIsFocused] = useState(false);
        const colors = useThemeColors();

        return (
            <View className="mb-4">
                {label && (
                    <Text className="mb-2 text-base" style={{ color: colors.white }}>
                        {label}
                    </Text>
                )}
                <View
                    className="bg-input-background-light dark:bg-input-background-dark rounded-full px-5 py-3 flex-row items-center"
                    style={{
                        backgroundColor: colors.inputBackground,
                        borderWidth: isFocused ? 2 : 0,
                        borderColor: error ? colors.errorBorder : isFocused ? colors.borderFocus : "transparent",
                    }}
                >
                    <TextInput
                        ref={ref}
                        className="flex-1 text-base"
                        style={{ color: colors.inputText }}
                        placeholderTextColor={colors.inputPlaceholder}
                        secureTextEntry={secureTextEntry && !isPasswordVisible}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                    {secureTextEntry && (
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="ml-2"
                        >
                            <Ionicons
                                name={isPasswordVisible ? "eye-off" : "eye"}
                                size={20}
                                color={colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {error && (
                    <Text className="text-sm mt-1" style={{ color: colors.errorLight }}>
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

Input.displayName = "Input";

