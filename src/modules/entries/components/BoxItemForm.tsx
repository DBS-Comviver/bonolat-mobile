import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import { DateInput } from "@shared/components/DateInput";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { FractioningItem } from "../types/fractioning";

interface BoxItemFormProps {
	item: FractioningItem;
	fields: {
		id: string;
		quantidade: string;
		lote: string;
		validade: string;
		dataFabricacao: string;
		itemCode?: string;
		added?: boolean;
		editingDetailId?: string;
		editingItemId?: string;
	};
	formIndex?: number;
	totalForms?: number;
	isExpanded: boolean;
	canEdit: boolean;
	onFieldsChange: (fields: BoxItemFormProps["fields"]) => void;
	onScanItem: () => Promise<void>;
	onConfirm: () => Promise<void>;
	onAddAgain?: () => void;
	onRemoveForm?: () => void;
}

export function BoxItemForm({
	item,
	fields,
	formIndex = 0,
	totalForms = 1,
	isExpanded,
	canEdit,
	onFieldsChange,
	onScanItem,
	onConfirm,
	onAddAgain,
	onRemoveForm,
}: BoxItemFormProps) {
	const colors = useThemeColors();

	return (
		<View className="mb-4 pb-4 border-b" style={{ borderBottomColor: colors.border, borderBottomWidth: formIndex < (totalForms - 1) ? 1 : 0 }}>
			{totalForms > 1 && (
				<View className="mb-2 flex-row items-center justify-between">
					<Text className="text-sm font-semibold" style={{ color: colors.text }}>
						Formulário {formIndex + 1} de {totalForms}
					</Text>
					{onRemoveForm && (
						<TouchableOpacity
							onPress={onRemoveForm}
							className="p-2"
						>
							<Ionicons name="close-circle" size={24} color={colors.error} />
						</TouchableOpacity>
					)}
				</View>
			)}

			{isExpanded && canEdit && (
				<View className="mt-3">
					<TouchableOpacity
						onPress={onScanItem}
						className="mb-4 p-3 rounded-lg flex-row items-center justify-center"
						style={{ backgroundColor: colors.primary }}
					>
						<Ionicons name="qr-code-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
						<Text className="text-sm font-semibold" style={{ color: colors.white }}>
							Ler Código do Item
						</Text>
					</TouchableOpacity>

					<View className="mb-4">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Código do Item
						</Text>
						<TextInput
							value={fields.itemCode || item.it_codigo}
							onChangeText={(text: string) => onFieldsChange({ ...fields, itemCode: text })}
							placeholder="Digite o código do item"
							placeholderTextColor={colors.textMuted}
							editable={canEdit}
							className="w-full"
							style={{
								backgroundColor: canEdit ? colors.inputBackground : colors.backgroundLight,
								color: colors.text,
								borderWidth: 1,
								borderColor: colors.border,
								borderRadius: 12,
								paddingHorizontal: 16,
								paddingVertical: 12,
								minHeight: 48,
								fontSize: 16,
								opacity: canEdit ? 1 : 0.6,
							}}
						/>
					</View>

					<View className="mb-4">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Quantidade *
						</Text>
						<TextInput
							value={fields.quantidade}
							onChangeText={(text: string) => onFieldsChange({ ...fields, quantidade: text })}
							placeholder="0,0000"
							placeholderTextColor={colors.textMuted}
							keyboardType="decimal-pad"
							editable={canEdit}
							className="rounded-lg text-base"
							style={{
								backgroundColor: canEdit ? colors.inputBackground : colors.backgroundLight,
								color: colors.text,
								borderWidth: 1,
								borderColor: colors.border,
								paddingHorizontal: 16,
								paddingVertical: 12,
								opacity: canEdit ? 1 : 0.6,
								minHeight: 48,
							}}
						/>
					</View>

					<View className="mb-4">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Lote *
						</Text>
						<TextInput
							value={fields.lote}
							onChangeText={(text: string) => onFieldsChange({ ...fields, lote: text })}
							placeholder="Digite o lote"
							placeholderTextColor={colors.textMuted}
							editable={canEdit}
							className="w-full"
							style={{
								backgroundColor: canEdit ? colors.inputBackground : colors.backgroundLight,
								color: colors.text,
								borderWidth: 1,
								borderColor: colors.border,
								borderRadius: 12,
								paddingHorizontal: 16,
								paddingVertical: 12,
								minHeight: 48,
								fontSize: 16,
								opacity: canEdit ? 1 : 0.6,
							}}
						/>
					</View>

					<View className="mb-4">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Validade do Lote *
						</Text>
						<DateInput
							value={fields.validade}
							onChange={(date) => onFieldsChange({ ...fields, validade: date })}
							placeholder="DD/MM/AAAA"
						/>
					</View>

					<View className="mb-4">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Data de Fabricação (do Lote)
						</Text>
						<DateInput
							value={fields.dataFabricacao}
							onChange={(date) => onFieldsChange({ ...fields, dataFabricacao: date })}
							placeholder="DD/MM/AAAA"
						/>
					</View>

					<View className="mt-2 flex-row gap-2">
						{!fields.added && (
							<TouchableOpacity
								onPress={onConfirm}
								className="flex-1 p-3 rounded-lg flex-row items-center justify-center"
								style={{ backgroundColor: colors.primary }}
							>
								<Ionicons name="checkmark-circle-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
								<Text className="text-base font-semibold" style={{ color: colors.white }}>
									Confirmar
								</Text>
							</TouchableOpacity>
						)}
						{fields.added && (
							<View className="flex-1 p-3 rounded-lg items-center justify-center" style={{ backgroundColor: colors.backgroundLight, borderWidth: 1, borderColor: colors.border }}>
								<Text className="text-sm text-center" style={{ color: colors.textMuted }}>
									Confirmado
								</Text>
							</View>
						)}
						{!fields.added && onAddAgain && (
							<TouchableOpacity
								onPress={onAddAgain}
								className="p-3 rounded-lg flex-row items-center justify-center"
								style={{ backgroundColor: colors.primary }}
							>
								<Ionicons name="add-circle-outline" size={20} color={colors.white} />
							</TouchableOpacity>
						)}
					</View>
				</View>
			)}
		</View>
	);
}