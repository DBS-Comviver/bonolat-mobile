import { RootStackParamList } from "@/types/navigation";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text } from "@shared/components";
import { DefaultLayout } from "@shared/layouts/DefaultLayout";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View, TextInput } from "react-native";
import {
	ContextFields,
	ItemCard,
	ItemDetailsTable,
	QRCodeScanner,
} from "../components";
import { useFractioning } from "../hooks/useFractioning";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Fractioning() {
	const navigation = useNavigation<NavigationProp>();
	const colors = useThemeColors();
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

	const {
		establishmentOptions,
		depositOptions,
		locationOptions,
		batchOptions,
		cod_estabel,
		cod_deposito,
		cod_local,
		it_codigo,
		cod_lote,
		setCodEstabel,
		setCodDeposito,
		setCodLocal,
		setItCodigo,
		setCodLote,
		itemInfo,
		searchItem,
		loadingItem,
		itemError,
		locations,
		loadingLocations,
		batches,
		loadingBatches,
		loadBatches,
		boxReturn,
		loadingBoxReturn,
		loadBoxReturn,
		fractioningItems,
		addItem,
		updateItemDetails,
		deleteItem,
		addDetailRow,
		deleteDetailRow,
		showQRScanner,
		openQRScanner,
		closeQRScanner,
		handleQRScan,
		finalizeFractioning,
		loadingFinalize,
	} = useFractioning();

	const handleMenuPress = () => {
		navigation.goBack();
	};

	const handleAddItem = () => {
		if (!itemInfo) {
			Alert.alert("Atenção", "Busque um item primeiro");
			return;
		}
		addItem(itemInfo);
		setSelectedItemId(fractioningItems.length > 0 ? fractioningItems[0].id : null);
	};

	const selectedItem = fractioningItems.find((item) => item.id === selectedItemId);

	return (
		<DefaultLayout
			headerTitle="Fracionamento"
			showMenu={true}
			onMenuPress={handleMenuPress}
		>
			<ScrollView
				className="flex-1"
				contentContainerStyle={{ padding: 16 }}
				showsVerticalScrollIndicator={false}
			>
				<ContextFields
					establishmentOptions={establishmentOptions}
					depositOptions={depositOptions}
					locationOptions={locationOptions}
					establishmentId={cod_estabel}
					depositId={cod_deposito}
					locationId={cod_local}
					onEstablishmentChange={setCodEstabel}
					onDepositChange={setCodDeposito}
					onLocationChange={setCodLocal}
				/>

				<View className="mb-4">
					<Text className="text-base font-semibold mb-2" style={{ color: colors.text }}>
						Item
					</Text>
					<View className="flex-row gap-2 mb-2">
						<TextInput
							value={it_codigo || ""}
							onChangeText={setItCodigo}
							placeholder="Código do item"
							className="flex-1 p-3 rounded-lg"
							style={{
								backgroundColor: colors.card,
								color: colors.text,
								borderWidth: 1,
								borderColor: colors.border,
							}}
						/>
						<TouchableOpacity
							onPress={openQRScanner}
							className="p-3 rounded-lg justify-center items-center"
							style={{ backgroundColor: colors.primary }}
						>
							<Ionicons name="qr-code-outline" size={24} color={colors.white} />
						</TouchableOpacity>
						<Button
							title="Buscar"
							onPress={searchItem}
							loading={loadingItem}
							variant="primary"
						/>
					</View>
					{itemError && (
						<Text className="text-sm text-red-500 mt-1">{itemError}</Text>
					)}
					{itemInfo && (
						<View className="mt-2 p-3 rounded-lg" style={{ backgroundColor: colors.card }}>
							<Text className="text-base font-semibold" style={{ color: colors.text }}>
								{itemInfo.desc_item}
							</Text>
							<Text className="text-sm" style={{ color: colors.textMuted }}>
								{itemInfo.it_codigo}
							</Text>
							<TouchableOpacity
								onPress={handleAddItem}
								className="mt-2 p-2 rounded-lg flex-row items-center justify-center"
								style={{ backgroundColor: colors.primary }}
							>
								<Ionicons name="add-circle-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
								<Text className="text-sm font-semibold" style={{ color: colors.white }}>
									Adicionar Item
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{cod_estabel && it_codigo && cod_deposito && cod_local && (
					<View className="mb-4">
						<Text className="text-base font-semibold mb-2" style={{ color: colors.text }}>
							Lote
						</Text>
						<View className="flex-row gap-2 mb-2">
							<TextInput
								value={cod_lote || ""}
								onChangeText={setCodLote}
								placeholder="Código do lote"
								className="flex-1 p-3 rounded-lg"
								style={{
									backgroundColor: colors.card,
									color: colors.text,
									borderWidth: 1,
									borderColor: colors.border,
								}}
							/>
							<Button
								title="Buscar Lotes"
								onPress={loadBatches}
								loading={loadingBatches}
								variant="secondary"
							/>
						</View>
						{batchOptions.length > 0 && (
							<View className="mt-2">
								{batchOptions.map((batch) => (
									<TouchableOpacity
										key={batch.value}
										onPress={() => setCodLote(batch.value)}
										className="p-3 mb-2 rounded-lg"
										style={{
											backgroundColor: cod_lote === batch.value ? colors.primary : colors.card,
										}}
									>
										<Text
											style={{
												color: cod_lote === batch.value ? colors.white : colors.text,
											}}
										>
											{batch.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>
				)}

				{fractioningItems.length > 0 && (
					<View className="mb-4">
						<Text className="text-base font-semibold mb-3" style={{ color: colors.text }}>
							Itens Fracionados
						</Text>
						{fractioningItems.map((item) => (
							<View key={item.id} className="mb-4">
								{selectedItemId === item.id ? (
									<ItemDetailsTable
										itemCode={item.it_codigo}
										itemDescription={item.desc_item}
										expectedQuantity={item.expectedQuantity}
										details={item.details.map((d) => ({
											id: d.id,
											quantity: d.quantidade,
											lot: d.cod_lote || "",
											lotValidity: d.validade || "",
											fabricationDate: d.data_lote || "",
										}))}
										onDetailsChange={(details) =>
											updateItemDetails(
												item.id,
												details.map((d) => ({
													id: d.id,
													quantidade: d.quantity,
													cod_lote: d.lot,
													validade: d.lotValidity,
													data_lote: d.fabricationDate,
												}))
											)
										}
										onAddDetail={() => addDetailRow(item.id)}
										onDeleteDetail={(detailId) => deleteDetailRow(item.id, detailId)}
										onQRCodeScan={() => openQRScanner("lot")}
									/>
								) : (
									<ItemCard
										item={{
											id: item.id,
											code: item.it_codigo,
											description: item.desc_item,
											expectedQuantity: item.expectedQuantity,
										}}
										onPress={() => setSelectedItemId(item.id)}
										onDelete={() => deleteItem(item.id)}
										showDelete={true}
									/>
								)}
							</View>
						))}
					</View>
				)}

				{fractioningItems.length > 0 && (
					<View className="mb-6">
						<Button
							title="Finalizar Desmontagem"
							onPress={finalizeFractioning}
							loading={loadingFinalize}
							variant="primary"
						/>
					</View>
				)}
			</ScrollView>

			<QRCodeScanner
				visible={showQRScanner}
				onScan={handleQRScan}
				onClose={closeQRScanner}
				title="Escaneie o código"
			/>
		</DefaultLayout>
	);
}

