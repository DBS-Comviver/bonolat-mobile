import { api } from "@core/api";
import {
	BateladasResponse,
	BoxDetailsResponse,
	BoxItemsResponse,
	BoxOverview,
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
	OrdersResponse,
} from "../types/fractioning";
import { fractioningMock } from "./fractioning.mock";

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === "true";

export const isMockMode = USE_MOCK;

export const fractioningApi = {
	getItem: async (it_codigo: string): Promise<FractioningItemResponse> => {
		if (USE_MOCK) {
			return fractioningMock.getItem(it_codigo);
		}
		const response = await api.get<FractioningItemResponse>("/api/fractioning/item", {
			params: { it_codigo },
		});
		return response.data;
	},

	getDeposits: async (
		cod_estabel: string,
		box_code?: string
	): Promise<FractioningDepositResponse[]> => {
		if (USE_MOCK) {
			return fractioningMock.getDeposits(cod_estabel);
		}
		const params: any = { cod_estabel };
		if (box_code) {
			params.box_code = box_code;
		}
		const response = await api.get<
			| { total: number; hasNext: boolean; items: FractioningDepositResponse[] }
			| FractioningDepositResponse[]
		>("/api/fractioning/deposits", {
			params,
		});
		if (Array.isArray(response.data)) {
			return response.data;
		}
		return response.data.items || [];
	},

	getLocations: async (
		cod_estabel: string,
		cod_deposito: string
	): Promise<FractioningLocationResponse[]> => {
		if (USE_MOCK) {
			return fractioningMock.getLocations(cod_estabel, cod_deposito);
		}
		const response = await api.get<
			| { total: number; hasNext: boolean; items: FractioningLocationResponse[] }
			| FractioningLocationResponse[]
		>("/api/fractioning/locations", {
			params: { cod_estabel, cod_deposito },
		});
		if (Array.isArray(response.data)) {
			return response.data;
		}
		return response.data.items || [];
	},

	getBatches: async (
		cod_estabel: string,
		it_codigo: string,
		cod_deposito: string,
		cod_local: string
	): Promise<FractioningBatchResponse> => {
		if (USE_MOCK) {
			return fractioningMock.getBatches(cod_estabel, it_codigo, cod_deposito, cod_local);
		}
		const response = await api.get<FractioningBatchResponse>("/api/fractioning/batches", {
			params: { cod_estabel, it_codigo, cod_deposito, cod_local },
		});
		return response.data;
	},

	getBoxReturn: async (
		cod_estabel: string,
		it_codigo: string,
		cod_deposito: string,
		cod_local: string,
		cod_lote: string,
		quantidade: number
	): Promise<FractioningBoxResponse> => {
		if (USE_MOCK) {
			return fractioningMock.getBoxReturn(
				cod_estabel,
				it_codigo,
				cod_deposito,
				cod_local,
				cod_lote,
				quantidade
			);
		}
		const response = await api.get<FractioningBoxResponse>("/api/fractioning/box-return", {
			params: { cod_estabel, it_codigo, cod_deposito, cod_local, cod_lote, quantidade },
		});
		return response.data;
	},

	getBoxItems: async (box_code: string): Promise<BoxItemsResponse> => {
		if (USE_MOCK) {
			return fractioningMock.getBoxItems(box_code);
		}
		const response = await api.get<BoxItemsResponse>("/api/fractioning/box-items", {
			params: { box_code },
		});
		return response.data;
	},

	listOrders: async (): Promise<OrdersResponse> => {
		if (USE_MOCK) {
			const mock = await fractioningMock.getFilterOptions();
			return { ordens: mock.ordens };
		}
		const response = await api.get<OrdersResponse>("/api/fractioning/op-orders");
		return response.data;
	},

	listBateladas: async (ordem_producao?: string): Promise<BateladasResponse> => {
		if (USE_MOCK) {
			const mock = await fractioningMock.getFilterOptions();
			return { bateladas: mock.bateladas };
		}
		const params = ordem_producao ? { ordem_producao } : undefined;
		const response = await api.get<BateladasResponse>("/api/fractioning/op-bateladas", {
			params,
		});
		return response.data;
	},

	getFilterOptions: async (): Promise<FilterOptionsResponse> => {
		if (USE_MOCK) {
			return fractioningMock.getFilterOptions();
		}
		const response = await api.get<FilterOptionsResponse>("/api/fractioning/filter-options");
		return response.data;
	},

	searchBoxes: async (filters: {
		ordem_producao?: string;
		batelada?: string;
	}): Promise<BoxOverview[]> => {
		if (USE_MOCK) {
			return fractioningMock.searchBoxes(filters);
		}
		const response = await api.get<BoxOverview[]>("/api/fractioning/op-search", {
			params: filters,
		});
		return response.data;
	},

	getBoxMaterials: async (box_code: string): Promise<BoxDetailsResponse> => {
		if (USE_MOCK) {
			return fractioningMock.getBoxMaterials(box_code);
		}
		const response = await api.get<BoxDetailsResponse>("/api/fractioning/box-items", {
			params: { box_code },
		});
		return response.data;
	},

	getExpectedItems: async (
		cod_estabel: string,
		cod_deposito: string,
		cod_local: string,
		cod_lote: string,
		quantidade: number,
		it_codigo: string
	): Promise<ExpectedItemsResponse> => {
		if (USE_MOCK) {
			return fractioningMock.getExpectedItems(
				cod_estabel,
				cod_deposito,
				cod_local,
				cod_lote,
				quantidade,
				it_codigo
			);
		}
		const response = await api.get<FractioningBoxResponse>("/api/fractioning/box-return", {
			params: { cod_estabel, it_codigo, cod_deposito, cod_local, cod_lote, quantidade },
		});
		const boxReturn = response.data;
		return {
			items: boxReturn.items.map(item => ({
				it_codigo: item.it_codigo,
				desc_item: item.desc_item,
				quant_usada: item.quant_usada,
			})),
		};
	},

	finalizeFractioning: async (data: FractioningFinalizeData): Promise<FractioningFinalizeResponse> => {
		if (USE_MOCK) {
			return fractioningMock.finalizeFractioning(data);
		}
		const response = await api.post<FractioningFinalizeResponse>(
			"/api/fractioning/finalize",
			data
		);
		return response.data;
	},

	printLabels: async (payload: FractioningPrintPayload): Promise<FractioningPrintResponse> => {
		if (USE_MOCK) {
			return fractioningMock.printLabels(payload);
		}
		const response = await api.post<FractioningPrintResponse>(
			"/api/fractioning/print-labels",
			payload
		);
		return response.data;
	},
};