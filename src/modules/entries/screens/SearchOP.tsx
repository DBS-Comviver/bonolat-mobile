import { RootStackParamList } from "@/types/navigation";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "@shared/components";
import { DefaultLayout } from "@shared/layouts/DefaultLayout";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { FilterSelect, PrintLabelButton } from "../components";
import { useSearchOP } from "../hooks/useSearchOP";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function SearchOP() {
    const navigation = useNavigation<NavigationProp>();
    const colors = useThemeColors();
	const [filterCollapsed, setFilterCollapsed] = useState<boolean>(false);
	const {
		ordemProducao,
		batelada,
		setOrdemProducao,
		setBatelada,
		orderOptions,
		bateladaOptions,
		loadingFilters,
		boxes,
		loadingBoxes,
		canSearch,
		expandedBoxCode,
		toggleBox,
		boxMaterials,
		loadingMaterials,
		handleSearch,
		handleClearFilters,
		selectedPrintBox,
		showPrintModal,
		labelQuantity,
		setLabelQuantity,
		loadingPrint,
		openPrintForBox,
		handleCancelPrint,
		handleConfirmPrint,
	} = useSearchOP();

    const handleMenuPress = () => {
        navigation.goBack();
    };

    return (
		<DefaultLayout headerTitle="Consulta OP" showMenu={true} onMenuPress={handleMenuPress}>
			<ScrollView
				contentContainerStyle={{ padding: 16 }}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<View
					className="mb-4 rounded-2xl border px-4 py-3"
					style={{ borderColor: colors.border, backgroundColor: colors.inputBackground }}
				>
					<TouchableOpacity
						className="flex-row items-center justify-between"
						onPress={() => setFilterCollapsed(!filterCollapsed)}
					>
						<Text className="text-base font-semibold" style={{ color: colors.text }}>
							Filtros
						</Text>
						<Ionicons
							name={filterCollapsed ? "chevron-down-outline" : "chevron-up-outline"}
							size={20}
							color={colors.text}
						/>
					</TouchableOpacity>
					{!filterCollapsed && (
						<View className="mt-2 space-y-4">
							<FilterSelect
								label="Ordem de Produção"
								value={ordemProducao}
								options={orderOptions}
								onChange={setOrdemProducao}
								placeholder="Selecione ou digite a OP"
								disabled={loadingFilters}
							/>
							<FilterSelect
								label="Batelada"
								value={batelada}
								options={bateladaOptions}
								onChange={setBatelada}
								placeholder="Selecione ou digite a batelada"
								disabled={loadingFilters}
							/>
							<View className="flex-row items-center justify-between mt-5 space-x-4">
								<TouchableOpacity
									onPress={handleClearFilters}
									className="px-4 py-2 rounded-full border"
									style={{ borderColor: colors.border }}
								>
									<Text className="text-xs font-semibold" style={{ color: colors.primary }}>
										Limpar
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleSearch}
									disabled={!canSearch || loadingBoxes}
									className="px-4 py-2 rounded-full items-center justify-center"
									style={{
										backgroundColor: canSearch ? colors.primary : colors.textMuted,
										opacity: canSearch && !loadingBoxes ? 1 : 0.6,
										minWidth: 110,
									}}
								>
									{loadingBoxes ? (
										<ActivityIndicator color={colors.white} size="small" />
									) : (
										<Text className="text-xs font-semibold" style={{ color: colors.white }}>
											Filtrar
										</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>
					)}
				</View>

				{loadingBoxes && boxes.length === 0 ? (
					<View className="items-center mt-6">
						<ActivityIndicator color={colors.primary} />
					</View>
				) : boxes.length === 0 ? (
					<View className="mt-8 items-center">
						<Text className="text-sm" style={{ color: colors.textMuted }}>
							Informe os filtros e toque em Filtrar para ver as caixas
						</Text>
					</View>
				) : (
					boxes.map((box) => {
						const isExpanded = expandedBoxCode === box.box_code;
						const materials = boxMaterials[box.box_code] || [];
						const isLoadingMaterials = loadingMaterials[box.box_code];
						const canPrint = !!(box.cod_estabel && box.cod_deposito && box.cod_local);

						return (
							<View
								key={box.box_code}
								className="mb-4 rounded-2xl border px-4 py-3"
								style={{ borderColor: colors.border, backgroundColor: colors.inputBackground }}
							>
								<TouchableOpacity onPress={() => toggleBox(box.box_code)} activeOpacity={0.8}>
									<View className="flex-row items-center justify-between">
										<View className="flex-1 pr-3">
											<Text className="text-base font-semibold" style={{ color: colors.text }}>
												{box.box_code} - {box.box_description}
											</Text>
											<Text className="text-xs" style={{ color: colors.textMuted }}>
												Lote {box.lote} · Data {box.data_lote ?? "--"}
											</Text>
										</View>
										<Ionicons
											name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
											size={20}
											color={colors.text}
										/>
									</View>
									<Text className="text-sm mt-2" style={{ color: colors.text }}>
										Quantidade: {box.quantidade?.toFixed ? box.quantidade?.toFixed(2) : box.quantidade ?? "--"}
									</Text>
									<Text className="text-xs" style={{ color: colors.textMuted }}>
										Dep: {box.cod_deposito ?? "--"} · Local: {box.cod_local ?? "--"}
									</Text>
								</TouchableOpacity>

								{isExpanded && (
									<View className="mt-3 space-y-3">
										{isLoadingMaterials ? (
											<View className="items-center">
												<ActivityIndicator color={colors.primary} />
											</View>
										) : materials.length === 0 ? (
											<Text className="text-sm" style={{ color: colors.textMuted }}>
												Nenhuma matéria-prima encontrada para esta caixa.
											</Text>
										) : (
											materials.map((item) => (
												<View
													key={`${box.box_code}-${item.it_codigo}`}
													className="rounded-xl border px-3 py-2"
													style={{ borderColor: colors.border, backgroundColor: colors.inputBackground }}
												>
													<Text className="text-sm font-semibold" style={{ color: colors.text }}>
														{item.it_codigo} - {item.desc_item}
													</Text>
													<Text className="text-xs" style={{ color: colors.textMuted }}>
														Lote: {item.lote} · Fabricação: {item.data_fabricacao}
													</Text>
													<Text className="text-xs" style={{ color: colors.textMuted }}>
														Quantidade: {item.quantidade.toFixed(3)}
													</Text>
													{item.validade && (
														<Text className="text-xs" style={{ color: colors.textMuted }}>
															Validade: {item.validade}
														</Text>
													)}
													{item.rastreabilidade && (
														<Text className="text-xs" style={{ color: colors.textMuted }}>
															Rastreabilidade: {item.rastreabilidade}
														</Text>
													)}
												</View>
											))
										)}
										{canPrint && (
											<View className="mt-4">
												<PrintLabelButton
													canPrint={true}
													loading={loadingPrint}
													onPress={() => openPrintForBox(box)}
												/>
											</View>
										)}
										{!canPrint && (
											<Text className="text-xs" style={{ color: colors.textMuted }}>
												Faltam dados da caixa para solicitar impressão.
											</Text>
										)}
									</View>
								)}
							</View>
						);
					})
				)}
			</ScrollView>

			<Modal visible={showPrintModal} transparent animationType="fade" onRequestClose={handleCancelPrint}>
				<View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}>
					<View
						className="w-11/12 max-w-md rounded-2xl p-6"
						style={{ backgroundColor: colors.inputBackground, borderColor: colors.border, borderWidth: 1 }}
					>
						<Text className="text-lg font-semibold mb-1" style={{ color: colors.text }}>
							Imprimir Etiquetas
						</Text>
						<Text className="text-sm mb-4" style={{ color: colors.textMuted }}>
							Informe a quantidade de etiquetas que deseja imprimir. O sistema enviará a impressão
							exatamente nesse número.
						</Text>
						{selectedPrintBox && (
							<Text className="text-sm mb-3" style={{ color: colors.textMuted }}>
								Caixa {selectedPrintBox.box_code} · OP {selectedPrintBox.ordem_producao ?? "--"} ·
								Batelada {selectedPrintBox.batelada ?? "--"}
							</Text>
						)}
						<TextInput
							value={labelQuantity}
							onChangeText={setLabelQuantity}
							placeholder="Quantidade de etiquetas"
							placeholderTextColor={colors.inputPlaceholder}
							keyboardType="numeric"
							className="w-full mb-4"
							style={{
								backgroundColor: colors.inputBackground,
								color: colors.text,
								borderWidth: 1,
								borderColor: colors.border,
								borderRadius: 12,
								paddingHorizontal: 16,
								paddingVertical: 12,
								fontSize: 16,
							}}
						/>
						<View className="flex-row justify-end gap-3">
							<TouchableOpacity
								onPress={handleCancelPrint}
								className="px-4 py-3 rounded-full items-center justify-center"
								style={{ backgroundColor: colors.textMuted, minWidth: 90 }}
							>
								<Text className="font-semibold text-sm" style={{ color: colors.white }}>
									Cancelar
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleConfirmPrint}
								disabled={loadingPrint}
								className="px-4 py-3 rounded-full items-center justify-center"
								style={{
									backgroundColor: colors.primary,
									minWidth: 90,
									opacity: loadingPrint ? 0.7 : 1,
								}}
							>
								{loadingPrint ? (
									<ActivityIndicator color={colors.white} />
								) : (
									<Text className="font-semibold text-sm" style={{ color: colors.white }}>
										Confirmar
									</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
        </DefaultLayout>
    );
}