import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { useThemeColors } from "@core/hooks/useThemeColors";

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
    visible?: boolean;
}

export function ErrorMessage({ message, onDismiss, visible = true }: ErrorMessageProps) {
    const colors = useThemeColors();

    if (!visible || !message) {
        return null;
    }

    return (
        <View
            className="rounded-2xl px-4 py-3 mb-4 flex-row items-center"
            style={{
                backgroundColor: colors.errorBackground,
                borderWidth: 2,
                borderColor: colors.errorBorder,
            }}
        >
            <View
                className="rounded-full p-1.5 mr-3"
                style={{ backgroundColor: `${colors.errorBorder}33` }}
            >
                <Ionicons name="alert-circle" size={18} color={colors.errorLight} />
            </View>
            <Text className="flex-1 text-sm leading-5" style={{ color: colors.errorLight }}>
                {message}
            </Text>
            {onDismiss && (
                <TouchableOpacity
                    onPress={onDismiss}
                    className="ml-2"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close-circle" size={20} color={colors.errorLight} />
                </TouchableOpacity>
            )}
        </View>
    );
}

