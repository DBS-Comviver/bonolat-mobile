import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DefaultLayout } from "@shared/layouts/DefaultLayout";
import { Text } from "@shared/components";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Fractionation() {
    const navigation = useNavigation<NavigationProp>();

    const handleMenuPress = () => {
        navigation.goBack();
    };

    return (
        <DefaultLayout 
            headerTitle="Fracionamento"
            showMenu={true}
            onMenuPress={handleMenuPress}
        >
            <View className="flex-1 items-center justify-start px-6 pt-8">
                <Text variant="title" className="mb-4">
                    Fracionamento
                </Text>
                <Text variant="subtitle">
                    Tela de fracionamento em desenvolvimento
                </Text>
            </View>
        </DefaultLayout>
    );
}

