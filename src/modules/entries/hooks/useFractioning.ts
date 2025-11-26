import { SelectOption } from "@shared/components/Select";
import { useState } from "react";
import { Alert } from "react-native";
import { fractioningApi } from "../api/fractioning.api";
import { useFractioningContext } from "../context/useFractioningContext";
import {
	ExpectedItem,
	FractioningBatchResponse,
	FractioningFinalizeData,
	FractioningItem,
	FractioningItemDetail,
	FractioningItemResponse,
} from "../types/fractioning";
import { formatDate, getReadDate, getToday } from "../utils/dateUtils";
import { createBoxItem, createFractioningItem } from "../utils/itemUtils";
import { validateDateFields, validateItemStatus } from "../utils/validationUtils";

interface UseFractioningReturn {
	depositOptions: SelectOption[];
	locationOptions: SelectOption[];
	batchOptions: SelectOption[];
	cod_estabel: string;
	cod_deposito?: string;
	cod_local?: string;
	it_codigo?: string;
	setCodEstabel: (value: string) => void;
	setCodDeposito: (value: string) => void;
	setCodLocal: (value: string) => void;
	setItCodigo: (value: string) => void;

	itemInfo: FractioningItemResponse | null;
	searchItem: () => Promise<void>;
	loadingItem: boolean;
	itemError?: string;

	batches: FractioningBatchResponse[];
	loadingBatches: boolean;
	loadBatches: () => Promise<void>;

	fractioningItems: FractioningItem[];
	boxItems: FractioningItem[];
	addItem: (item: FractioningItemResponse, cod_lote?: string, data_lote?: string, quantidade?: number, validade?: string, expectedQuantity?: number) => Promise<void>;
	updateItemDetails: (itemId: string, details: FractioningItemDetail[]) => void;
	deleteItem: (itemId: string) => void;

	lote: string;
	quantidadeCaixas: string;
	ordemProducao: string;
	batelada: string;
	loadingExpectedItems: boolean;
	expectedItems: ExpectedItem[];
	setLote: (lote: string) => void;
	setQuantidadeCaixas: (qty: string) => void;
	setOrdemProducao: (ordemProducao: string) => void;
	setBatelada: (batelada: string) => void;
	loadExpectedItems: () => Promise<void>;

	boxCode?: string;
	setBoxCode: (code: string | undefined) => void;
	showQRScanner: boolean;
	openQRScanner: (type?: "box" | "item" | "lot") => void;
	closeQRScanner: () => void;
	handleQRScan: (data: string) => Promise<void>;
	handleBoxCodeEntered: (code: string) => Promise<void>;
	qrScanType: "box" | "item" | "lot";

	validateRequiredFields: () => boolean;
	canFinalize: () => boolean;
	finalizeFractioning: () => Promise<void>;
	loadingFinalize: boolean;
}

