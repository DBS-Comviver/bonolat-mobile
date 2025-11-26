import { RootStackParamList } from "@/types/navigation";
import { useThemeColors } from "@core/hooks/useThemeColors";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "@shared/components";
import { DefaultLayout } from "@shared/layouts/DefaultLayout";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Entries() {
    const navigation = useNavigation<NavigationProp>();
    const colors = useThemeColors();

    const handleFractioningPress = () => {
        navigation.navigate("Fractioning");
    };

    const handleOPPress = () => {
        navigation.navigate("SearchOP");
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

                <View className="flex-row gap-4">
                    <TouchableOpacity
                        onPress={handleFractioningPress}
                        className="rounded-2xl items-center justify-center p-8"
                        style={{
                            backgroundColor: colors.blue[900],
                            minWidth: 150,
                            minHeight: 150,
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

                    <TouchableOpacity
                        onPress={handleOPPress}
                        className="rounded-2xl items-center justify-center p-8"
                        style={{
                            backgroundColor: colors.blue[900],
                            minWidth: 150,
                            minHeight: 150,
                        }}
                        activeOpacity={0.8}
                    >
                        <EvilIcons
                            name="search"
                            size={64}
                            color={colors.white}
                            style={{ marginBottom: 16 }}
                        />
                        <Text
                            className="font-semibold text-xl text-center"
                            style={{ color: colors.white }}
                        >
                            Buscar OP
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </DefaultLayout>
    );
}