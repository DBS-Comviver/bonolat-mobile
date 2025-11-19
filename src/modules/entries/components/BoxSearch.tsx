import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@shared/components/Input";
import { Button } from "@shared/components/Button";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";

interface BoxSearchProps {
    code: string;
    description: string;
    quantity: number;
    onCodeChange: (code: string) => void;
    onManualSearch: () => void;
    onQRCodeScan: () => void;
    loading?: boolean;
    error?: string;
}

export function BoxSearch({
    code,
    description,
    quantity,
    onCodeChange,
    onManualSearch,
    onQRCodeScan,
    loading = false,
    error,
}: BoxSearchProps) {
    const colors = useThemeColors();

    return (
        <View className="mb-4">
            <Text className="text-base font-semibold mb-3" style={{ color: colors.text }}>
                Busca do Item (Caixa)
            </Text>

            <View className="mb-3">
                <Input
                    label="Código da Caixa"
                    placeholder="Digite o código ou escaneie"
                    value={code}
                    onChangeText={onCodeChange}
                    onSubmitEditing={onManualSearch}
                    error={error}
                    returnKeyType="search"
                />
            </View>

            <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                    <Button
                        title="Ler Código da Caixa"
                        onPress={onQRCodeScan}
                        variant="outline"
                        loading={loading}
                    />
                </View>
            </View>

            {description && (
                <View className="mb-3 p-4 rounded-2xl" style={{ backgroundColor: colors.backgroundLight }}>
                    <Text className="text-sm mb-1" style={{ color: colors.textMuted }}>
                        Descrição
                    </Text>
                    <Text className="text-base font-semibold" style={{ color: colors.text }}>
                        {description}
                    </Text>
                    {quantity > 0 && (
                        <>
                            <Text className="text-sm mt-2 mb-1" style={{ color: colors.textMuted }}>
                                Quantidade Disponível
                            </Text>
                            <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                                {quantity.toFixed(4)}
                            </Text>
                        </>
                    )}
                </View>
            )}
        </View>
    );
}



