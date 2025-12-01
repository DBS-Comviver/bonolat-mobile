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

export interface FractioningBoxResponseItem {
	mensagem: string;
	it_codigo: string;
	desc_item: string;
	quant_usada: number;
}

export interface FractioningBoxResponse {
	total: number;
	hasNext: boolean;
	items: FractioningBoxResponseItem[];
}

export interface FractioningFinalizeResponseItem {
	mensagem: string;
	it_codigo: string;
	desc_item: string;
	quant_usada: number;
}

export interface FractioningFinalizeResponse {
	total: number;
	hasNext: boolean;
	items: FractioningFinalizeResponseItem[];
}

export interface BoxItem {
	it_codigo: string;
	desc_item: string;
	quantidade_esperada: number;
}

export interface BoxItemsResponse {
	box_code: string;
	box_description: string;
	total_quantity: number;
	cod_estabel?: string;
	cod_deposito?: string;
	cod_local?: string;
	items: BoxItem[];
}

export interface ExpectedItem {
	it_codigo: string;
	desc_item: string;
	quant_usada: number;
	mensagem?: string;
}

export interface ExpectedItemsResponse {
	items: ExpectedItem[];
}

export interface FilterOption {
	label: string;
	value: string;
}

export interface FilterOptionsResponse {
	ordens: FilterOption[];
	bateladas: FilterOption[];
}

export interface OrdersResponse {
	ordens: FilterOption[];
}

export interface BateladasResponse {
	bateladas: FilterOption[];
}

export interface BoxOverview {
	box_code: string;
	box_description: string;
	lote: string;
	data_lote?: string;
	quantidade?: number;
	ordem_producao?: string;
	batelada?: string;
	cod_estabel?: string;
	cod_deposito?: string;
	cod_local?: string;
}

export interface BoxMaterialDetail {
	it_codigo: string;
	desc_item: string;
	quantidade: number;
	lote: string;
	data_fabricacao?: string;
	validade?: string;
	rastreabilidade?: string;
}

export interface BoxDetailsResponse {
	box_code: string;
	materials: BoxMaterialDetail[];
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
	readDate?: string;
	boxReturnData?: FractioningBoxResponse;
	validationStatus?: "pending" | "valid" | "invalid";
	details: FractioningItemDetail[];
}

export interface FractioningItemDetail {
	id: string;
	quantidade: number;
	cod_lote?: string;
	validade?: string;
	data_lote?: string;
	readDate?: string;
	validationStatus?: "pending" | "valid" | "invalid";
}

export interface FractioningFinalizeData {
	cod_estabel: string;
	it_codigo: string;
	cod_deposito: string;
	cod_local: string;
	cod_lote: string;
	quantidade: number;
	dados_baixa: string;
	ordem_producao?: string;
	batelada?: string;
}

export interface FractioningPrintPayload {
	cod_estabel: string;
	cod_deposito: string;
	cod_local: string;
	box_code: string;
	ordem_producao?: string;
	batelada?: string;
	quantidade: number;
}
