import {
	BoxDetailsResponse,
	BoxItemsResponse,
	BoxMaterialDetail,
	BoxOverview,
	ExpectedItem,
	ExpectedItemsResponse,
	FilterOptionsResponse,
	FractioningBatchResponse,
	FractioningBoxResponse,
	FractioningDepositResponse,
	FractioningFinalizeData,
	FractioningFinalizeResponse,
	FractioningItemResponse,
	FractioningLocationResponse,
	FractioningPrintPayload,
	FractioningPrintResponse,
} from "../types/fractioning";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_ITEMS: Record<string, FractioningItemResponse> = {
	"00554-8": { it_codigo: "00554-8", desc_item: "LEITE UHT INTEGRAL 1L" },
	"12345-6": { it_codigo: "12345-6", desc_item: "LEITE DESNATADO 1L" },
	"67890-1": { it_codigo: "67890-1", desc_item: "LEITE SEMIDESNATADO 1L" },
	"CONC-UVA-001": { it_codigo: "CONC-UVA-001", desc_item: "CONCENTRADO DE UVA TINTO 1L" },
	"CONC-UVA-002": { it_codigo: "CONC-UVA-002", desc_item: "CONCENTRADO DE UVA BRANCO 1L" },
	"CONC-UVA-003": { it_codigo: "CONC-UVA-003", desc_item: "CONCENTRADO DE UVA ROSÉ 1L" },
	"CONC-UVA-004": { it_codigo: "CONC-UVA-004", desc_item: "CONCENTRADO DE UVA INTEGRAL 1L" },
};

const MOCK_DEPOSITS: Record<string, FractioningDepositResponse[]> = {
	"2202": [
		{ cod_depos: "SIL", nome: "SILOS ESTOCAGEM LEITE CRU" },
		{ cod_depos: "ALM", nome: "ALMOXARIFADO" },
		{ cod_depos: "PROD", nome: "PRODUÇÃO" },
	],
};

const MOCK_LOCATIONS: Record<string, FractioningLocationResponse[]> = {
	SIL: [
		{ cod_local: "LOC001", nome: "LOCALIZAÇÃO 001 - SILO 1" },
		{ cod_local: "LOC002", nome: "LOCALIZAÇÃO 002 - SILO 2" },
		{ cod_local: "LOC003", nome: "LOCALIZAÇÃO 003 - SILO 3" },
	],
	ALM: [
		{ cod_local: "ALM001", nome: "ALMOXARIFADO - PRATELEIRA A" },
		{ cod_local: "ALM002", nome: "ALMOXARIFADO - PRATELEIRA B" },
	],
	PROD: [
		{ cod_local: "PROD001", nome: "LINHA DE PRODUÇÃO 1" },
		{ cod_local: "PROD002", nome: "LINHA DE PRODUÇÃO 2" },
	],
};

const MOCK_BATCHES: Record<string, FractioningBatchResponse> = {
	"CONC-UVA-001": { lote: "67248", dt_lote: "24/10/2025" },
	"CONC-UVA-002": { lote: "66747", dt_lote: "31/12/2999" },
	"CONC-UVA-003": { lote: "66750", dt_lote: "31/12/2999" },
	"CONC-UVA-004": { lote: "66753", dt_lote: "31/12/2999" },
	GENERIC: { lote: "67248", dt_lote: "24/10/2025" },
};

const MOCK_BOXES: Record<string, { box_code: string; box_description: string; cod_lote: string; cod_estabel: string; cod_deposito: string; cod_local: string }> = {
	"3066865": {
		box_code: "3066865",
		box_description: "CAIXA CONCENTRADO DE UVA",
		cod_lote: "67248",
		cod_estabel: "2202",
		cod_deposito: "SIL",
		cod_local: "LOC001",
	},
};

const MOCK_FILTER_OPTIONS: FilterOptionsResponse = {
	ordens: [
		{ label: "OP-1547", value: "1547" },
		{ label: "OP-2202", value: "2202" },
		{ label: "OP-3311", value: "3311" },
	],
	bateladas: [
		{ label: "BAT-001", value: "BAT-001" },
		{ label: "BAT-002", value: "BAT-002" },
		{ label: "BAT-003", value: "BAT-003" },
	],
};

const MOCK_BOX_OVERVIEWS: BoxOverview[] = [
	{
		box_code: "15478788",
		box_description: "CAIXA CONCENTRADO DE UVA TINTO",
		lote: "67248",
		data_lote: "24/10/2025",
		quantidade: 3,
		ordem_producao: "1547",
		batelada: "BAT-001",
		cod_estabel: "2202",
		cod_deposito: "SIL",
		cod_local: "LOC001",
	},
	{
		box_code: "15478789",
		box_description: "CAIXA CONCENTRADO DE UVA BRANCO",
		lote: "66747",
		data_lote: "31/12/2999",
		quantidade: 5,
		ordem_producao: "1547",
		batelada: "BAT-002",
		cod_estabel: "2202",
		cod_deposito: "SIL",
		cod_local: "LOC001",
	},
	{
		box_code: "15478790",
		box_description: "CAIXA CONCENTRADO DE UVA ROSÉ",
		lote: "66750",
		data_lote: "31/12/2999",
		quantidade: 2,
		ordem_producao: "2202",
		batelada: "BAT-001",
		cod_estabel: "2202",
		cod_deposito: "SIL",
		cod_local: "LOC002",
	},
];

