import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { SelectWithSearch, Text } from "@shared/components";
import { DateInput } from "@shared/components/DateInput";
import React from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";
import { FractioningItemResponse } from "../types/fractioning";

interface AddItemFormProps {
	visible: boolean;
	itemCode: string;
	itemInfo: FractioningItemResponse | null;
	lote: string;
	dataLote: string;
	validade: string;
	quantidade: string;
	batchOptions: Array<{ label: string; value: string }>;
	batches: Array<{ lote: string; dt_lote: string }>;
	loadingItem: boolean;
	loadingBatches: boolean;
	cod_estabel?: string;
	cod_deposito?: string;
	it_codigo?: string;
	onItemCodeChange: (code: string) => void;
	onLoteChange: (lote: string) => void;
	onDataLoteChange: (date: string) => void;
	onValidadeChange: (date: string) => void;
	onQuantidadeChange: (qty: string) => void;
	onSearchItem: () => Promise<void>;
	onLoadBatches: () => Promise<void>;
	onScanItem: () => void;
	onAddItem: () => Promise<void>;
	onClose: () => void;
	onSetItCodigo: (code: string) => void;
}

export function AddItemForm({
	visible,
	itemCode,
	itemInfo,
	lote,
	dataLote,
	validade,
	quantidade,
	batchOptions,
	batches,
	loadingItem,
	loadingBatches,
	cod_estabel,
	cod_deposito,
	it_codigo,
	onItemCodeChange,
	onLoteChange,
	onDataLoteChange,
	onValidadeChange,
	onQuantidadeChange,
	onSearchItem,
	onLoadBatches,
	onScanItem,
	onAddItem,
	onClose,
	onSetItCodigo,
}: AddItemFormProps) {
	const colors = useThemeColors();

	if (!visible) {
		return null;
	}

	return (
		<>
			<View className="flex-row items-center justify-between mb-3">
				<Text className="text-base font-semibold" style={{ color: colors.text }}>
					Adicionar Item
				</Text>
				<TouchableOpacity onPress={onClose} className="p-2">
					<Ionicons name="close" size={24} color={colors.textMuted} />
				</TouchableOpacity>
			</View>

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Item
				</Text>
				<View className="flex-row gap-2">
					<TextInput
						value={itemCode}
						onChangeText={onItemCodeChange}
						placeholder="Código do item"
						placeholderTextColor={colors.textMuted}
						className="flex-1 p-3 rounded-lg"
						style={{
							backgroundColor: colors.inputBackground,
							color: colors.text,
							borderWidth: 1,
							borderColor: colors.border,
						}}
					/>
					<TouchableOpacity
						onPress={onScanItem}
						className="p-3 rounded-lg justify-center items-center"
						style={{ backgroundColor: colors.primary, minHeight: 48 }}
					>
						<Ionicons name="qr-code-outline" size={24} color={colors.white} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={async () => {
							onSetItCodigo(itemCode);
							await onSearchItem();
						}}
						disabled={loadingItem || !itemCode}
						className="px-4 rounded-lg flex-row items-center justify-center"
						style={{
							backgroundColor: loadingItem || !itemCode ? colors.textMuted : colors.primary,
							minHeight: 48,
							opacity: loadingItem || !itemCode ? 0.6 : 1,
						}}
					>
						{loadingItem ? (
							<ActivityIndicator color={colors.white} size="small" />
						) : (
							<>
								<Ionicons name="search-outline" size={18} color={colors.white} style={{ marginRight: 4 }} />
								<Text className="text-sm font-semibold" style={{ color: colors.white }}>
									Buscar
								</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
			</View>

			{itemInfo && (
				<>
					<View className="mb-3">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Descrição do Item
						</Text>
						<TextInput
							value={itemInfo.desc_item}
							editable={false}
							className="p-3 rounded-lg"
							style={{
								backgroundColor: colors.backgroundLight || "#F5F5F5",
								color: colors.textMuted,
								borderWidth: 1,
								borderColor: colors.border,
							}}
						/>
					</View>

					<View className="mb-3">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Lote
						</Text>
						<View className="flex-row gap-2">
							<View className="flex-1">
								<SelectWithSearch
									label=""
									placeholder="Selecione ou digite o lote"
									value={lote}
									options={batchOptions}
									onValueChange={(selectedLote) => {
										onLoteChange(selectedLote);
										const selectedBatch = batches.find((b) => b.lote === selectedLote);
										if (selectedBatch) {
											onDataLoteChange(selectedBatch.dt_lote);
										}
									}}
									onManualInput={async (text) => {
										onLoteChange(text);
										if (text && text.length > 0 && cod_estabel && cod_deposito && it_codigo) {
											await onLoadBatches();
											const selectedBatch = batches.find((b) => b.lote === text);
											if (selectedBatch) {
												onDataLoteChange(selectedBatch.dt_lote);
											}
										}
									}}
									allowManualInput={true}
								/>
							</View>
						</View>
					</View>

					<View className="mb-3">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Data de Fabricação (do Lote)
						</Text>
						<DateInput
							value={dataLote}
							onChange={onDataLoteChange}
							placeholder="DD/MM/AAAA (preenchida automaticamente ou digite manualmente)"
						/>
					</View>

					<View className="mb-3">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Validade do Lote
						</Text>
						<DateInput
							value={validade}
							onChange={onValidadeChange}
							placeholder="DD/MM/AAAA"
						/>
					</View>

					<View className="mb-3">
						<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
							Quantidade
						</Text>
						<TextInput
							value={quantidade}
							onChangeText={onQuantidadeChange}
							placeholder="0,0000"
							placeholderTextColor={colors.textMuted}
							keyboardType="decimal-pad"
							className="p-3 rounded-lg"
							style={{
								backgroundColor: colors.inputBackground,
								color: colors.text,
								borderWidth: 1,
								borderColor: colors.border,
							}}
						/>
					</View>

					<TouchableOpacity
						onPress={onAddItem}
						className="mt-2 p-3 rounded-full flex-row items-center justify-center"
						style={{ backgroundColor: colors.primary }}
					>
						<Ionicons name="add-circle-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
						<Text className="text-base font-semibold" style={{ color: colors.white }}>
							Adicionar Item
						</Text>
					</TouchableOpacity>
				</>
			)}
		</>
	);
}