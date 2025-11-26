import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";
import { Select, SelectOption } from "@shared/components/Select";
import React from "react";
import { View } from "react-native";

interface ContextFieldsProps {
    depositOptions: SelectOption[];
    locationOptions: SelectOption[];
    establishmentId: string;
    depositId?: string;
    locationId?: string;
    onDepositChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    errors?: {
        deposit?: string;
        location?: string;
    };
    disabled?: boolean;
}

export function ContextFields({
    depositOptions,
    locationOptions,
    establishmentId,
    depositId,
    locationId,
    onDepositChange,
    onLocationChange,
    errors,
    disabled = false,
}: ContextFieldsProps) {
    const colors = useThemeColors();
    
    return (
        <View className="mb-4">
            <View className="mb-3">
                <Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
                    Estabelecimento
                </Text>
                <Text style={{ color: colors.text }}>{establishmentId}</Text>
            </View>
            
            {establishmentId && (
                <Select
                    label="Depósito"
                    value={depositId}
                    options={depositOptions}
                    onValueChange={onDepositChange}
                    error={errors?.deposit}
                    disabled={disabled || !establishmentId}
                />
            )}
            {depositId && (
                <Select
                    label="Localização"
                    value={locationId}
                    options={locationOptions}
                    onValueChange={onLocationChange}
                    error={errors?.location}
                    disabled={disabled || !depositId}
                />
            )}
        </View>
    );
}