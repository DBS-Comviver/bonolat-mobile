import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

interface PrintLabelButtonProps {
	canPrint: boolean;
	loading: boolean;
	onPress: () => void;
}

export function PrintLabelButton({ canPrint, loading, onPress }: PrintLabelButtonProps) {
	const colors = useThemeColors();

	return (
		<View className="mb-4">
			<TouchableOpacity
				onPress={onPress}
				disabled={!canPrint || loading}
				className="rounded-full py-4 px-6 items-center justify-center"
				style={{
					backgroundColor: canPrint ? colors.primary : colors.textMuted,
					opacity: canPrint && !loading ? 1 : 0.5,
				}}
				activeOpacity={0.8}
			>
				{loading ? (
					<ActivityIndicator color={colors.white} />
				) : (
					<Text className="font-semibold text-base" style={{ color: colors.white }}>
						Imprimir Etiqueta
					</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}