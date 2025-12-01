import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { fractioningApi } from "../api/fractioning.api";
import { BoxMaterialDetail, BoxOverview, FilterOption } from "../types/fractioning";

interface UseSearchOPReturn {
	ordemProducao: string;
	batelada: string;
	setOrdemProducao: (value: string) => void;
	setBatelada: (value: string) => void;
	orderOptions: FilterOption[];
	bateladaOptions: FilterOption[];
	loadingFilters: boolean;
	boxes: BoxOverview[];
	loadingBoxes: boolean;
	canSearch: boolean;
	expandedBoxCode: string | null;
	toggleBox: (boxCode: string) => void;
	boxMaterials: Record<string, BoxMaterialDetail[]>;
	loadingMaterials: Record<string, boolean>;
	handleSearch: () => Promise<void>;
	handleClearFilters: () => void;
	selectedPrintBox: BoxOverview | null;
	showPrintModal: boolean;
	labelQuantity: string;
	setLabelQuantity: (value: string) => void;
	loadingPrint: boolean;
	openPrintForBox: (box: BoxOverview) => void;
	handleCancelPrint: () => void;
	handleConfirmPrint: () => Promise<void>;
}

export function useSearchOP(): UseSearchOPReturn {
	const [ordemProducao, setOrdemProducao] = useState<string>("");
	const [batelada, setBatelada] = useState<string>("");
	const [orderOptions, setOrderOptions] = useState<FilterOption[]>([]);
	const [bateladaOptions, setBateladaOptions] = useState<FilterOption[]>([]);
	const [loadingFilters, setLoadingFilters] = useState<boolean>(false);
	const [boxes, setBoxes] = useState<BoxOverview[]>([]);
	const [loadingBoxes, setLoadingBoxes] = useState<boolean>(false);
	const [expandedBoxCode, setExpandedBoxCode] = useState<string | null>(null);
	const [boxMaterials, setBoxMaterials] = useState<Record<string, BoxMaterialDetail[]>>({});
	const [loadingMaterials, setLoadingMaterials] = useState<Record<string, boolean>>({});
	const [selectedPrintBox, setSelectedPrintBox] = useState<BoxOverview | null>(null);
	const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
	const [labelQuantity, setLabelQuantity] = useState<string>("1");
	const [loadingPrint, setLoadingPrint] = useState<boolean>(false);

	useEffect(() => {
		loadFilterOptions();
	}, []);

	const loadFilterOptions = async () => {
		setLoadingFilters(true);
		try {
			const orderResponse = await fractioningApi.listOrders();
			setOrderOptions(orderResponse.ordens);
		} catch (error: any) {
			Alert.alert("Erro", error.message || "Erro ao carregar Ordens de Produção");
		} finally {
			setLoadingFilters(false);
		}
	};

	useEffect(() => {
		loadBateladaOptions(ordemProducao);
	}, [ordemProducao]);

	const loadBateladaOptions = async (order?: string) => {
		try {
			const bateladaResponse = await fractioningApi.listBateladas(order);
			setBateladaOptions(bateladaResponse.bateladas);
		} catch (error: any) {
			Alert.alert("Erro", error.message || "Erro ao carregar Bateladas");
		}
	};

	const canSearch = !!ordemProducao.trim() || !!batelada.trim();

	const handleClearFilters = () => {
		setOrdemProducao("");
		setBatelada("");
		setBoxes([]);
		setExpandedBoxCode(null);
		setBoxMaterials({});
	};

	const handleSearch = async () => {
		if (!canSearch) {
			Alert.alert("Atenção", "Informe ao menos uma Ordem de Produção ou Batelada");
			return;
		}
		Keyboard.dismiss();
		setLoadingBoxes(true);
		setExpandedBoxCode(null);
		setBoxMaterials({});
		setBoxes([]);

		const filters: { ordem_producao?: string; batelada?: string } = {};
		if (ordemProducao.trim()) {
			filters.ordem_producao = ordemProducao.trim();
		}
		if (batelada.trim()) {
			filters.batelada = batelada.trim();
		}

		try {
			const response = await fractioningApi.searchBoxes(filters);
			setBoxes(response);
		} catch (error: any) {
			Alert.alert("Erro", error.message || "Erro ao buscar caixas");
		} finally {
			setLoadingBoxes(false);
		}
	};

	const loadBoxMaterials = async (boxCode: string) => {
		setLoadingMaterials((prev) => ({ ...prev, [boxCode]: true }));
		try {
			const response = await fractioningApi.getBoxMaterials(boxCode);
			setBoxMaterials((prev) => ({ ...prev, [boxCode]: response.materials }));
		} catch (error: any) {
			Alert.alert("Erro", error.message || "Erro ao buscar materiais");
		} finally {
			setLoadingMaterials((prev) => ({ ...prev, [boxCode]: false }));
		}
	};

	const toggleBox = (boxCode: string) => {
		if (expandedBoxCode === boxCode) {
			setExpandedBoxCode(null);
			return;
		}
		setExpandedBoxCode(boxCode);
		if (!boxMaterials[boxCode]) {
			loadBoxMaterials(boxCode);
		}
	};

	const openPrintForBox = (box: BoxOverview) => {
		setSelectedPrintBox(box);
		setLabelQuantity("1");
		setShowPrintModal(true);
	};

	const handleCancelPrint = () => {
		setShowPrintModal(false);
		setLabelQuantity("1");
		setSelectedPrintBox(null);
	};

	const handleConfirmPrint = async () => {
		if (!selectedPrintBox) {
			return;
		}
		const quantity = parseInt(labelQuantity.trim(), 10);
		if (isNaN(quantity) || quantity <= 0) {
			Alert.alert("Atenção", "Informe uma quantidade válida de etiquetas");
			return;
		}

		const { cod_estabel, cod_deposito, cod_local, box_code, ordem_producao, batelada } = selectedPrintBox;
		if (!cod_estabel || !cod_deposito || !cod_local) {
			Alert.alert("Atenção", "Dados da caixa incompletos para impressão");
			return;
		}

		setLoadingPrint(true);
		try {
			const zplCode = await fractioningApi.printLabels({
				cod_estabel,
				cod_deposito,
				cod_local,
				box_code,
				ordem_producao,
				batelada,
				quantidade: quantity,
			});

			const filename = `etiqueta_${box_code}_${Date.now()}.txt`;
			const file = new File(Paths.cache, filename);
			await file.write(zplCode);
			const fileUri = file.uri;

			const isAvailable = await Sharing.isAvailableAsync();
			
			if (isAvailable) {
				await Sharing.shareAsync(fileUri, {
					mimeType: 'text/plain',
					dialogTitle: 'Imprimir Etiqueta',
				});
				
				Alert.alert(
					"Sucesso",
					`Arquivo de etiqueta gerado! Escolha o aplicativo de impressão para imprimir ${quantity} etiqueta(s).`
				);
			} else {
				if (Platform.OS === 'android') {
					try {
						await Linking.openURL(fileUri);
					} catch {
						Alert.alert(
							"Arquivo Salvo",
							`Arquivo ZPL salvo em: ${fileUri}\n\nAbra manualmente com um aplicativo de impressão.`
						);
					}
				} else {
					Alert.alert(
						"Arquivo Salvo",
						`Arquivo de etiqueta salvo em: ${fileUri}\n\nAbra manualmente com um aplicativo de impressão.`
					);
				}
			}

			setShowPrintModal(false);
			setLabelQuantity("1");
			setSelectedPrintBox(null);
		} catch (error: any) {
			const errorMessage = error.response?.data?.error?.message || error.message || "Erro ao imprimir etiquetas";
			Alert.alert("Erro", errorMessage);
		} finally {
			setLoadingPrint(false);
		}
	};

	return {
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
	};
}