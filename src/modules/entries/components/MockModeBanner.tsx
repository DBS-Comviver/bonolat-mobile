import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import React from "react";
import { View } from "react-native";

export function MockModeBanner() {
	return (
		<View
			className="mx-4 mt-2 p-3 rounded-lg flex-row items-center"
			style={{
				backgroundColor: "#FFE5B4",
				borderWidth: 1,
				borderColor: "#FFA500",
			}}
		>
			<Ionicons name="information-circle" size={20} color="#FF8C00" style={{ marginRight: 8 }} />
			<Text className="text-sm flex-1" style={{ color: "#8B4513" }}>
				MODO MOCK ATIVO - Testando com dados simulados.
			</Text>
		</View>
	);
}