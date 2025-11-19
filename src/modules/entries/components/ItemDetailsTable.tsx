import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@shared/components/Input";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";
interface ItemDetail {
    id: string;
    quantity: number;
    lot?: string;
    lotValidity?: string;
    fabricationDate?: string;
}

interface ItemDetailsTableProps {
    itemCode: string;
    itemDescription: string;
    expectedQuantity: number;
    details: ItemDetail[];
    onDetailsChange: (details: ItemDetail[]) => void;
    onAddDetail: () => void;
    onDeleteDetail: (id: string) => void;
    onQRCodeScan?: () => void;
    errors?: {
        quantity?: string;
        lot?: string;
        lotValidity?: string;
        fabricationDate?: string;
    };
}

export function ItemDetailsTable({
    itemCode,
    itemDescription,
    expectedQuantity,
    details,
    onDetailsChange,
    onAddDetail,
    onDeleteDetail,
    onQRCodeScan,
    errors,
}: ItemDetailsTableProps) {
    const colors = useThemeColors();

    const updateDetail = (id: string, field: keyof ItemDetail, value: string | number) => {
        const updated = details.map((detail) =>
            detail.id === id ? { ...detail, [field]: value } : detail
        );
        onDetailsChange(updated);
    };

    const totalQuantity = details.reduce((sum, detail) => sum + (detail.quantity || 0), 0);
    const quantityDifference = expectedQuantity - totalQuantity;
    const hasQuantityError = Math.abs(quantityDifference) > 0.0001;

    return (
        <View className="mb-4">
            <View className="mb-3 p-4 rounded-2xl" style={{ backgroundColor: colors.backgroundLight }}>
                <Text className="text-base font-semibold mb-1" style={{ color: colors.text }}>
                    {itemCode} - {itemDescription}
                </Text>
                <Text className="text-sm" style={{ color: colors.textMuted }}>
                    Quantidade Esperada: {expectedQuantity.toFixed(4)}
                </Text>
                <Text
                    className="text-sm mt-1"
                    style={{
                        color: hasQuantityError ? colors.error : colors.success,
                        fontWeight: "600",
                    }}
                >
                    Total Informado: {totalQuantity.toFixed(4)}
                    {hasQuantityError && ` (Diferença: ${quantityDifference.toFixed(4)})`}
                </Text>
            </View>

            {onQRCodeScan && (
                <TouchableOpacity
                    onPress={onQRCodeScan}
                    className="mb-3 p-3 rounded-full flex-row items-center justify-center"
                    style={{ backgroundColor: colors.backgroundLight, borderWidth: 1, borderColor: colors.border }}
                >
                    <Ionicons name="qr-code-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                    <Text className="text-base" style={{ color: colors.primary }}>
                        Ler Código dos Itens da Caixa
                    </Text>
                </TouchableOpacity>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    <View className="flex-row mb-2 pb-2 border-b" style={{ borderBottomColor: colors.border }}>
                        <View style={{ width: 80 }}>
                            <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                                Qtd
                            </Text>
                        </View>
                        <View style={{ width: 120 }}>
                            <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                                Lote
                            </Text>
                        </View>
                        <View style={{ width: 120 }}>
                            <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                                Val Lote
                            </Text>
                        </View>
                        <View style={{ width: 120 }}>
                            <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                                Dt Fab
                            </Text>
                        </View>
                        <View style={{ width: 50 }} />
                    </View>

                    {details.map((detail, index) => (
                        <View key={detail.id} className="flex-row items-center mb-2">
                            <View style={{ width: 80, marginRight: 8 }}>
                                <Input
                                    placeholder="0,0000"
                                    value={detail.quantity?.toString() || ""}
                                    onChangeText={(text) => {
                                        const num = parseFloat(text.replace(",", ".")) || 0;
                                        updateDetail(detail.id, "quantity", num);
                                    }}
                                    keyboardType="decimal-pad"
                                    error={index === 0 ? errors?.quantity : undefined}
                                />
                            </View>
                            <View style={{ width: 120, marginRight: 8 }}>
                                <Input
                                    placeholder="Lote"
                                    value={detail.lot || ""}
                                    onChangeText={(text) => updateDetail(detail.id, "lot", text)}
                                    error={index === 0 ? errors?.lot : undefined}
                                />
                            </View>
                            <View style={{ width: 120, marginRight: 8 }}>
                                <Input
                                    placeholder="DD/MM/AAAA"
                                    value={detail.lotValidity || ""}
                                    onChangeText={(text) => updateDetail(detail.id, "lotValidity", text)}
                                    error={index === 0 ? errors?.lotValidity : undefined}
                                />
                            </View>
                            <View style={{ width: 120, marginRight: 8 }}>
                                <Input
                                    placeholder="DD/MM/AAAA"
                                    value={detail.fabricationDate || ""}
                                    onChangeText={(text) => updateDetail(detail.id, "fabricationDate", text)}
                                    error={index === 0 ? errors?.fabricationDate : undefined}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => onDeleteDetail(detail.id)}
                                className="p-2"
                            >
                                <Ionicons name="trash-outline" size={20} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity
                        onPress={onAddDetail}
                        className="mt-2 p-3 rounded-full flex-row items-center justify-center"
                        style={{ backgroundColor: colors.backgroundLight, borderWidth: 1, borderColor: colors.border }}
                    >
                        <Ionicons name="add-circle-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text className="text-base" style={{ color: colors.primary }}>
                            Adicionar Linha
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}



