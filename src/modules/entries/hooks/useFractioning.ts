import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { fractioningApi } from "../api/fractioning.api";
import {
	FractioningItemResponse,
	FractioningDepositResponse,
	FractioningLocationResponse,
	FractioningBatchResponse,
	FractioningBoxResponse,
	FractioningItem,
	FractioningItemDetail,
	FractioningFinalizeData,
} from "../types/fractioning";
import { SelectOption } from "@shared/components/Select";
import { storageService } from "@core/services/storage/storageService";

const STORAGE_KEY = "fractioning_context";
const ESTABLISHMENTS = [
	{ label: "2201", value: "2201" },
	{ label: "2202", value: "2202" },
];

interface UseFractioningReturn {
	establishmentOptions: SelectOption[];
	depositOptions: SelectOption[];
	locationOptions: SelectOption[];
	batchOptions: SelectOption[];
	cod_estabel?: string;
	cod_deposito?: string;
	cod_local?: string;
	it_codigo?: string;
	cod_lote?: string;
	setCodEstabel: (value: string) => void;
	setCodDeposito: (value: string) => void;
	setCodLocal: (value: string) => void;
	setItCodigo: (value: string) => void;
	setCodLote: (value: string) => void;

	itemInfo: FractioningItemResponse | null;
	searchItem: () => Promise<void>;
	loadingItem: boolean;
	itemError?: string;

	deposits: FractioningDepositResponse[];
	loadingDeposits: boolean;

	locations: FractioningLocationResponse[];
	loadingLocations: boolean;

	batches: FractioningBatchResponse[];
	loadingBatches: boolean;
	loadBatches: () => Promise<void>;

	boxReturn: FractioningBoxResponse | null;
	loadingBoxReturn: boolean;
	loadBoxReturn: (quantidade: number) => Promise<void>;

	fractioningItems: FractioningItem[];
	addItem: (item: FractioningItemResponse) => void;
	updateItemDetails: (itemId: string, details: FractioningItemDetail[]) => void;
	deleteItem: (itemId: string) => void;
	addDetailRow: (itemId: string) => void;
	deleteDetailRow: (itemId: string, detailId: string) => void;

	showQRScanner: boolean;
	openQRScanner: () => void;
	closeQRScanner: () => void;
	handleQRScan: (data: string) => void;

	validateQuantities: () => boolean;
	validateRequiredFields: () => boolean;

	finalizeFractioning: () => Promise<void>;
	loadingFinalize: boolean;
}

