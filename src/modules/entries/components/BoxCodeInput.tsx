import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import React from "react";
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View } from "react-native";

interface BoxCodeInputProps {
	boxCode?: string;
	onBoxCodeChange: (code: string) => void;
	onScanPress: () => void;
	onSearchPress: () => void;
	loading?: boolean;
	error?: string;
}

export function BoxCodeInput({
	boxCode,
	onBoxCodeChange,
	onScanPress,
	onSearchPress,
	loading,
	error,
}: BoxCodeInputProps) {
	const colors = useThemeColors();

	return (
		<View className="mb-4">
			<Text className="text-base font-semibold mb-3" style={{ color: colors.text }}>
				Código da Caixa
			</Text>

			<TouchableOpacity
				onPress={onScanPress}
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

			<View className="mb-2">
				<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
					Ou digite o código da caixa:
				</Text>
				<View className="flex-row gap-2">
					<TextInput
						value={boxCode || ""}
						onChangeText={onBoxCodeChange}
						placeholder="Digite o código da caixa"
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
						onPress={() => {
							if (boxCode && boxCode.trim().length > 0) {
								onSearchPress();
							} else {
								Alert.alert("Atenção", "Digite o código da caixa");
							}
						}}
						disabled={loading}
						className="px-4 rounded-lg flex-row items-center justify-center"
						style={{
							backgroundColor: loading ? colors.textMuted : colors.primary,
							minHeight: 48,
							opacity: loading ? 0.6 : 1,
						}}
						activeOpacity={0.8}
					>
						{loading ? (
							<ActivityIndicator color={colors.white} size="small" />
						) : (
							<>
								<Ionicons name="search-outline" size={20} color={colors.white} style={{ marginRight: 4 }} />
								<Text className="text-sm font-semibold" style={{ color: colors.white }}>
									Buscar
								</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
			</View>

			{boxCode && (
				<View className="mt-2 p-3 rounded-lg" style={{ backgroundColor: colors.backgroundLight }}>
					<Text className="text-sm" style={{ color: colors.textMuted }}>
						Código da Caixa:
					</Text>
					<Text className="text-base font-semibold mt-1" style={{ color: colors.text }}>
						{boxCode}
					</Text>
				</View>
			)}
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