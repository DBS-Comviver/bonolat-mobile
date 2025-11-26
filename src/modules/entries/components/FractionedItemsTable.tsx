import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { FractioningItem } from "../types/fractioning";
import { validateItemDetail } from "../utils/validationUtils";

interface FractionedItemsTableProps {
	items: FractioningItem[];
	onEdit: (itemId: string) => void;
	onDelete: (itemId: string) => void;
}

export function FractionedItemsTable({ items, onEdit, onDelete }: FractionedItemsTableProps) {
	const colors = useThemeColors();

	const validateItem = (item: FractioningItem) => {
		const problems: string[] = [];
		item.details.forEach((detail) => {
			problems.push(...validateItemDetail(item, detail));
		});

		const totalQuantity = item.details.reduce((sum, d) => sum + (d.quantidade || 0), 0);
		if (item.expectedQuantity > 0 && Math.abs(totalQuantity - item.expectedQuantity) > 0.0001) {
			const difference = totalQuantity - item.expectedQuantity;
			if (difference > 0) {
				problems.push(`Quantidade total (${totalQuantity.toFixed(4)}) maior que o esperado (${item.expectedQuantity.toFixed(4)}) - Diferença: +${difference.toFixed(4)}`);
			} else {
				problems.push(`Quantidade total (${totalQuantity.toFixed(4)}) menor que o esperado (${item.expectedQuantity.toFixed(4)}) - Diferença: ${difference.toFixed(4)}`);
			}
		}

		return problems;
	};

	return (
		<View className="mb-3 p-3 rounded-lg" style={{ backgroundColor: colors.backgroundLight, borderWidth: 1, borderColor: colors.border }}>
			<View className="flex-row pb-2 mb-2 border-b" style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}>
				<View style={{ flex: 3, minWidth: 120 }}>
					<Text className="text-sm font-semibold" style={{ color: colors.text }}>
						Item
					</Text>
				</View>
				<View style={{ flex: 1, minWidth: 80, alignItems: "flex-end" }}>
					<Text className="text-sm font-semibold" style={{ color: colors.text }}>
						Qtd Total
					</Text>
				</View>
				<View style={{ width: 50, alignItems: "center" }}>
					<Text className="text-sm font-semibold" style={{ color: colors.text }}>
						Status
					</Text>
				</View>
				<View style={{ width: 100, alignItems: "center" }}>
					<Text className="text-sm font-semibold" style={{ color: colors.text }}>
						Ações
					</Text>
				</View>
			</View>
			{items.map((item) => {
				const totalQuantity = item.details.reduce((sum, d) => sum + (d.quantidade || 0), 0);
				const problems = validateItem(item);
				const hasProblems = problems.length > 0;

				return (
					<View key={item.id} className="flex-row items-start py-3 border-b" style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}>
						<View style={{ flex: 3, minWidth: 120 }}>
							<Text className="text-sm font-medium" style={{ color: colors.text }}>
								{item.it_codigo}
							</Text>
							<Text className="text-xs mt-1" style={{ color: colors.textMuted }} numberOfLines={2}>
								{item.desc_item}
							</Text>
							{item.details.length > 0 && (
								<View className="mt-1">
									{item.details.map((detail, idx) => (
										<Text key={idx} className="text-xs" style={{ color: colors.textMuted }}>
											Lote {detail.cod_lote || "N/A"}: {detail.quantidade.toFixed(4)}
										</Text>
									))}
								</View>
							)}
							{item.readDate && (
								<Text className="text-xs mt-1" style={{ color: colors.textMuted }}>
									Caixa: {item.readDate}
								</Text>
							)}
							{hasProblems && (
								<View className="mt-1">
									{problems.slice(0, 2).map((problem, idx) => (
										<View key={idx} className="flex-row items-center mt-1">
											<Ionicons name="warning" size={12} color="#F44336" />
											<Text className="text-xs ml-1" style={{ color: "#F44336" }} numberOfLines={1}>
												{problem}
											</Text>
										</View>
									))}
									{problems.length > 2 && (
										<Text className="text-xs mt-1" style={{ color: "#F44336" }}>
											+{problems.length - 2} mais
										</Text>
									)}
								</View>
							)}
						</View>
						<View style={{ flex: 1, minWidth: 80, alignItems: "flex-end", justifyContent: "flex-start", paddingTop: 2 }}>
							<Text className="text-sm font-semibold" style={{ color: colors.text }}>
								{totalQuantity.toFixed(4)}
							</Text>
							{item.expectedQuantity > 0 && (
								<>
									<Text className="text-xs mt-1" style={{ color: colors.textMuted }}>
										Esperado: {item.expectedQuantity.toFixed(4)}
									</Text>
									{Math.abs(totalQuantity - item.expectedQuantity) <= 0.0001 && (
										<Text className="text-xs mt-1" style={{ color: "#4CAF50", fontWeight: "bold" }}>
											✓ Correto
										</Text>
									)}
								</>
							)}
						</View>
						<View style={{ width: 50, alignItems: "center", justifyContent: "flex-start", paddingTop: 2 }}>
							{hasProblems ? (
								<Ionicons name="alert-circle" size={24} color="#F44336" />
							) : (
								<Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
							)}
						</View>
						<View style={{ width: 100, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8, paddingTop: 2 }}>
							<TouchableOpacity onPress={() => onEdit(item.id)} className="p-2">
								<Ionicons name="create-outline" size={20} color={colors.primary} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => onDelete(item.id)} className="p-2">
								<Ionicons name="trash-outline" size={20} color={colors.error} />
							</TouchableOpacity>
						</View>
					</View>
				);
			})}
		</View>
	);
}