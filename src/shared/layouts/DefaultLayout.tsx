import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@shared/components";

interface DefaultLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    headerTitle?: string;
    showMenu?: boolean;
    onMenuPress?: () => void;
    onLogout?: () => void;
}

export function DefaultLayout({ 
    children, 
    showHeader = true, 
    headerTitle,
    showMenu = false,
    onMenuPress,
    onLogout 
}: DefaultLayoutProps) {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {showHeader && (
                <Header 
                    title={headerTitle}
                    showMenu={showMenu}
                    onMenuPress={onMenuPress}
                    onLogout={onLogout} 
                />
            )}
            <View className="flex-1">{children}</View>
        </SafeAreaView>
    );
}

