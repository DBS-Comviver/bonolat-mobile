import React from "react";
import { View } from "react-native";
import { DefaultLayout } from "@shared/layouts/DefaultLayout";
import { Text } from "@shared/components";
import { useAuth } from "@core/hooks/useAuth";

function Home() {
    const { user } = useAuth();

    return (
        <DefaultLayout>
            <View className="flex-1 items-center justify-center px-6">
                <Text variant="title" className="mb-4">
                    Bem-vindo, {user?.name || "Usuário"}!
                </Text>
                <Text variant="subtitle" className="mb-8">
                    {(user as any)?.email ?? "Email não disponível"}
                </Text>
            </View>
        </DefaultLayout>
    );
}

export default Home;