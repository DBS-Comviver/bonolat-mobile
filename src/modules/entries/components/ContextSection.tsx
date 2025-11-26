import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@shared/components";
import { SelectOption } from "@shared/components/Select";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ContextFields } from "./ContextFields";

interface ContextSectionProps {
	visible: boolean;
	locked: boolean;
	boxCode?: string;
	depositOptions: SelectOption[];
	locationOptions: SelectOption[];
	establishmentId: string; // Sempre "2202", fixo
	depositId?: string;
	locationId?: string;
	onDepositChange: (value: string) => void;
	onLocationChange: (value: string) => void;
	onToggleVisible: () => void;
	onLock: () => void;
	onUnlock: () => void;
}

export function ContextSection({
	visible,
	locked,
	boxCode,
	depositOptions,
	locationOptions,
	establishmentId,
	depositId,
	locationId,
	onDepositChange,
	onLocationChange,
	onToggleVisible,
	onLock,
	onUnlock,
}: ContextSectionProps) {
	const colors = useThemeColors();

	return (
		<View className="mb-4">
			{!locked && (
				<>
					<View className="flex-row items-center justify-between" style={{ marginBottom: visible ? 12 : 0 }}>
						<View className="flex-row items-center">
							<Ionicons name="filter" size={24} color="#4CAF50" style={{ marginRight: 8 }} />
							<Text className="text-base font-semibold" style={{ color: colors.text }}>
								Informações do Contexto
							</Text>
						</View>
						<TouchableOpacity onPress={onToggleVisible} className="p-2">
							<Ionicons name={visible ? "chevron-up" : "chevron-down"} size={24} color={colors.textMuted} />
						</TouchableOpacity>
					</View>

					{visible && (
						<>
							<ContextFields
								depositOptions={depositOptions}
								locationOptions={locationOptions}
								establishmentId={establishmentId}
								depositId={depositId}
								locationId={locationId}
								onDepositChange={onDepositChange}
								onLocationChange={onLocationChange}
								errors={{
									deposit: !depositId ? "Selecione o depósito" : undefined,
									location: !depositId ? "Selecione o depósito primeiro" : !locationId ? "Selecione a localização" : undefined,
								}}
								disabled={false}
							/>
							{establishmentId && depositId && locationId && (
								<TouchableOpacity
									onPress={onLock}
									className="mt-3 p-3 rounded-lg flex-row items-center justify-center"
									style={{ backgroundColor: "#4CAF50", borderWidth: 1, borderColor: "#388E3C" }}
								>
									<Ionicons name="lock-closed" size={20} color={colors.white} style={{ marginRight: 8 }} />
									<Text className="text-base font-semibold" style={{ color: colors.white }}>
										Confirmar e Fechar
									</Text>
								</TouchableOpacity>
							)}
						</>
					)}
				</>
			)}

			{locked && (
				<TouchableOpacity
					onPress={onUnlock}
					className="p-2 rounded-lg flex-row items-center justify-between"
					style={{ backgroundColor: colors.backgroundLight, borderWidth: 1, borderColor: colors.border }}
				>
					<View className="flex-row items-center">
						<Ionicons name="lock-closed" size={20} color={colors.textMuted} style={{ marginRight: 8 }} />
						<Text className="text-sm" style={{ color: colors.textMuted }}>
							Contexto: {establishmentId} / {depositId} / {locationId}
						</Text>
					</View>
					<Ionicons name="create-outline" size={20} color={colors.primary} />
				</TouchableOpacity>
			)}
		</View>
	);
}