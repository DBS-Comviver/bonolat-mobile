import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "./Logo";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { useAuth } from "@core/hooks/useAuth";
import { useTheme } from "@core/hooks/useTheme";

interface HeaderProps {
    showLogout?: boolean;
    showThemeToggle?: boolean;
    onLogout?: () => void;
}

export function Header({ showLogout = true, showThemeToggle = true, onLogout }: HeaderProps) {
    const colors = useThemeColors();
    const { signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            signOut();
        }
    };

    return (
        <View
            className="flex-row items-center justify-between px-5 py-4"
            style={{
                backgroundColor: colors.headerBackground,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
            }}
        >
            <View className="flex-1">
                <Logo type="comviver" width={100} height={40} />
            </View>

            <View className="flex-row items-center" style={{ gap: 12 }}>
                {showThemeToggle && (
                    <TouchableOpacity
                        onPress={toggleTheme}
                        className="p-2.5 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: theme === "light" 
                                ? `${colors.white}20` 
                                : colors.backgroundLight,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={theme === "light" ? "moon-outline" : "sunny-outline"}
                            size={22}
                            color={theme === "light" ? colors.white : colors.text}
                        />
                    </TouchableOpacity>
                )}

                {showLogout && (
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="p-2.5 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: theme === "light"
                                ? `${colors.white}20`
                                : colors.errorBackground,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name="log-out-outline" 
                            size={22} 
                            color={theme === "light" ? colors.white : colors.error} 
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

