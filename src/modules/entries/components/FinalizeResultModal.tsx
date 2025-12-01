import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "@core/hooks/useThemeColors";
import type { FinalizeResultModalProps } from "../types/components";
import { fractioningApi } from "../api/fractioning.api";

export function FinalizeResultModal({ visible, response, boxCode, fractioningItems, onClose }: FinalizeResultModalProps) {
	const colors = useThemeColors();
	const [boxName, setBoxName] = useState<string>("");
	const [loadingBoxName, setLoadingBoxName] = useState(false);

	useEffect(() => {
		if (visible && boxCode) {
			setLoadingBoxName(true);
			fractioningApi.getItem(boxCode)
				.then((itemInfo) => {
					setBoxName(itemInfo.desc_item || boxCode);
				})
				.catch(() => {
					setBoxName(boxCode);
				})
				.finally(() => {
					setLoadingBoxName(false);
				});
		} else {
			setBoxName("");
		}
	}, [visible, boxCode]);

	if (!response || !response.items || response.items.length === 0) {
		return null;
	}

	const allItems = fractioningItems.map((item) => {
		const responseItem = response.items.find((ri) => ri.it_codigo === item.it_codigo);
		return {
			...item,
			responseItem,
		};
	});

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View
				className="flex-1 justify-center items-center"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
			>
				<View
					className="w-11/12 max-w-md rounded-2xl p-6"
					style={{ backgroundColor: colors.inputBackground, borderColor: colors.border, borderWidth: 1 }}
				>
					<Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
						Resultado do Fracionamento
					</Text>
					
					{boxCode && (
						<View className="mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
							<Text className="text-xs mb-1" style={{ color: colors.textMuted }}>
								Código da Caixa
							</Text>
							<Text className="text-base font-semibold mb-1" style={{ color: colors.text }}>
								{boxCode}
							</Text>
							{loadingBoxName ? (
								<ActivityIndicator size="small" color={colors.primary} />
							) : (
								boxName && (
									<Text className="text-sm" style={{ color: colors.textMuted }}>
										{boxName}
									</Text>
								)
							)}
						</View>
					)}

					<ScrollView className="max-h-96 mb-4">
						{allItems.map((item, index) => (
							<View 
								key={item.id || index} 
								className="mb-3 p-3 rounded-lg" 
								style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}
							>
								<Text className="text-sm font-semibold mb-1" style={{ color: colors.text }}>
									Item: {item.it_codigo}
								</Text>
								<Text className="text-xs mb-2" style={{ color: colors.textMuted }}>
									{item.desc_item}
								</Text>
								
								{item.details && item.details.length > 0 && (
									<View className="mb-2">
										<Text className="text-xs font-semibold mb-1" style={{ color: colors.textMuted }}>
											Detalhes:
										</Text>
										{item.details.map((detail, detailIndex) => (
											<View key={detail.id || detailIndex} className="ml-2 mb-1">
												<Text className="text-xs" style={{ color: colors.textMuted }}>
													• Qtd: {detail.quantidade} | Lote: {detail.cod_lote || "-"} | Validade: {detail.validade || "-"}
												</Text>
											</View>
										))}
									</View>
								)}

								{item.responseItem && (
									<>
										<Text 
											className="text-sm mt-2" 
											style={{ 
												color: item.responseItem.mensagem?.toUpperCase().includes("OK") ? colors.success : colors.error,
												fontWeight: "600"
											}}
										>
											{item.responseItem.mensagem || "Sem mensagem"}
										</Text>
										{item.responseItem.quant_usada > 0 && (
											<Text className="text-xs mt-1" style={{ color: colors.textMuted }}>
												Quantidade usada: {item.responseItem.quant_usada}
											</Text>
										)}
									</>
								)}
							</View>
						))}
					</ScrollView>

					<TouchableOpacity
						onPress={onClose}
						className="px-4 py-3 rounded-full items-center justify-center"
						style={{
							backgroundColor: colors.primary,
							minWidth: 120,
						}}
						activeOpacity={0.8}
					>
						<Text className="font-semibold text-sm" style={{ color: colors.white }}>
							Fechar
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

