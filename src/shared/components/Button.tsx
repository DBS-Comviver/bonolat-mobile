import React from "react";
import { TouchableOpacity, ActivityIndicator, ViewStyle } from "react-native";
import { Text } from "./Text";
import { useThemeColors } from "@core/hooks/useThemeColors";

interface ButtonProps {
    title: string;
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline";
    style?: ViewStyle;
}

export function Button({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = "primary",
    style,
}: ButtonProps) {
    const colors = useThemeColors();

    const getBackgroundColor = () => {
        if (variant === "outline") return "transparent";
        return variant === "primary" ? colors.primary : colors.secondary;
    };

    const getTextColor = () => {
        return variant === "outline" ? colors.text : colors.white;
    };

    const getBorderColor = () => {
        return variant === "outline" ? colors.text : "transparent";
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className="rounded-full py-4 px-6 items-center justify-center"
            style={{
                backgroundColor: getBackgroundColor(),
                borderWidth: variant === "outline" ? 2 : 0,
                borderColor: getBorderColor(),
                opacity: disabled || loading ? 0.5 : 1,
                ...style,
            }}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text className="font-semibold text-base" style={{ color: getTextColor() }}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}
