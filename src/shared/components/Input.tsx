import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import { NativeSyntheticEvent, Text, TextInput, TextInputFocusEventData, TextInputProps, TouchableOpacity, View } from "react-native";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    secureTextEntry?: boolean;
}

export const Input = forwardRef<any, InputProps>(
    ({ label, error, secureTextEntry, onFocus, onBlur, style, ...props }, ref) => {
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const [isFocused, setIsFocused] = useState(false);
        const colors = useThemeColors();

        const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        const containerStyle = style && (style as any).marginBottom === 0 ? { marginBottom: 0 } : undefined;

        return (
            <View className="mb-4" style={containerStyle}>
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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