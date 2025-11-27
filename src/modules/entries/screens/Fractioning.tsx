import { RootStackParamList } from "@/types/navigation";
import { useThemeColors } from "@core/hooks/useThemeColors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "@shared/components";
import { DefaultLayout } from "@shared/layouts/DefaultLayout";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { fractioningApi, isMockMode } from "../api/fractioning.api";
import {
	AddItemForm,
	BoxInfoInput,
	BoxItemsList,
	CodeScanner,
	ContextSection,
	FinalizeButton,
	FractionedItemsTable,
	MockModeBanner,
	PrintLabelButton,
} from "../components";
import { useFractioning } from "../hooks/useFractioning";
import { parseGS1Barcode } from "../utils/barcodeUtils";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Fractioning() {
	const navigation = useNavigation<NavigationProp>();
	const colors = useThemeColors();
	const [manualItemCode, setManualItemCode] = useState<string>("");
	const [manualLote, setManualLote] = useState<string>("");
	const [manualDataLote, setManualDataLote] = useState<string>("");
	const [manualQuantidade, setManualQuantidade] = useState<string>("");
	const [contextFieldsVisible, setContextFieldsVisible] = useState<boolean>(true);
	const [contextFieldsLocked, setContextFieldsLocked] = useState<boolean>(false);
	const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
	const [itemFields, setItemFields] = useState<Record<string, Array<{
		id: string;
		quantidade: string;
		lote: string;
		validade: string;
		dataFabricacao: string;
		itemCode?: string;
		added?: boolean;
		editingDetailId?: string;
		editingItemId?: string;
	}>>>({});
	const [showAddItemForm, setShowAddItemForm] = useState<boolean>(false);
	const [manualValidade, setManualValidade] = useState<string>("");
	const [loadingPrint, setLoadingPrint] = useState<boolean>(false);
	const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
	const [labelQuantity, setLabelQuantity] = useState<string>("1");

	const {
		depositOptions,
		locationOptions,
		batchOptions,
		cod_estabel,
		cod_deposito,
		cod_local,
		it_codigo,
		setCodDeposito,
		setCodLocal,
		setItCodigo,
		itemInfo,
		searchItem,
		loadingItem,
		itemError,
		batches,
		loadingBatches,
		loadBatches,
		fractioningItems,
		boxItems,
		addItem,
		updateItemDetails,
		boxCode,
		setBoxCode,
		showQRScanner,
		openQRScanner,
		closeQRScanner,
		handleQRScan,
		handleBoxCodeEntered,
		qrScanType,
		canFinalize,
		finalizeFractioning,
		loadingFinalize,
		deleteItem,
		lote,
		quantidadeCaixas,
		ordemProducao,
		batelada,
		loadingExpectedItems,
		expectedItems,
		setLote,
		setQuantidadeCaixas,
		setOrdemProducao,
		setBatelada,
		loadExpectedItems,
	} = useFractioning();

	const clearAllStates = () => {
		setItemFields({});
		setExpandedItemId(null);
		setShowAddItemForm(false);
		setManualItemCode("");
		setManualLote("");
		setManualDataLote("");
		setManualQuantidade("");
		setManualValidade("");
		setContextFieldsVisible(true);
		setContextFieldsLocked(false);
		setShowPrintModal(false);
		setLabelQuantity("1");
	};

	const handleMenuPress = () => {
		navigation.goBack();
	};

	const handleEditItem = async (itemId: string) => {
		const item = fractioningItems.find(i => i.id === itemId);
		if (!item) return;

		const boxItem = boxItems.find(bi => bi.it_codigo === item.it_codigo);

		if (!boxItem) {
			setShowAddItemForm(true);
			setManualItemCode(item.it_codigo);
			setItCodigo(item.it_codigo);
			await searchItem();
			await loadBatches();

			const detail = item.details[0];
			if (detail) {
				setManualLote(detail.cod_lote || "");
				setManualDataLote(detail.data_lote || "");
				setManualValidade(detail.validade || "");
				setManualQuantidade(detail.quantidade.toString());

				const formId = `form-${Date.now()}-${Math.random()}`;
				setItemFields({
					...itemFields,
					[itemId]: [{
						id: formId,
						quantidade: detail.quantidade.toString(),
						lote: detail.cod_lote || "",
						validade: detail.validade || "",
						dataFabricacao: detail.data_lote || "",
						added: false,
						editingDetailId: detail.id,
						editingItemId: itemId,
						itemCode: item.it_codigo,
					}],
				});
			}
			return;
		}

		setItCodigo(boxItem.it_codigo);
		await loadBatches();
		setExpandedItemId(boxItem.id);

		if (item.details.length > 0) {
			const forms = item.details.map((detail) => ({
				id: `form-${detail.id}-${Date.now()}`,
				quantidade: detail.quantidade.toString(),
				lote: detail.cod_lote || "",
				validade: detail.validade || "",
				dataFabricacao: detail.data_lote || "",
				added: false,
				editingDetailId: detail.id,
				editingItemId: itemId,
				itemCode: boxItem.it_codigo,
			}));
			setItemFields({
				...itemFields,
				[boxItem.id]: forms,
			});
		} else {
			const formId = `form-${Date.now()}-${Math.random()}`;
			setItemFields({
				...itemFields,
				[boxItem.id]: [{
					id: formId,
					quantidade: "",
					lote: "",
					validade: "",
					dataFabricacao: "",
					itemCode: boxItem.it_codigo,
					added: false,
				}],
			});
		}
	};

	const handleDeleteItem = (itemId: string) => {
		const item = fractioningItems.find(i => i.id === itemId);
		if (!item) return;

		deleteItem(itemId);

		const boxItem = boxItems.find(bi => bi.it_codigo === item.it_codigo);
		if (boxItem) {
			const updatedFields = { ...itemFields };
			delete updatedFields[boxItem.id];
			setItemFields(updatedFields);

			if (expandedItemId === boxItem.id) {
				setExpandedItemId(null);
			}
		}
	};

	const handleConfirmItem = async (item: any, fields: any, formId?: string) => {
		if (!fields.quantidade || !fields.lote || !fields.validade || !fields.dataFabricacao) {
			Alert.alert("Atenção", "Preencha todos os campos obrigatórios");
			return;
		}
		const quantidade = parseFloat(fields.quantidade.replace(",", "."));
		if (isNaN(quantidade) || quantidade <= 0) {
			Alert.alert("Atenção", "Quantidade inválida");
			return;
		}

		const readDate = new Date().toLocaleString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});

		if (fields.editingItemId && fields.editingDetailId) {
			const existingItem = fractioningItems.find(fi => fi.id === fields.editingItemId);
			if (existingItem) {
				const updatedDetails = existingItem.details.map(detail =>
					detail.id === fields.editingDetailId
						? {
							...detail,
							quantidade: quantidade,
							cod_lote: fields.lote,
							validade: fields.validade,
							data_lote: fields.dataFabricacao,
							readDate: readDate,
						}
						: detail
				);
				updateItemDetails(existingItem.id, updatedDetails);
			}
		} else {
			const existingItem = fractioningItems.find(fi => fi.it_codigo === item.it_codigo);

			if (existingItem) {
				const detailId = `detail-${Date.now()}-${Math.random()}`;
				const newDetail = {
					id: detailId,
					quantidade: quantidade,
					cod_lote: fields.lote,
					validade: fields.validade,
					data_lote: fields.dataFabricacao,
					readDate: readDate,
					validationStatus: "pending" as const,
				};
				updateItemDetails(existingItem.id, [...existingItem.details, newDetail]);
			} else {
				const itemCodeToUse = fields.itemCode || item.it_codigo;
				const itemInfo = await fractioningApi.getItem(itemCodeToUse);
				const boxItem = boxItems.find(bi => bi.it_codigo === itemCodeToUse);
				const expectedQty = boxItem ? boxItem.expectedQuantity : 0;
				await addItem(itemInfo, fields.lote, fields.dataFabricacao, quantidade, fields.validade, expectedQty);
			}
		}

		const currentForms = itemFields[item.id] || [];
		const formIdToUse = formId || fields.id;
		const updatedForms = currentForms.map(form =>
			form.id === formIdToUse ? { ...form, added: true } : form
		);
		setItemFields({
			...itemFields,
			[item.id]: updatedForms,
		});

		const allConfirmed = updatedForms.every(f => f.added);
		if (allConfirmed && updatedForms.length > 0) {
			setExpandedItemId(null);
		}
	};

	const handleScanItem = async (itemId: string, formId?: string) => {
		openQRScanner("item");
		setExpandedItemId(itemId);
		if (!itemFields[itemId] || itemFields[itemId].length === 0) {
			const boxItem = boxItems.find(bi => bi.id === itemId);
			if (boxItem) {
				const newFormId = formId || `form-${Date.now()}-${Math.random()}`;
				setItemFields({
					...itemFields,
					[itemId]: [{
						id: newFormId,
						quantidade: "",
						lote: "",
						validade: "",
						dataFabricacao: "",
						itemCode: boxItem.it_codigo,
						added: false,
					}],
				});
			}
		}
	};

	const handleAddAgain = (itemId: string) => {
		const boxItem = boxItems.find(bi => bi.id === itemId);
		if (!boxItem) return;

		const currentForms = itemFields[itemId] || [];
		const newFormId = `form-${Date.now()}-${Math.random()}`;
		const newForm = {
			id: newFormId,
			quantidade: "",
			lote: "",
			validade: "",
			dataFabricacao: "",
			itemCode: boxItem.it_codigo,
			added: false,
		};

		setItemFields({
			...itemFields,
			[itemId]: [...currentForms, newForm],
		});
		setExpandedItemId(itemId);
	};


	const handleAddItem = async () => {
		if (!manualLote || !manualQuantidade || parseFloat(manualQuantidade.replace(",", ".")) <= 0 || !manualValidade) {
			Alert.alert("Atenção", "Preencha lote, quantidade e validade");
			return;
		}
		const quantidade = parseFloat(manualQuantidade.replace(",", "."));
		if (!itemInfo) return;

		const editingItem = fractioningItems.find(fi => {
			const allFields = Object.values(itemFields).flat();
			const fields = allFields.find(f => f.editingItemId === fi.id && f.itemCode === itemInfo.it_codigo);
			return !!fields;
		});

		if (editingItem) {
			const allFields = Object.values(itemFields).flat();
			const fields = allFields.find(f => f.editingItemId === editingItem.id && f.itemCode === itemInfo.it_codigo);
			if (fields && fields.editingDetailId) {
				const updatedDetails = editingItem.details.map(detail =>
					detail.id === fields.editingDetailId
						? {
							...detail,
							quantidade: quantidade,
							cod_lote: manualLote,
							validade: manualValidade,
							data_lote: manualDataLote,
						}
						: detail
				);
				updateItemDetails(editingItem.id, updatedDetails);
			}
		} else {
			await addItem(itemInfo, manualLote, manualDataLote, quantidade, manualValidade, 0);
		}

		setShowAddItemForm(false);
		setManualItemCode("");
		setManualValidade("");
		setManualLote("");
		setManualDataLote("");
		setManualQuantidade("");
		setItCodigo(undefined);

		const updatedFields = { ...itemFields };
		Object.keys(updatedFields).forEach(key => {
			updatedFields[key] = updatedFields[key].map(form => {
				if (form.editingItemId) {
					return {
						...form,
						added: true,
						editingDetailId: undefined,
						editingItemId: undefined,
						itemCode: undefined,
					};
				}
				return form;
			});
		});
		setItemFields(updatedFields);
	};

	const handleCloseAddItemForm = () => {
		setShowAddItemForm(false);
		setManualItemCode("");
		setManualLote("");
		setManualDataLote("");
		setManualQuantidade("");
		setItCodigo(undefined);
	};

	const handleQRScanData = async (data: string) => {
		if (qrScanType === "item") {
			if (expandedItemId) {
				const boxItem = boxItems.find(bi => bi.id === expandedItemId);
				if (boxItem) {
					const parsed = parseGS1Barcode(data);
					if (parsed && (parsed.item_code || parsed.lote)) {
						const currentForms = itemFields[boxItem.id] || [];
						const unconfirmedFormIndex = currentForms.findIndex(f => !f.added);
						if (unconfirmedFormIndex >= 0) {
							const updatedForms = currentForms.map((form, index) =>
								index === unconfirmedFormIndex
									? {
										...form,
										itemCode: parsed.item_code || boxItem.it_codigo,
										lote: parsed.lote || form.lote,
									}
									: form
							);
							setItemFields({
								...itemFields,
								[boxItem.id]: updatedForms,
							});
						} else {
							const newFormId = `form-${Date.now()}-${Math.random()}`;
							const newForm = {
								id: newFormId,
								quantidade: "",
								lote: parsed.lote || "",
								validade: "",
								dataFabricacao: "",
								itemCode: parsed.item_code || boxItem.it_codigo,
								added: false,
							};
							setItemFields({
								...itemFields,
								[boxItem.id]: [...currentForms, newForm],
							});
						}
					} else {
						Alert.alert("Atenção", "Código escaneado não reconhecido. Verifique o código.");
					}
				}
			} else {
				const parsed = parseGS1Barcode(data);
				if (parsed && parsed.item_code) {
					setManualItemCode(parsed.item_code);
					setItCodigo(parsed.item_code);

					if (parsed.lote) {
						setManualLote(parsed.lote);
					} else {
						setManualLote("");
					}
					setManualDataLote("");
					setManualValidade("");

					setShowAddItemForm(true);
					if (parsed.item_code) {
						await searchItem();
						await loadBatches();
					}
				} else {
					setManualItemCode(data);
					setItCodigo(data);
					setManualLote("");
					setManualDataLote("");
					setManualValidade("");
					setShowAddItemForm(true);
					await searchItem();
					await loadBatches();
				}
			}
		}
		await handleQRScan(data);
	};

	const openPrintModal = () => {
		if (!canFinalize()) {
			return;
		}
		setLabelQuantity("1");
		setShowPrintModal(true);
	};

	const handleCancelPrint = () => {
		setShowPrintModal(false);
		setLabelQuantity("1");
	};

	const handleConfirmPrint = async () => {
		const quantity = parseInt(labelQuantity.trim(), 10);

		if (isNaN(quantity) || quantity <= 0) {
			Alert.alert("Atenção", "Informe uma quantidade válida de etiquetas");
			return;
		}

		if (!cod_estabel || !cod_deposito || !cod_local) {
			Alert.alert("Atenção", "Dados do contexto incompletos para impressão");
			return;
		}

		if (!boxCode) {
			Alert.alert("Atenção", "Informe o código da caixa antes de imprimir");
			return;
		}

		setLoadingPrint(true);
		try {
			const response = await fractioningApi.printLabels({
				cod_estabel,
				cod_deposito,
				cod_local,
				box_code: boxCode,
				ordem_producao: ordemProducao,
				batelada,
				quantidade: quantity,
			});

			Alert.alert("Impressão", response.message || `Solicitadas ${quantity} etiqueta(s)`);
			setShowPrintModal(false);
			setLabelQuantity("1");
		} catch (error: any) {
			Alert.alert("Erro", error.response?.data?.error?.message || error.message || "Erro ao imprimir etiquetas");
		} finally {
			setLoadingPrint(false);
		}
	};

	return (
		<DefaultLayout
			headerTitle="Fracionamento"
			showMenu={true}
			onMenuPress={handleMenuPress}
		>
			{isMockMode && <MockModeBanner />}
			<ScrollView
				className="flex-1"
				contentContainerStyle={{ padding: 16 }}
				showsVerticalScrollIndicator={false}
			>
				<ContextSection
					visible={contextFieldsVisible}
					locked={contextFieldsLocked}
					boxCode={boxCode}
					depositOptions={depositOptions}
					locationOptions={locationOptions}
					establishmentId={cod_estabel}
					depositId={cod_deposito}
					locationId={cod_local}
					onDepositChange={(value) => {
						setCodDeposito(value);
						setCodLocal(undefined);
					}}
					onLocationChange={(value) => {
						setCodLocal(value);
					}}
					onToggleVisible={() => setContextFieldsVisible(!contextFieldsVisible)}
					onLock={() => {
						setContextFieldsLocked(true);
						setContextFieldsVisible(false);
						setItemFields({});
						setExpandedItemId(null);
						setShowPrintModal(false);
						setLabelQuantity("1");
					}}
					onUnlock={() => {
						setContextFieldsLocked(false);
						setContextFieldsVisible(true);
						setItemFields({});
						setExpandedItemId(null);
						setLote("");
						setQuantidadeCaixas("");
						setOrdemProducao("");
						setBatelada("");
						setShowPrintModal(false);
						setLabelQuantity("1");
					}}
				/>

				<BoxInfoInput
					boxCode={boxCode}
					lote={lote}
					quantidadeCaixas={quantidadeCaixas}
					ordemProducao={ordemProducao}
					batelada={batelada}
					loading={loadingExpectedItems || loadingItem}
					codEstabel={cod_estabel}
					codDeposito={cod_deposito}
					codLocal={cod_local}
					onBoxCodeChange={setBoxCode}
					onLoteChange={setLote}
					onQuantidadeCaixasChange={setQuantidadeCaixas}
					onOrdemProducaoChange={setOrdemProducao}
					onBateladaChange={setBatelada}
					onScanBox={() => openQRScanner("box")}
					onSearch={async () => {
						if (!cod_estabel || !cod_deposito || !cod_local) {
							Alert.alert("Atenção", "Preencha o contexto (estabelecimento, depósito e local)");
							return;
						}

						if (!boxCode || !boxCode.trim()) {
							Alert.alert("Atenção", "Digite o código da caixa");
							return;
						}
						if (!lote || !lote.trim()) {
							Alert.alert("Atenção", "Digite o lote");
							return;
						}
						if (!quantidadeCaixas || !quantidadeCaixas.trim()) {
							Alert.alert("Atenção", "Digite a quantidade de caixas");
							return;
						}

						await handleBoxCodeEntered(boxCode.trim());

						if (!itemError && lote && quantidadeCaixas) {
							await loadExpectedItems();
						}
					}}
					error={itemError}
				/>

				{boxItems.length > 0 && contextFieldsLocked && cod_estabel && cod_deposito && cod_local && (
					<BoxItemsList
						boxItems={boxItems}
						fractioningItems={fractioningItems}
						itemFields={itemFields}
						expandedItemId={expandedItemId}
						onFieldsChange={(itemId, newFields) => {
							setItemFields({
								...itemFields,
								[itemId]: newFields,
							});
						}}
						onToggleExpand={(itemId) => {
							setExpandedItemId(itemId);
							if (itemId && (!itemFields[itemId] || itemFields[itemId].length === 0)) {
								const boxItem = boxItems.find(bi => bi.id === itemId);
								if (boxItem) {
									const formId = `form-${Date.now()}-${Math.random()}`;
									setItemFields({
										...itemFields,
										[itemId]: [{
											id: formId,
											quantidade: "",
											lote: "",
											validade: "",
											dataFabricacao: "",
											itemCode: boxItem.it_codigo,
											added: false,
										}],
									});
								}
							}
						}}
						onScanItem={handleScanItem}
						onConfirm={handleConfirmItem}
						onAddAgain={handleAddAgain}
					/>
				)}

				{boxItems.length > 0 && contextFieldsLocked && cod_estabel && cod_deposito && cod_local && (
					<View className="mb-4">
						{!showAddItemForm && (
							<TouchableOpacity
								onPress={() => setShowAddItemForm(true)}
								className="p-3 rounded-lg flex-row items-center justify-center mb-3"
								style={{ backgroundColor: colors.primary }}
							>
								<Text className="text-base font-semibold" style={{ color: colors.white }}>
									Adicionar Item
								</Text>
							</TouchableOpacity>
						)}
						<AddItemForm
							visible={showAddItemForm}
							itemCode={manualItemCode}
							itemInfo={itemInfo}
							lote={manualLote}
							dataLote={manualDataLote}
							validade={manualValidade}
							quantidade={manualQuantidade}
							batchOptions={batchOptions}
							batches={batches}
							loadingItem={loadingItem}
							loadingBatches={loadingBatches}
							cod_estabel={cod_estabel}
							cod_deposito={cod_deposito}
							it_codigo={it_codigo}
							onItemCodeChange={setManualItemCode}
							onLoteChange={setManualLote}
							onDataLoteChange={setManualDataLote}
							onValidadeChange={setManualValidade}
							onQuantidadeChange={setManualQuantidade}
							onSearchItem={searchItem}
							onLoadBatches={loadBatches}
							onScanItem={() => openQRScanner("item")}
							onAddItem={handleAddItem}
							onClose={handleCloseAddItemForm}
							onSetItCodigo={setItCodigo}
						/>
					</View>
				)}

				{fractioningItems.length > 0 && (
					<View className="mb-4">
						<Text className="text-base font-semibold mb-3" style={{ color: colors.text }}>
							Itens Fracionados ({fractioningItems.length})
						</Text>
						<FractionedItemsTable
							items={fractioningItems}
							onEdit={handleEditItem}
							onDelete={handleDeleteItem}
						/>
					</View>
				)}

				{fractioningItems.length > 0 && (
					<>
						<PrintLabelButton canPrint={canFinalize()} loading={loadingPrint} onPress={openPrintModal} />
						<FinalizeButton
							canFinalize={canFinalize()}
							loading={loadingFinalize}
							onPress={async () => {
								await finalizeFractioning();
								clearAllStates();
							}}
						/>
					</>
				)}
			</ScrollView>

			<Modal visible={showPrintModal} transparent animationType="fade" onRequestClose={handleCancelPrint}>
				<View
					className="flex-1 justify-center items-center"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
				>
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
								style={{
									backgroundColor: colors.textMuted,
									minWidth: 90,
								}}
								activeOpacity={0.8}
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
								activeOpacity={0.8}
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

			<CodeScanner
				visible={showQRScanner}
				onScan={handleQRScanData}
				onClose={closeQRScanner}
				title="Escaneie o código"
			/>
		</DefaultLayout>
	);
}