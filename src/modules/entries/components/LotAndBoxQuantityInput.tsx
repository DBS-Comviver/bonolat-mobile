import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import React from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

interface LotAndBoxQuantityInputProps {
	lote: string;
	quantidadeCaixas: string;
	loading: boolean;
	onLoteChange: (lote: string) => void;
	onQuantidadeCaixasChange: (qty: string) => void;
	onScanLot: () => void;
	onSearch: () => void;
}

export function LotAndBoxQuantityInput({
	lote,
	quantidadeCaixas,
	loading,
	onLoteChange,
	onQuantidadeCaixasChange,
	onScanLot,
	onSearch,
}: LotAndBoxQuantityInputProps) {
	const colors = useThemeColors();

	return (
		<View className="mb-4">
			<View className="flex-row items-center mb-3">
				<Text className="text-base font-semibold" style={{ color: colors.text }}>
					Lote e Quantidade de Caixas
				</Text>
			</View>

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Lote
				</Text>
				<View className="flex-row gap-2">
					<TextInput
						value={lote}
						onChangeText={onLoteChange}
						placeholder="Digite o lote"
						placeholderTextColor={colors.textMuted}
						className="flex-1"
						style={{
							backgroundColor: colors.inputBackground,
							color: colors.text,
							borderWidth: 1,
							borderColor: colors.border,
							borderRadius: 12,
							paddingHorizontal: 16,
							paddingVertical: 12,
							minHeight: 48,
							fontSize: 16,
						}}
					/>
					<TouchableOpacity
						onPress={onScanLot}
						className="p-3 rounded-lg justify-center items-center"
						style={{ backgroundColor: colors.primary, minHeight: 48 }}
					>
						<Ionicons name="qr-code-outline" size={24} color={colors.white} />
					</TouchableOpacity>
				</View>
			</View>

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Quantidade de Caixas
				</Text>
				<TextInput
					value={quantidadeCaixas}
					onChangeText={onQuantidadeCaixasChange}
					placeholder="Digite a quantidade de caixas"
					placeholderTextColor={colors.textMuted}
					keyboardType="numeric"
					className="w-full"
					style={{
						backgroundColor: colors.inputBackground,
						color: colors.text,
						borderWidth: 1,
						borderColor: colors.border,
						borderRadius: 12,
						paddingHorizontal: 16,
						paddingVertical: 12,
						minHeight: 48,
						fontSize: 16,
					}}
				/>
			</View>

			<TouchableOpacity
				onPress={onSearch}
				disabled={loading || !lote || !quantidadeCaixas}
				className="p-3 rounded-lg flex-row items-center justify-center"
				style={{
					backgroundColor: loading || !lote || !quantidadeCaixas ? colors.textMuted : colors.primary,
					minHeight: 48,
					opacity: loading || !lote || !quantidadeCaixas ? 0.6 : 1,
				}}
				activeOpacity={0.8}
			>
				{loading ? (
					<ActivityIndicator color={colors.white} size="small" />
				) : (
					<>
						<Ionicons name="search-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
						<Text className="text-base font-semibold" style={{ color: colors.white }}>
							Buscar Itens Esperados
						</Text>
					</>
				)}
			</TouchableOpacity>
		</View>
	);
}