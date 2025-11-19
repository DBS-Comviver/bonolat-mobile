import { api } from "@core/api";
import {
	FractioningItemResponse,
	FractioningDepositResponse,
	FractioningLocationResponse,
	FractioningBatchResponse,
	FractioningBoxResponse,
	FractioningFinalizeResponse,
} from "../types/fractioning";

export const fractioningApi = {
	getItem: async (it_codigo: string): Promise<FractioningItemResponse> => {
		const response = await api.get<FractioningItemResponse>("/api/fractioning/item", {
			params: { it_codigo },
		});
		return response.data;
	},

	getDeposits: async (
		cod_estabel: string,
		it_codigo: string
	): Promise<FractioningDepositResponse[]> => {
		const response = await api.get<FractioningDepositResponse[]>("/api/fractioning/deposits", {
			params: { cod_estabel, it_codigo },
		});
		return response.data;
	},

	getLocations: async (
		cod_estabel: string,
		it_codigo: string,
		cod_deposito: string
	): Promise<FractioningLocationResponse[]> => {
		const response = await api.get<FractioningLocationResponse[]>("/api/fractioning/locations", {
			params: { cod_estabel, it_codigo, cod_deposito },
		});
		return response.data;
	},

	getBatches: async (
		cod_estabel: string,
		it_codigo: string,
		cod_deposito: string
	): Promise<FractioningBatchResponse[]> => {
		const response = await api.get<FractioningBatchResponse[]>("/api/fractioning/batches", {
			params: { cod_estabel, it_codigo, cod_deposito },
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
		const response = await api.get<FractioningBoxResponse>("/api/fractioning/box-return", {
			params: { cod_estabel, it_codigo, cod_deposito, cod_local, cod_lote, quantidade },
		});
		return response.data;
	},

	finalizeFractioning: async (
		data: {
			cod_estabel: string;
			it_codigo: string;
			cod_deposito: string;
			cod_local: string;
			cod_lote: string;
			quantidade: number;
			validade: string;
			data_lote: string;
		}
	): Promise<FractioningFinalizeResponse> => {
		const response = await api.post<FractioningFinalizeResponse>("/api/fractioning/finalize", data);
		return response.data;
	},
};

