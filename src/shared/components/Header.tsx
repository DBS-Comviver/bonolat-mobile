import { useAuth } from "@core/hooks/useAuth";
import { useTheme } from "@core/hooks/useTheme";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Logo } from "./Logo";

interface HeaderProps {
    showLogout?: boolean;
    showThemeToggle?: boolean;
    title?: string;
    showMenu?: boolean;
    onMenuPress?: () => void;
    onLogout?: () => void;
}

export function Header({ 
    showLogout = true, 
    showThemeToggle = true, 
    title,
    showMenu = false,
    onMenuPress,
    onLogout 
}: HeaderProps) {
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
            <View className="flex-1 flex-row items-center">
                {showMenu ? (
                    <TouchableOpacity
                        onPress={onMenuPress}
                        className="p-2.5 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: theme === "light"
                                ? `${colors.white}20`
                                : `${colors.gray[800]}20`,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="grid-outline"
                            size={22}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                ) : (
                    <Logo type="comviver" width={60} height={40} />
                )}
            </View>

            {title && (
                <View className="flex-1 items-center absolute left-0 right-0">
                    <Text 
                        className="text-2xl font-semibold"
                        style={{ color: colors.primary, fontSize: 24 }}
                    >
                        {title}
                    </Text>
                </View>
            )}

            <View className="flex-row items-center" style={{ gap: 12 }}>
                {showThemeToggle && !title && (
                    <TouchableOpacity
                        onPress={toggleTheme}
                        className="p-2.5 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: theme === "light"
                                ? `${colors.white}20`
                                : `${colors.gray[800]}20`,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={theme === "light" ? "moon-outline" : "sunny-outline"}
                            size={22}
                            color={colors.white}
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
                                : `${colors.gray[800]}20`,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={22}
                            color={colors.error}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

