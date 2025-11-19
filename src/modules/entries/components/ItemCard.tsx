import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";
interface BoxItem {
    id: string;
    code: string;
    description: string;
    expectedQuantity: number;
    readDate?: string;
    readTime?: string;
}

interface ItemCardProps {
    item: BoxItem;
    onPress?: () => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

export function ItemCard({ item, onPress, onDelete, showDelete = false }: ItemCardProps) {
    const colors = useThemeColors();

    const formatDateTime = (date?: string, time?: string) => {
        if (!date && !time) return "Não lido";
        return `${date || "00/00/0000"} - ${time || "00:00"}`;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="mb-3 p-4 rounded-2xl"
            style={{ backgroundColor: colors.blue[900] }}
        >
            <View className="flex-row items-start justify-between">
                <View className="flex-1">
                    <Text className="text-base font-semibold mb-1" style={{ color: colors.white }}>
                        {item.code} - {item.description}
                    </Text>
                    <Text className="text-sm mb-1" style={{ color: colors.white, opacity: 0.9 }}>
                        Quantidade: {item.expectedQuantity.toFixed(4)}
                    </Text>
                    <Text className="text-xs" style={{ color: colors.white, opacity: 0.8 }}>
                        Data de Leitura: {formatDateTime(item.readDate, item.readTime)}
                    </Text>
                </View>
                {showDelete && onDelete && (
                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="ml-2 p-2"
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}