export function useFractioning(): UseFractioningReturn {
	const [cod_estabel, setCodEstabelState] = useState<string | undefined>();
	const [cod_deposito, setCodDepositoState] = useState<string | undefined>();
	const [cod_local, setCodLocalState] = useState<string | undefined>();
	const [it_codigo, setItCodigoState] = useState<string | undefined>();
	const [cod_lote, setCodLoteState] = useState<string | undefined>();

	const [itemInfo, setItemInfo] = useState<FractioningItemResponse | null>(null);
	const [loadingItem, setLoadingItem] = useState(false);
	const [itemError, setItemError] = useState<string | undefined>();

	const [deposits, setDeposits] = useState<FractioningDepositResponse[]>([]);
	const [loadingDeposits, setLoadingDeposits] = useState(false);

	const [locations, setLocations] = useState<FractioningLocationResponse[]>([]);
	const [loadingLocations, setLoadingLocations] = useState(false);

	const [batches, setBatches] = useState<FractioningBatchResponse[]>([]);
	const [loadingBatches, setLoadingBatches] = useState(false);

	const [boxReturn, setBoxReturn] = useState<FractioningBoxResponse | null>(null);
	const [loadingBoxReturn, setLoadingBoxReturn] = useState(false);

	const [fractioningItems, setFractioningItems] = useState<FractioningItem[]>([]);

	const [showQRScanner, setShowQRScanner] = useState(false);
	const [qrScanType, setQrScanType] = useState<"item" | "lot">("item");

	const [loadingFinalize, setLoadingFinalize] = useState(false);

	useEffect(() => {
		loadContextFromStorage();
	}, []);

	useEffect(() => {
		if (cod_estabel || cod_deposito || cod_local || it_codigo || cod_lote) {
			saveContextToStorage();
		}
	}, [cod_estabel, cod_deposito, cod_local, it_codigo, cod_lote]);

	useEffect(() => {
		if (cod_estabel && it_codigo) {
			loadDeposits();
		} else {
			setDeposits([]);
		}
	}, [cod_estabel, it_codigo]);

	useEffect(() => {
		if (cod_estabel && it_codigo && cod_deposito) {
			loadLocations();
		} else {
			setLocations([]);
		}
	}, [cod_estabel, it_codigo, cod_deposito]);

	const loadContextFromStorage = async () => {
		try {
			const stored = await storageService.getItem<{
				cod_estabel?: string;
				cod_deposito?: string;
				cod_local?: string;
				it_codigo?: string;
				cod_lote?: string;
			}>(STORAGE_KEY);
			if (stored) {
				setCodEstabelState(stored.cod_estabel);
				setCodDepositoState(stored.cod_deposito);
				setCodLocalState(stored.cod_local);
				setItCodigoState(stored.it_codigo);
				setCodLoteState(stored.cod_lote);
			}
		} catch (error) {
			console.error("Error loading context from storage:", error);
		}
	};

	const saveContextToStorage = async () => {
		try {
			await storageService.setItem(STORAGE_KEY, {
				cod_estabel,
				cod_deposito,
				cod_local,
				it_codigo,
				cod_lote,
			});
		} catch (error) {
			console.error("Error saving context to storage:", error);
		}
	};

	const loadDeposits = async () => {
		if (!cod_estabel || !it_codigo) {
			setDeposits([]);
			return;
		}

		setLoadingDeposits(true);
		try {
			const data = await fractioningApi.getDeposits(cod_estabel, it_codigo);
			setDeposits(data);
		} catch (error: any) {
			console.error("Error loading deposits:", error);
			Alert.alert("Erro", error.response?.data?.error?.message || "Erro ao carregar depósitos");
			setDeposits([]);
		} finally {
			setLoadingDeposits(false);
		}
	};

	const loadLocations = async () => {
		if (!cod_estabel || !it_codigo || !cod_deposito) {
			setLocations([]);
			return;
		}

		setLoadingLocations(true);
		try {
			const data = await fractioningApi.getLocations(cod_estabel, it_codigo, cod_deposito);
			setLocations(data);
		} catch (error: any) {
			console.error("Error loading locations:", error);
			Alert.alert("Erro", error.response?.data?.error?.message || "Erro ao carregar localizações");
			setLocations([]);
		} finally {
			setLoadingLocations(false);
		}
	};

	const loadBatches = async () => {
		if (!cod_estabel || !it_codigo || !cod_deposito) {
			Alert.alert("Atenção", "Preencha estabelecimento, item e depósito");
			return;
		}

		setLoadingBatches(true);
		try {
			const data = await fractioningApi.getBatches(cod_estabel, it_codigo, cod_deposito);
			setBatches(data);
		} catch (error: any) {
			console.error("Error loading batches:", error);
			Alert.alert("Erro", error.response?.data?.error?.message || "Erro ao carregar lotes");
		} finally {
			setLoadingBatches(false);
		}
	};

	const searchItem = async () => {
		if (!it_codigo?.trim()) {
			setItemError("Digite ou escaneie o código do item");
			return;
		}

		setLoadingItem(true);
		setItemError(undefined);

		try {
			const data = await fractioningApi.getItem(it_codigo.trim());
			setItemInfo(data);
		} catch (error: any) {
			setItemError(error.response?.data?.error?.message || "Erro ao buscar item");
			setItemInfo(null);
		} finally {
			setLoadingItem(false);
		}
	};

	const loadBoxReturn = async (quantidade: number) => {
		if (!cod_estabel || !it_codigo || !cod_deposito || !cod_local || !cod_lote) {
			Alert.alert("Atenção", "Preencha todos os campos de contexto");
			return;
		}

		setLoadingBoxReturn(true);
		try {
			const data = await fractioningApi.getBoxReturn(
				cod_estabel,
				it_codigo,
				cod_deposito,
				cod_local,
				cod_lote,
				quantidade
			);
			setBoxReturn(data);
		} catch (error: any) {
			console.error("Error loading box return:", error);
			Alert.alert("Erro", error.response?.data?.error?.message || "Erro ao carregar retorno da caixa");
		} finally {
			setLoadingBoxReturn(false);
		}
	};

	const setCodEstabel = (value: string) => {
		setCodEstabelState(value);
		setCodDepositoState(undefined);
		setCodLocalState(undefined);
		setCodLoteState(undefined);
		setDeposits([]);
		setLocations([]);
		setBatches([]);
	};

	const setCodDeposito = (value: string) => {
		setCodDepositoState(value);
		setCodLocalState(undefined);
		setCodLoteState(undefined);
		setLocations([]);
		setBatches([]);
	};

	const setCodLocal = (value: string) => {
		setCodLocalState(value);
		setCodLoteState(undefined);
		setBatches([]);
	};

	const setItCodigo = (value: string) => {
		setItCodigoState(value);
		setItemInfo(null);
		setItemError(undefined);
	};

	const setCodLote = (value: string) => {
		setCodLoteState(value);
	};

	const addItem = (item: FractioningItemResponse) => {
		const alreadyAdded = fractioningItems.some((fi) => fi.it_codigo === item.it_codigo);
		if (alreadyAdded) {
			Alert.alert("Atenção", "Este item já foi adicionado");
			return;
		}

		const now = new Date();
		const dateStr = now.toLocaleDateString("pt-BR");
		const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

		const newItem: FractioningItem = {
			id: `item-${Date.now()}`,
			it_codigo: item.it_codigo,
			desc_item: item.desc_item,
			expectedQuantity: 0,
			details: [
				{
					id: `detail-${Date.now()}`,
					quantidade: 0,
					cod_lote: "",
					validade: "",
					data_lote: "",
				},
			],
		};

		setFractioningItems((prev) => [...prev, newItem]);
	};

	const updateItemDetails = (itemId: string, details: FractioningItemDetail[]) => {
		setFractioningItems((prev) =>
			prev.map((item) => (item.id === itemId ? { ...item, details } : item))
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

	const addDetailRow = (itemId: string) => {
		setFractioningItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? {
							...item,
							details: [
								...item.details,
								{
									id: `detail-${Date.now()}-${Math.random()}`,
									quantidade: 0,
									cod_lote: "",
									validade: "",
									data_lote: "",
								},
							],
					  }
					: item
			)
		);
	};

	const deleteDetailRow = (itemId: string, detailId: string) => {
		setFractioningItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? {
							...item,
							details: item.details.filter((detail) => detail.id !== detailId),
					  }
					: item
			)
		);
	};

	const openQRScanner = (type: "item" | "lot" = "item") => {
		setQrScanType(type);
		setShowQRScanner(true);
	};

	const closeQRScanner = () => {
		setShowQRScanner(false);
	};

	const handleQRScan = (data: string) => {
		closeQRScanner();
		if (qrScanType === "item") {
			setItCodigo(data);
		} else if (qrScanType === "lot") {
			setCodLote(data);
		}
	};

	const validateQuantities = (): boolean => {
		for (const item of fractioningItems) {
			const total = item.details.reduce((sum, detail) => sum + (detail.quantidade || 0), 0);
			if (item.expectedQuantity > 0 && Math.abs(total - item.expectedQuantity) > 0.0001) {
				return false;
			}
		}
		return true;
	};

	const validateRequiredFields = (): boolean => {
		if (!cod_estabel || !cod_deposito || !cod_local || !it_codigo || !cod_lote) {
			Alert.alert("Atenção", "Preencha todos os campos de contexto");
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

	const finalizeFractioning = async () => {
		if (!validateRequiredFields()) {
			return;
		}

		setLoadingFinalize(true);

		try {
			const itemsToSend: FractioningFinalizeData[] = [];

			for (const item of fractioningItems) {
				for (const detail of item.details) {
					itemsToSend.push({
						cod_estabel: cod_estabel!,
						it_codigo: item.it_codigo,
						cod_deposito: cod_deposito!,
						cod_local: cod_local!,
						cod_lote: detail.cod_lote!,
						quantidade: detail.quantidade,
						validade: detail.validade!,
						data_lote: detail.data_lote!,
					});
				}
			}

			for (const itemData of itemsToSend) {
				await fractioningApi.finalizeFractioning(itemData);
			}

			Alert.alert("Sucesso", "Desmontagem finalizada com sucesso!", [
				{
					text: "OK",
					onPress: () => {
						setItCodigo(undefined);
						setItemInfo(null);
						setBoxReturn(null);
						setFractioningItems([]);
					},
				},
			]);
		} catch (error: any) {
			Alert.alert(
				"Erro",
				error.response?.data?.error?.message || "Erro ao finalizar desmontagem"
			);
		} finally {
			setLoadingFinalize(false);
		}
	};

	return {
		establishmentOptions: ESTABLISHMENTS,
		depositOptions: deposits.map((d) => ({ label: d.nome, value: d.cod_depos })),
		locationOptions: locations.map((l) => ({ label: l.nome, value: l.cod_local })),
		batchOptions: batches.map((b) => ({ label: `${b.lote} - ${b.dt_lote}`, value: b.lote })),
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
		deposits,
		loadingDeposits,
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
		openQRScanner: () => openQRScanner("item"),
		closeQRScanner,
		handleQRScan,
		validateQuantities,
		validateRequiredFields,
		finalizeFractioning,
		loadingFinalize,
	};
}

