import React from "react";
import { View } from "react-native";
import { AuthLayout } from "@shared/layouts/AuthLayout";
import { Text } from "@shared/components";

export function Register() {
    return (
        <AuthLayout>
            <View className="w-full">
                <Text variant="title">Register</Text>
            </View>
        </AuthLayout>
    );
}