export function useFractioning(): UseFractioningReturn {
	const [it_codigo, setItCodigoState] = useState<string | undefined>();
	const [itemInfo, setItemInfo] = useState<FractioningItemResponse | null>(null);
	const [loadingItem, setLoadingItem] = useState(false);
	const [itemError, setItemError] = useState<string | undefined>();

	const [batches, setBatches] = useState<FractioningBatchResponse[]>([]);
	const [loadingBatches, setLoadingBatches] = useState(false);

	const [fractioningItems, setFractioningItems] = useState<FractioningItem[]>([]);
	const [boxItems, setBoxItems] = useState<FractioningItem[]>([]);
	const [boxCode, setBoxCode] = useState<string | undefined>();

	const [showQRScanner, setShowQRScanner] = useState(false);
	const [qrScanType, setQrScanType] = useState<"box" | "item" | "lot">("box");

	const [loadingFinalize, setLoadingFinalize] = useState(false);

	const [lote, setLoteState] = useState<string>("");
	const [quantidadeCaixas, setQuantidadeCaixasState] = useState<string>("");
	const [ordemProducao, setOrdemProducaoState] = useState<string>("");
	const [batelada, setBateladaState] = useState<string>("");
	const [loadingExpectedItems, setLoadingExpectedItems] = useState(false);
	const [expectedItems, setExpectedItems] = useState<ExpectedItem[]>([]);

	const context = useFractioningContext(boxCode);

	const loadBatches = async () => {
		if (!context.cod_estabel || !it_codigo || !context.cod_deposito || !context.cod_local) {
			return;
		}

		setLoadingBatches(true);
		try {
			const data = await fractioningApi.getBatches(context.cod_estabel, it_codigo, context.cod_deposito, context.cod_local);
			const formattedBatch = {
				...data,
				dt_lote: formatDate(data.dt_lote),
			};
			setBatches([formattedBatch]);
		} catch (error: any) {
			console.error("Error loading batches:", error);
			Alert.alert("Erro", error.response?.data?.error?.message || "Erro ao carregar lotes");
			setBatches([]);
		} finally {
			setLoadingBatches(false);
		}
	};

	const searchItem = async () => {
		const codeToSearch = it_codigo?.trim();
		if (!codeToSearch) {
			setItemError("Digite ou escaneie o código do item");
			return;
		}

		setLoadingItem(true);
		setItemError(undefined);

		try {
			const data = await fractioningApi.getItem(codeToSearch);
			setItemInfo(data);
			setItemError(undefined);

			if (context.cod_estabel && context.cod_deposito) {
				loadBatches();
			}
		} catch (error: any) {
			setItemError(error.response?.data?.error?.message || "Erro ao buscar item");
			setItemInfo(null);
		} finally {
			setLoadingItem(false);
		}
	};

	const setItCodigo = (value: string) => {
		setItCodigoState(value);
		setItemInfo(null);
		setItemError(undefined);
	};

	const addItem = async (
		item: FractioningItemResponse,
		cod_lote?: string,
		data_lote?: string,
		quantidade?: number,
		validade?: string,
		expectedQuantity?: number
	) => {
		if (!context.cod_estabel || !context.cod_deposito || !context.cod_local || !cod_lote || !quantidade || !validade) {
			Alert.alert("Atenção", "Preencha todos os campos necessários");
			return;
		}

		const newItem = createFractioningItem(item, cod_lote, data_lote || "", quantidade, validade, expectedQuantity || 0);
		const newStatus = validateItemStatus(newItem);
		const validatedItem = { ...newItem, validationStatus: newStatus };
		setFractioningItems((prev) => [...prev, validatedItem]);
	};

	const updateItemDetails = (itemId: string, details: FractioningItemDetail[]) => {
		setFractioningItems((prev) =>
			prev.map((item) => {
				if (item.id === itemId) {
					const updatedItem = { ...item, details };
					const newStatus = validateItemStatus(updatedItem);
					return { ...updatedItem, validationStatus: newStatus };
				}
				return item;
			})
		);
	};

	const deleteItem = (itemId: string) => {
		Alert.alert(
			"Confirmar Exclusão",
			"Deseja realmente excluir este item?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Excluir",
					style: "destructive",
					onPress: () => {
						setFractioningItems((prev) => prev.filter((item) => item.id !== itemId));
					},
				},
			]
		);
	};

	const openQRScanner = (type: "box" | "item" | "lot" = "box") => {
		setQrScanType(type);
		setShowQRScanner(true);
	};

	const closeQRScanner = () => {
		setShowQRScanner(false);
	};

	const processBoxCode = async (boxCodeData: string) => {
		if (!boxCodeData || !boxCodeData.trim()) {
			Alert.alert("Atenção", "Digite o código da caixa");
			return;
		}

		const trimmedCode = boxCodeData.trim();
		setBoxCode(trimmedCode);
		setLoadingItem(true);
		setItemError(undefined);
		setFractioningItems([]);
		setBoxItems([]);
		setExpectedItems([]);

		const scannedData = fractioningApi.parseScannedCode(trimmedCode);
		if (scannedData && scannedData.lote) {
			setLoteState(scannedData.lote);
		} else {
			const lotMatch = trimmedCode.match(/10(\d+)/);
			if (lotMatch) {
				setLoteState(lotMatch[1]);
			} else {
				setLoteState("");
			}
		}

		try {
			const response = await fractioningApi.getBoxItems(trimmedCode);
			if (response && response.box_code) {
				setItemError(undefined);
			} else {
				setItemError("Código da caixa inválido");
			}
		} catch (error: any) {
			console.error("Erro ao validar código da caixa:", error);
			const errorMessage = error?.response?.data?.error?.message || error?.message || "Erro ao validar código da caixa";
			setItemError(errorMessage);
			Alert.alert("Erro", errorMessage);
		} finally {
			setLoadingItem(false);
		}
	};

	const handleQRScan = async (data: string) => {
		closeQRScanner();
		if (qrScanType === "box") {
			await processBoxCode(data);
		} else if (qrScanType === "item") {
			setItCodigo(data);
		}
	};

	const setLote = (value: string) => {
		setLoteState(value);
		setBoxItems([]);
		setFractioningItems([]);
		setExpectedItems([]);
	};

	const setQuantidadeCaixas = (value: string) => {
		setQuantidadeCaixasState(value);
		setBoxItems([]);
		setFractioningItems([]);
		setExpectedItems([]);
	};

	const setOrdemProducao = (value: string) => {
		setOrdemProducaoState(value);
	};

	const setBatelada = (value: string) => {
		setBateladaState(value);
	};

	const loadExpectedItems = async () => {
		if (!context.cod_estabel || !context.cod_deposito || !context.cod_local || !lote || !quantidadeCaixas) {
			Alert.alert("Atenção", "Preencha o contexto, lote e quantidade de caixas");
			return;
		}

		const qty = parseFloat(quantidadeCaixas.replace(",", "."));
		if (isNaN(qty) || qty <= 0) {
			Alert.alert("Atenção", "Quantidade de caixas inválida");
			return;
		}

		setLoadingExpectedItems(true);
		try {
			const data = await fractioningApi.getExpectedItems(
				context.cod_estabel,
				context.cod_deposito,
				context.cod_local,
				lote,
				qty
			);

			if (!data || !data.items || data.items.length === 0) {
				Alert.alert("Atenção", "Nenhum item esperado encontrado");
				setExpectedItems([]);
				setBoxItems([]);
				return;
			}

			setExpectedItems(data.items);

			const boxReadDate = getReadDate();
			const newItems: FractioningItem[] = data.items.map((item, index) => {
				const boxItem = createBoxItem(item.it_codigo, item.desc_item, item.quant_usada);
				boxItem.readDate = boxReadDate;
				return boxItem;
			});

			setBoxItems(newItems);
			setFractioningItems([]);
		} catch (error: any) {
			console.error("Erro ao buscar itens esperados:", error);
			const errorMessage = error?.response?.data?.error?.message || error?.message || "Erro ao buscar itens esperados";
			Alert.alert("Erro", errorMessage);
			setExpectedItems([]);
			setBoxItems([]);
		} finally {
			setLoadingExpectedItems(false);
		}
	};

	const validateRequiredFields = (): boolean => {
		if (!boxCode) {
			Alert.alert("Atenção", "Informe o código da caixa");
			return false;
		}

		if (!context.cod_estabel || !context.cod_deposito || !context.cod_local) {
			Alert.alert("Atenção", "Preencha estabelecimento, depósito e localização");
			return false;
		}

		if (fractioningItems.length === 0) {
			Alert.alert("Atenção", "Adicione pelo menos um item");
			return false;
		}

		for (const item of fractioningItems) {
			if (item.details.length === 0) {
				Alert.alert("Atenção", `Item ${item.it_codigo} não possui detalhes`);
				return false;
			}

			for (const detail of item.details) {
				if (!detail.quantidade || detail.quantidade <= 0) {
					Alert.alert("Atenção", `Item ${item.it_codigo} possui quantidade inválida`);
					return false;
				}
				if (!detail.cod_lote) {
					Alert.alert("Atenção", `Item ${item.it_codigo} possui lote não informado`);
					return false;
				}
				if (!detail.validade) {
					Alert.alert("Atenção", `Item ${item.it_codigo} possui validade não informada`);
					return false;
				}
				if (!detail.data_lote) {
					Alert.alert("Atenção", `Item ${item.it_codigo} possui data de fabricação não informada`);
					return false;
				}
			}
		}

		return true;
	};

	const canFinalize = (): boolean => {
		if (!context.cod_estabel || !context.cod_deposito || !context.cod_local) return false;
		if (!boxCode) return false;
		if (fractioningItems.length === 0) return false;

		for (const item of fractioningItems) {
			if (item.details.length === 0) return false;

			for (const detail of item.details) {
				if (!detail.quantidade || detail.quantidade <= 0) return false;
				if (!detail.cod_lote) return false;
				if (!detail.validade) return false;
				if (!detail.data_lote) return false;
			}
		}

		return true;
	};

	const finalizeFractioning = async () => {
		if (!validateRequiredFields()) {
			return;
		}

		const today = getToday();

		for (const item of fractioningItems) {
			for (const detail of item.details) {
				if (!validateDateFields(item.it_codigo, detail)) {
					return;
				}
			}
		}

		setLoadingFinalize(true);

		try {
			if (!boxCode) {
				Alert.alert("Erro", "Código da caixa não informado");
				return;
			}

			const dadosBaixaItems: string[] = [];

			for (const item of fractioningItems) {
				for (const detail of item.details) {
					if (!detail.cod_lote || !detail.quantidade || !detail.validade || !detail.data_lote) {
						Alert.alert(
							"Erro",
							`Item ${item.it_codigo}: Alguns campos obrigatórios não estão preenchidos. Verifique lote, quantidade, validade e data de fabricação.`
						);
						return;
					}

					const quantidadeStr = detail.quantidade.toString().replace(".", ",");
					const itemData = `${item.it_codigo},${quantidadeStr},${detail.cod_lote},${detail.data_lote},${detail.validade}`;
					dadosBaixaItems.push(itemData);
				}
			}

			if (dadosBaixaItems.length === 0) {
				Alert.alert("Erro", "Nenhum item para finalizar");
				return;
			}

			const dadosBaixa = dadosBaixaItems.join(";");
			const lotePrincipal = fractioningItems[0]?.details[0]?.cod_lote || "";
			const quantidadeTotal = fractioningItems.reduce((sum, item) => {
				return sum + item.details.reduce((itemSum, detail) => itemSum + (detail.quantidade || 0), 0);
			}, 0);

			const finalizeData: FractioningFinalizeData = {
				cod_estabel: context.cod_estabel!,
				it_codigo: boxCode,
				cod_deposito: context.cod_deposito!,
				cod_local: context.cod_local!,
				cod_lote: lotePrincipal,
				quantidade: quantidadeTotal,
				dados_baixa: dadosBaixa,
				ordem_producao: ordemProducao.trim() || undefined,
				batelada: batelada.trim() || undefined,
			};

			try {
				const response = await fractioningApi.finalizeFractioning(finalizeData);

				if (response.desc_erro && !response.desc_erro.includes("OK")) {
					Alert.alert("Erro", `Erro ao finalizar desmontagem:\n\n${response.desc_erro}`);
					setLoadingFinalize(false);
					return;
				}
			} catch (error: any) {
				Alert.alert(
					"Erro",
					`Erro ao finalizar desmontagem:\n\n${error.response?.data?.error?.message || error.message || "Erro desconhecido"}`
				);
				setLoadingFinalize(false);
				return;
			}

			setItCodigo(undefined);
			setItemInfo(null);
			setFractioningItems([]);
			setBoxItems([]);
			setBoxCode(undefined);
			setLoteState("");
			setQuantidadeCaixasState("");
			setOrdemProducaoState("");
			setBateladaState("");
			setExpectedItems([]);
			context.reset();
			setBatches([]);
			setItemError(undefined);

			Alert.alert("Sucesso", "Desmontagem finalizada com sucesso!", [{ text: "OK" }]);
		} catch (error: any) {
			Alert.alert("Erro", error.response?.data?.error?.message || "Erro ao finalizar desmontagem");
		} finally {
			setLoadingFinalize(false);
		}
	};

	return {
		depositOptions: context.deposits.map((d) => ({ label: d.nome, value: d.cod_depos })),
		locationOptions: context.locations.map((l) => ({ label: l.nome, value: l.cod_local })),
		batchOptions: batches.map((b) => ({ label: `${b.lote} - ${b.dt_lote}`, value: b.lote })),
		cod_estabel: context.cod_estabel,
		cod_deposito: context.cod_deposito,
		cod_local: context.cod_local,
		it_codigo,
		setCodEstabel: context.setCodEstabel,
		setCodDeposito: context.setCodDeposito,
		setCodLocal: context.setCodLocal,
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
		deleteItem,
		boxCode,
		setBoxCode,
		showQRScanner,
		openQRScanner,
		closeQRScanner,
		handleQRScan,
		handleBoxCodeEntered: processBoxCode,
		qrScanType,
		validateRequiredFields,
		canFinalize,
		finalizeFractioning,
		loadingFinalize,
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
	};
}