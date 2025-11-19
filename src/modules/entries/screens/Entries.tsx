import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { DefaultLayout } from "@shared/layouts/DefaultLayout";
import { Text } from "@shared/components";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Entries() {
    const navigation = useNavigation<NavigationProp>();
    const colors = useThemeColors();

    const handleFractioningPress = () => {
        navigation.navigate("Fractioning");
    };

    const handleMenuPress = () => {
        navigation.goBack();
    };

    return (
        <DefaultLayout 
            headerTitle="Entradas"
            showMenu={true}
            onMenuPress={handleMenuPress}
        >
            <View className="flex-1 items-center justify-start px-6 pt-8">
                <TouchableOpacity
                    onPress={handleFractioningPress}
                    className="rounded-2xl items-center justify-center p-8"
                    style={{
                        backgroundColor: colors.blue[900],
                        minWidth: 200,
                        minHeight: 200,
                    }}
                    activeOpacity={0.8}
                >
                    <SimpleLineIcons
                        name="social-dropbox"
                        size={64}
                        color={colors.white}
                        style={{ marginBottom: 16 }}
                    />
                    <Text
                        className="font-semibold text-xl text-center"
                        style={{ color: colors.white }}
                    >
                        Fracionamento
                    </Text>
                </TouchableOpacity>
            </View>
        </DefaultLayout>
    );
}

