import { useThemeColors } from "@core/hooks/useThemeColors";
import { Text } from "@shared/components";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

interface FinalizeButtonProps {
	canFinalize: boolean;
	loading: boolean;
	onPress: () => void;
}

export function FinalizeButton({ canFinalize, loading, onPress }: FinalizeButtonProps) {
	const colors = useThemeColors();

	return (
		<View className="mb-6">
			<TouchableOpacity
				onPress={onPress}
				disabled={!canFinalize || loading}
				className="rounded-full py-4 px-6 items-center justify-center"
				style={{
					backgroundColor: canFinalize ? "#4CAF50" : colors.textMuted,
					opacity: canFinalize && !loading ? 1 : 0.5,
				}}
				activeOpacity={0.8}
			>
				{loading ? (
					<ActivityIndicator color={colors.white} />
				) : (
					<Text className="font-semibold text-base" style={{ color: colors.white }}>
						Finalizar Fracionamento
					</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}