const MOCK_BOX_MATERIALS: Record<string, BoxMaterialDetail[]> = {
	"15478788": [
		{
			it_codigo: "CONC-UVA-001",
			desc_item: "CONCENTRADO DE UVA TINTO 1L",
			quantidade: 25.0,
			lote: "67248",
			data_fabricacao: "20/10/2025",
			validade: "17/12/2025",
		},
		{
			it_codigo: "CONC-UVA-002",
			desc_item: "CONCENTRADO DE UVA BRANCO 1L",
			quantidade: 30.0,
			lote: "66747",
			data_fabricacao: "31/12/2999",
			validade: "31/12/2999",
		},
	],
	"15478789": [
		{
			it_codigo: "CONC-UVA-003",
			desc_item: "CONCENTRADO DE UVA ROSÉ 1L",
			quantidade: 20.0,
			lote: "66750",
			data_fabricacao: "31/12/2999",
			validade: "31/12/2999",
		},
	],
	"15478790": [
		{
			it_codigo: "CONC-UVA-001",
			desc_item: "CONCENTRADO DE UVA TINTO 1L",
			quantidade: 25.0,
			lote: "67248",
			data_fabricacao: "20/10/2025",
			validade: "17/12/2025",
		},
	],
};


export const fractioningMock = {
	getItem: async (it_codigo: string): Promise<FractioningItemResponse> => {
		await delay(500);
		return MOCK_ITEMS[it_codigo] || { it_codigo, desc_item: `ITEM ${it_codigo} - DESCRIÇÃO MOCK` };
	},

	getDeposits: async (cod_estabel: string): Promise<FractioningDepositResponse[]> => {
		await delay(600);
		return MOCK_DEPOSITS[cod_estabel] || [];
	},

	getLocations: async (cod_estabel: string, cod_deposito: string): Promise<FractioningLocationResponse[]> => {
		await delay(600);
		return MOCK_LOCATIONS[cod_deposito] || [];
	},

	getBatches: async (cod_estabel: string, it_codigo: string, cod_deposito: string, cod_local: string): Promise<FractioningBatchResponse> => {
		await delay(600);
		return MOCK_BATCHES[it_codigo] || MOCK_BATCHES["GENERIC"] || { lote: "67248", dt_lote: "24/10/2025" };
	},

	getBoxReturn: async (
		cod_estabel: string,
		it_codigo: string,
		cod_deposito: string,
		cod_local: string,
		cod_lote: string,
		quantidade: number
	): Promise<FractioningBoxResponse> => {
		await delay(800);
		const invalidLotes = ["LOTE999", "INVALIDO", "ERRO"];
		const isInvalid = invalidLotes.includes(cod_lote.toUpperCase());
		const isQuantityError = quantidade > 1000;

		if (isInvalid || isQuantityError) {
			const errorMsg = isInvalid
				? `ERRO: Lote ${cod_lote} inválido ou não encontrado`
				: `ERRO: Quantidade ${quantidade} excede o limite permitido`;
			return {
				total: 1,
				hasNext: false,
				items: [{
					it_codigo,
					desc_item: MOCK_ITEMS[it_codigo]?.desc_item || `ITEM ${it_codigo}`,
					quant_usada: quantidade,
					mensagem: errorMsg,
				}],
			};
		}

		return {
			total: 1,
			hasNext: false,
			items: [{
				it_codigo,
				desc_item: MOCK_ITEMS[it_codigo]?.desc_item || `ITEM ${it_codigo}`,
				quant_usada: quantidade,
				mensagem: "OK",
			}],
		};
	},

	getBoxItems: async (box_code: string): Promise<BoxItemsResponse> => {
		await delay(500);
		if (box_code === "3066865") {
			const boxInfo = MOCK_BOXES[box_code];
			return {
				box_code: "3066865",
				box_description: "CAIXA CONCENTRADO DE UVA",
				total_quantity: 1.0,
				cod_estabel: boxInfo.cod_estabel,
				cod_deposito: boxInfo.cod_deposito,
				cod_local: boxInfo.cod_local,
				items: [],
			};
		}
		return {
			box_code,
			box_description: `CAIXA ${box_code}`,
			total_quantity: 1.0,
			items: [],
		};
	},

	getExpectedItems: async (
		cod_estabel: string,
		cod_deposito: string,
		cod_local: string,
		cod_lote: string,
		quantidade: number,
		it_codigo: string
	): Promise<ExpectedItemsResponse> => {
		await delay(800);
		if (!cod_lote || quantidade <= 0) return { items: [] };

		let items: ExpectedItem[] = [];

		if (cod_estabel === "2202" && (cod_deposito === "SIL" || cod_deposito === "ALM" || cod_deposito === "PROD")) {
			items = [
				{ it_codigo: "CONC-UVA-001", desc_item: "CONCENTRADO DE UVA TINTO 1L", quant_usada: 25.0 * quantidade },
				{ it_codigo: "CONC-UVA-002", desc_item: "CONCENTRADO DE UVA BRANCO 1L", quant_usada: 30.0 * quantidade },
				{ it_codigo: "CONC-UVA-003", desc_item: "CONCENTRADO DE UVA ROSÉ 1L", quant_usada: 20.0 * quantidade },
				{ it_codigo: "CONC-UVA-004", desc_item: "CONCENTRADO DE UVA INTEGRAL 1L", quant_usada: 25.0 * quantidade },
			];
		} else if (cod_lote.startsWith("672") || cod_lote.startsWith("667")) {
			items = [
				{ it_codigo: "CONC-UVA-001", desc_item: "CONCENTRADO DE UVA TINTO 1L", quant_usada: 25.0 * quantidade },
				{ it_codigo: "CONC-UVA-002", desc_item: "CONCENTRADO DE UVA BRANCO 1L", quant_usada: 30.0 * quantidade },
				{ it_codigo: "CONC-UVA-003", desc_item: "CONCENTRADO DE UVA ROSÉ 1L", quant_usada: 20.0 * quantidade },
				{ it_codigo: "CONC-UVA-004", desc_item: "CONCENTRADO DE UVA INTEGRAL 1L", quant_usada: 25.0 * quantidade },
			];
		} else {
			items = [
				{ it_codigo: "00554-8", desc_item: "LEITE UHT INTEGRAL 1L", quant_usada: 12.0 * quantidade },
				{ it_codigo: "12345-6", desc_item: "LEITE DESNATADO 1L", quant_usada: 15.0 * quantidade },
				{ it_codigo: "67890-1", desc_item: "LEITE SEMIDESNATADO 1L", quant_usada: 10.0 * quantidade },
			];
		}

		return { items };
	},

	getFilterOptions: async (): Promise<FilterOptionsResponse> => {
		await delay(400);
		return MOCK_FILTER_OPTIONS;
	},

	searchBoxes: async (filters: { ordem_producao?: string; batelada?: string }): Promise<BoxOverview[]> => {
		await delay(500);
		const ordemFiltro = filters.ordem_producao?.trim().toLowerCase().replace(/^op-/, "");
		const bateladaFiltro = filters.batelada?.trim().toLowerCase();

		return MOCK_BOX_OVERVIEWS.filter((box) => {
			const boxOrdem = box.ordem_producao?.toLowerCase() || "";
			const matchesOrdem = !ordemFiltro || boxOrdem.includes(ordemFiltro);
			const matchesBatelada = !bateladaFiltro || (box.batelada?.toLowerCase().includes(bateladaFiltro) ?? false);
			return matchesOrdem && matchesBatelada;
		});
	},

	getBoxMaterials: async (box_code: string): Promise<BoxDetailsResponse> => {
		await delay(400);
		return {
			box_code,
			materials: MOCK_BOX_MATERIALS[box_code] || [],
		};
	},

	finalizeFractioning: async (data: FractioningFinalizeData): Promise<FractioningFinalizeResponse> => {
		await delay(1000);
		if (!data.cod_estabel || !data.it_codigo || !data.cod_deposito || !data.cod_local || !data.cod_lote || !data.quantidade || !data.dados_baixa) {
			return {
				total: 1,
				hasNext: false,
				items: [{
					mensagem: "ERRO: Campos obrigatórios não preenchidos",
					it_codigo: "",
					desc_item: "",
					quant_usada: 0,
				}],
			};
		}

		const items = data.dados_baixa.split(";");
		const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

		for (const item of items) {
			const parts = item.split(",");
			if (parts.length !== 5) {
				return {
					total: 1,
					hasNext: false,
					items: [{
						mensagem: `ERRO: Formato inválido no item: ${item}`,
						it_codigo: "",
						desc_item: "",
						quant_usada: 0,
					}],
				};
			}
			const [, , , dataFabricacao, validade] = parts;
			if (!dateRegex.test(validade) || !dateRegex.test(dataFabricacao)) {
				return {
					total: 1,
					hasNext: false,
					items: [{
						mensagem: "ERRO: Formato de data inválido. Use DD/MM/AAAA",
						it_codigo: "",
						desc_item: "",
						quant_usada: 0,
					}],
				};
			}
		}

		return {
			total: 1,
			hasNext: false,
			items: [{
				mensagem: "OK - O ITEM FOI ADICIONADO AO ESTOQUE!",
				it_codigo: data.it_codigo,
				desc_item: MOCK_ITEMS[data.it_codigo]?.desc_item || `ITEM ${data.it_codigo}`,
				quant_usada: data.quantidade,
			}],
		};
	},

	printLabels: async (data: FractioningPrintPayload): Promise<FractioningPrintResponse> => {
		await delay(600);
		if (!data.quantidade || data.quantidade <= 0) {
			throw new Error("Quantidade inválida para impressão");
		}

		return {
			success: true,
			message: `Solicitação recebida para imprimir ${data.quantidade} etiqueta(s).`,
		};
	},
};
