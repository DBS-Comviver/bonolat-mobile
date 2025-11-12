import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@shared/components";
import { colors } from "@shared/constants/colors";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export interface AuthLayoutRef {
    scrollToEnd: () => void;
}

export const AuthLayout = forwardRef<AuthLayoutRef, AuthLayoutProps>(
    ({ children }, ref) => {
        const scrollViewRef = useRef<ScrollView>(null);

        useImperativeHandle(ref, () => ({
            scrollToEnd: () => {
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            },
        }));

        return (
            <SafeAreaView
                className="flex-1"
                style={{ backgroundColor: colors.authDark }}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <View className="items-center pt-8 pb-8">
                            <Logo type="client" />
                        </View>


                        <View className="w-full">
                            {children}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View className="items-center pb-6">
                    <Logo type="comviver" />
                </View>
            </SafeAreaView>
        );
    }
);

AuthLayout.displayName = "AuthLayout";

