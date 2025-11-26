import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";
import React from "react";
import { View } from "react-native";
import { FractioningItem } from "../types/fractioning";

interface QuantityValidationProps {
	fractioningItems: FractioningItem[];
	boxItems: FractioningItem[];
}

export function QuantityValidation({ fractioningItems, boxItems }: QuantityValidationProps) {
	const colors = useThemeColors();

	const totalQuantityAllItems = fractioningItems.reduce((sum, item) => {
		const itemTotal = item.details.reduce((itemSum, detail) => itemSum + (detail.quantidade || 0), 0);
		return sum + itemTotal;
	}, 0);

	const totalExpectedQuantity = boxItems.reduce((sum, item) => sum + item.expectedQuantity, 0);
	const quantityMatches = Math.abs(totalQuantityAllItems - totalExpectedQuantity) <= 0.0001;
	const difference = totalQuantityAllItems - totalExpectedQuantity;

	return (
		<View className="mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.backgroundLight, borderWidth: 1, borderColor: colors.border }}>
			<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
				Validação de Quantidades da Caixa
			</Text>
			<View>
				<View className="flex-row justify-between mb-2">
					<Text className="text-sm" style={{ color: colors.text }}>
						Quantidade Total Esperada da Caixa:
					</Text>
					<Text className="text-sm font-semibold" style={{ color: colors.text }}>
						{totalExpectedQuantity.toFixed(4)}
					</Text>
				</View>
				<View className="flex-row justify-between mb-2">
					<Text className="text-sm" style={{ color: colors.text }}>
						Quantidade Total Informada:
					</Text>
					<Text className="text-sm font-semibold" style={{ color: colors.text }}>
						{totalQuantityAllItems.toFixed(4)}
					</Text>
				</View>
				<View className="flex-row justify-between mb-2">
					<Text className="text-sm" style={{ color: colors.text }}>
						Diferença:
					</Text>
					<Text className="text-sm font-semibold" style={{ color: quantityMatches ? "#4CAF50" : "#F44336" }}>
						{difference > 0 ? "+" : ""}{difference.toFixed(4)}
					</Text>
				</View>
				{!quantityMatches && (
					<View className="mt-2 p-3 rounded" style={{ backgroundColor: "#FFEBEE", borderWidth: 1, borderColor: "#F44336" }}>
						<Text className="text-sm font-semibold" style={{ color: "#C62828" }}>
							⚠️ Quantidade total divergente!
						</Text>
						<Text className="text-xs mt-1" style={{ color: "#C62828" }}>
							A soma de todas as quantidades informadas ({totalQuantityAllItems.toFixed(4)}) não corresponde à quantidade total esperada da caixa ({totalExpectedQuantity.toFixed(4)}).
						</Text>
						<Text className="text-xs mt-1" style={{ color: "#C62828" }}>
							Diferença: {difference > 0 ? "+" : ""}{difference.toFixed(4)}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}