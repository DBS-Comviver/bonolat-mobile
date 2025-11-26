import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { FractioningItem } from "../types/fractioning";
import { BoxItemForm } from "./BoxItemForm";

interface BoxItemsListProps {
	boxItems: FractioningItem[];
	fractioningItems: FractioningItem[];
	itemFields: Record<string, Array<{
		id: string;
		quantidade: string;
		lote: string;
		validade: string;
		dataFabricacao: string;
		itemCode?: string;
		added?: boolean;
		editingDetailId?: string;
		editingItemId?: string;
	}>>;
	expandedItemId: string | null;
	onFieldsChange: (itemId: string, fields: any) => void;
	onToggleExpand: (itemId: string | null) => void;
	onScanItem: (itemId: string, formId?: string) => void;
	onConfirm: (item: FractioningItem, fields: any, formId?: string) => Promise<void>;
	onAddAgain?: (itemId: string) => void;
}

export function BoxItemsList({
	boxItems,
	fractioningItems,
	itemFields,
	expandedItemId,
	onFieldsChange,
	onToggleExpand,
	onScanItem,
	onConfirm,
	onAddAgain,
}: BoxItemsListProps) {
	const colors = useThemeColors();

	return (
		<View className="mb-4">
			<Text className="text-base font-semibold mb-3" style={{ color: colors.text }}>
				Itens da Caixa ({boxItems.length})
			</Text>
			<Text className="text-sm mb-3" style={{ color: colors.textMuted }}>
				Preencha as informações de cada item: Quantidade, Lote, Validade do Lote e Data de Fabricação
			</Text>
			<View className="mb-3 p-3 rounded-lg" style={{ backgroundColor: colors.backgroundLight, borderWidth: 1, borderColor: colors.border }}>
				{boxItems.map((item) => {
					const forms = itemFields[item.id] || [];
					const isExpanded = expandedItemId === item.id;
					const itemInFractioning = fractioningItems.find(fi => fi.it_codigo === item.it_codigo);
					const isItemAdded = !!itemInFractioning;
					const isValidated = itemInFractioning?.validationStatus === "valid";
					const canEdit = !isItemAdded || isValidated || forms.length > 0;

					const displayForms = forms;

					return (
						<View key={item.id} className="mb-4 pb-4 border-b" style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}>
							<TouchableOpacity
								onPress={() => canEdit && onToggleExpand(isExpanded ? null : item.id)}
								disabled={!canEdit}
								className="flex-row justify-between items-start"
								style={{ opacity: canEdit ? 1 : 0.5 }}
							>
								<View className="flex-1">
									<Text className="text-sm font-semibold" style={{ color: colors.text }}>
										{item.it_codigo} - {item.desc_item}
									</Text>
									<Text className="text-xs mt-1" style={{ color: colors.textMuted }}>
										Quantidade Esperada (total do código): {item.expectedQuantity.toFixed(4)}
									</Text>
								</View>
								<Ionicons
									name={isExpanded ? "chevron-up" : "chevron-down"}
									size={20}
									color={colors.textMuted}
									style={{ marginLeft: 8 }}
								/>
							</TouchableOpacity>

							{isExpanded && canEdit && displayForms.length > 0 && displayForms.map((form, index) => (
								<BoxItemForm
									key={form.id}
									item={item}
									fields={form}
									formIndex={index}
									totalForms={displayForms.length}
									isExpanded={isExpanded}
									canEdit={canEdit}
									onFieldsChange={(newFields) => {
										const updatedForms = displayForms.map(f => f.id === form.id ? newFields : f);
										onFieldsChange(item.id, updatedForms);
									}}
									onScanItem={async () => {
										await onScanItem(item.id, form.id);
									}}
									onConfirm={async () => {
										await onConfirm(item, form, form.id);
									}}
									onAddAgain={onAddAgain ? () => onAddAgain(item.id) : undefined}
									onRemoveForm={displayForms.length > 1 ? () => {
										const updatedForms = displayForms.filter(f => f.id !== form.id);
										onFieldsChange(item.id, updatedForms);
									} : undefined}
								/>
							))}
						</View>
					);
				})}
			</View>
		</View>
	);
}