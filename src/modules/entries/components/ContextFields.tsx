import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Select, SelectOption } from "@shared/components/Select";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";

interface ContextFieldsProps {
    establishmentOptions: SelectOption[];
    depositOptions: SelectOption[];
    locationOptions: SelectOption[];
    establishmentId?: string;
    depositId?: string;
    locationId?: string;
    onEstablishmentChange: (value: string) => void;
    onDepositChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    errors?: {
        establishment?: string;
        deposit?: string;
        location?: string;
    };
}

export function ContextFields({
    establishmentOptions,
    depositOptions,
    locationOptions,
    establishmentId,
    depositId,
    locationId,
    onEstablishmentChange,
    onDepositChange,
    onLocationChange,
    errors,
}: ContextFieldsProps) {
    const colors = useThemeColors();
    const [isVisible, setIsVisible] = useState(true);

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setIsVisible(!isVisible)}
                className="flex-row items-center justify-between mb-2"
            >
                <Text className="text-base font-semibold" style={{ color: colors.text }}>
                    Campos de Contexto
                </Text>
                <Ionicons
                    name={isVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textMuted}
                />
            </TouchableOpacity>

            {isVisible && (
                <View>
                    <Select
                        label="Estabelecimento"
                        value={establishmentId}
                        options={establishmentOptions}
                        onValueChange={onEstablishmentChange}
                        error={errors?.establishment}
                    />
                    <Select
                        label="Depósito"
                        value={depositId}
                        options={depositOptions}
                        onValueChange={onDepositChange}
                        error={errors?.deposit}
                    />
                    <Select
                        label="Localização"
                        value={locationId}
                        options={locationOptions}
                        onValueChange={onLocationChange}
                        error={errors?.location}
                    />
                </View>
            )}
        </View>
    );
}



