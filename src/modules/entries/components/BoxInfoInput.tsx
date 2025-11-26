import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import React from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

interface BoxInfoInputProps {
	boxCode: string;
	lote: string;
	quantidadeCaixas: string;
	ordemProducao: string;
	batelada: string;
	loading: boolean;
	codEstabel?: string;
	codDeposito?: string;
	codLocal?: string;
	onBoxCodeChange: (code: string) => void;
	onLoteChange: (lote: string) => void;
	onQuantidadeCaixasChange: (qty: string) => void;
	onOrdemProducaoChange: (ordemProducao: string) => void;
	onBateladaChange: (batelada: string) => void;
	onScanBox: () => void;
	onSearch: () => void;
	error?: string;
}

export function BoxInfoInput({
	boxCode,
	lote,
	quantidadeCaixas,
	ordemProducao,
	batelada,
	loading,
	codEstabel,
	codDeposito,
	codLocal,
	onBoxCodeChange,
	onLoteChange,
	onQuantidadeCaixasChange,
	onOrdemProducaoChange,
	onBateladaChange,
	onScanBox,
	onSearch,
	error,
}: BoxInfoInputProps) {
	const colors = useThemeColors();

	const allFieldsFilled = !!(
		codEstabel &&
		codDeposito &&
		codLocal &&
		boxCode &&
		boxCode.trim() &&
		lote &&
		lote.trim() &&
		quantidadeCaixas &&
		quantidadeCaixas.trim() &&
		ordemProducao &&
		ordemProducao.trim() &&
		batelada &&
		batelada.trim()
	);

	return (
		<View className="mb-4">
			<View className="flex-row items-center mb-3">
				<Text className="text-base font-semibold" style={{ color: colors.text }}>
					Informações da Caixa
				</Text>
			</View>

			<TouchableOpacity
				onPress={onScanBox}
				className="mb-3 p-3 rounded-lg flex-row items-center justify-center"
				style={{
					backgroundColor: colors.primary,
					minHeight: 48,
				}}
				activeOpacity={0.8}
			>
				<Ionicons name="qr-code-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
				<Text className="text-base font-semibold" style={{ color: colors.white }}>
					Ler Código da Caixa
				</Text>
			</TouchableOpacity>

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Código da Caixa *
				</Text>
				<TextInput
					value={boxCode}
					onChangeText={onBoxCodeChange}
					placeholder="Digite o código da caixa"
					placeholderTextColor={colors.textMuted}
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

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Lote *
				</Text>
				<TextInput
					value={lote}
					onChangeText={onLoteChange}
					placeholder="Digite o lote"
					placeholderTextColor={colors.textMuted}
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

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Quantidade de Caixas *
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

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Ordem de Produção *
				</Text>
				<TextInput
					value={ordemProducao}
					onChangeText={onOrdemProducaoChange}
					placeholder="Digite a ordem de produção"
					placeholderTextColor={colors.textMuted}
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

			<View className="mb-3">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Batelada *
				</Text>
				<TextInput
					value={batelada}
					onChangeText={onBateladaChange}
					placeholder="Digite a batelada"
					placeholderTextColor={colors.textMuted}
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
				disabled={loading || !allFieldsFilled}
				className="p-3 rounded-lg flex-row items-center justify-center"
				style={{
					backgroundColor: loading || !allFieldsFilled ? colors.textMuted : colors.primary,
					minHeight: 48,
					opacity: loading || !allFieldsFilled ? 0.6 : 1,
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

			{error && (
				<View className="mt-2 p-3 rounded-lg" style={{ backgroundColor: "#FFEBEE", borderWidth: 1, borderColor: "#F44336" }}>
					<Text className="text-sm" style={{ color: "#C62828" }}>
						{error}
					</Text>
				</View>
			)}
		</View>
	);
}