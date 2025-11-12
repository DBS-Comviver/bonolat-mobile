import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@shared/components";

interface DefaultLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    onLogout?: () => void;
}

export function DefaultLayout({ children, showHeader = true, onLogout }: DefaultLayoutProps) {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {showHeader && <Header onLogout={onLogout} />}
            <View className="flex-1">{children}</View>
        </SafeAreaView>
    );
}

