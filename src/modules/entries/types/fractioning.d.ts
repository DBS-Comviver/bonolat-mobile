export interface FractioningItemResponse {
	it_codigo: string;
	desc_item: string;
}

export interface FractioningDepositResponse {
	cod_depos: string;
	nome: string;
}

export interface FractioningLocationResponse {
	cod_local: string;
	nome: string;
}

export interface FractioningBatchResponse {
	lote: string;
	dt_lote: string;
}

export interface FractioningBoxResponse {
	it_codigo: string;
	desc_item: string;
	quant_usada: string;
	mensagem: string;
}

export interface FractioningFinalizeResponse {
	desc_erro: string;
}

export interface FractioningContext {
	cod_estabel?: string;
	cod_deposito?: string;
	cod_local?: string;
	it_codigo?: string;
	cod_lote?: string;
}

export interface FractioningItem {
	id: string;
	it_codigo: string;
	desc_item: string;
	expectedQuantity: number;
	details: FractioningItemDetail[];
}

export interface FractioningItemDetail {
	id: string;
	quantidade: number;
	cod_lote?: string;
	validade?: string;
	data_lote?: string;
}

export interface FractioningFinalizeData {
	cod_estabel: string;
	it_codigo: string;
	cod_deposito: string;
	cod_local: string;
	cod_lote: string;
	quantidade: number;
	validade: string;
	data_lote: string;
}

