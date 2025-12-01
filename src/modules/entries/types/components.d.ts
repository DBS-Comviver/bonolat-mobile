import type { SelectOption } from "@shared/components/Select";
import type { FractioningFinalizeResponse, FractioningItem, FractioningItemResponse } from "./fractioning";

export interface FinalizeResultModalProps {
	visible: boolean;
	response: FractioningFinalizeResponse | null;
	boxCode?: string;
	fractioningItems: FractioningItem[];
	onClose: () => void;
}

export interface PrintLabelButtonProps {
	canPrint: boolean;
	loading: boolean;
	onPress: () => void;
}

export interface FinalizeButtonProps {
	canFinalize: boolean;
	loading: boolean;
	onPress: () => void;
}

export interface CodeScannerProps {
	visible: boolean;
	onScan: (data: string) => void;
	onClose: () => void;
	title?: string;
}

export interface AddItemFormProps {
	visible: boolean;
	itemCode: string;
	itemInfo: FractioningItemResponse | null;
	lote: string;
	dataLote: string;
	validade: string;
	quantidade: string;
	batchOptions: Array<{ label: string; value: string }>;
	batches: Array<{ lote: string; dt_lote: string }>;
	loadingItem: boolean;
	loadingBatches: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	onItemCodeChange: (value: string) => void;
	onLoteChange: (value: string) => void;
	onDataLoteChange: (value: string) => void;
	onValidadeChange: (value: string) => void;
	onQuantidadeChange: (value: string) => void;
	onSearchItem: () => void;
	onLoadBatches: () => void;
}

export interface BoxInfoInputProps {
	boxCode: string;
	lote: string;
	quantidadeCaixas: string;
	ordemProducao: string;
	batelada: string;
	loading: boolean;
	codEstabel?: string;
	codDeposito?: string;
	codLocal?: string;
	onBoxCodeChange: (code: string) => void;
	onLoteChange: (lote: string) => void;
	onQuantidadeCaixasChange: (qty: string) => void;
	onOrdemProducaoChange: (ordemProducao: string) => void;
	onBateladaChange: (batelada: string) => void;
	onScanBox: () => void;
	onScanLot: () => void;
}

export interface ContextFieldsProps {
	depositOptions: SelectOption[];
	locationOptions: SelectOption[];
	establishmentId: string;
	depositId?: string;
	locationId?: string;
	onDepositChange: (value: string) => void;
	onLocationChange: (value: string) => void;
	errors?: {
		deposit?: string;
		location?: string;
	};
	disabled?: boolean;
}

export interface FractionedItemsTableProps {
	items: FractioningItem[];
	onEdit: (itemId: string) => void;
	onDelete: (itemId: string) => void;
}

export interface BoxItemsListProps {
	boxItems: FractioningItem[];
	fractioningItems: FractioningItem[];
	itemFields: Record<string, Array<{
		id: string;
		quantidade: string;
		lote: string;
		validade: string;
		dataFabricacao: string;
		itemCode?: string;
		added?: boolean;
		editingDetailId?: string;
		editingItemId?: string;
	}>>;
	onFieldChange: (itemId: string, fieldIndex: number, field: string, value: string) => void;
	onAddDetail: (itemId: string) => void;
	onRemoveDetail: (itemId: string, fieldIndex: number) => void;
	onConfirmItem: (itemId: string) => void;
	onCancelEdit: (itemId: string) => void;
	onEditItem: (itemId: string) => void;
	expandedItemId: string | null;
	setExpandedItemId: (id: string | null) => void;
}

export interface QuantityValidationProps {
	fractioningItems: FractioningItem[];
	boxItems: FractioningItem[];
}

export interface LotAndBoxQuantityInputProps {
	lote: string;
	quantidadeCaixas: string;
	loading: boolean;
	onLoteChange: (lote: string) => void;
	onQuantidadeCaixasChange: (qty: string) => void;
	onScanLot: () => void;
	onSearch: () => void;
}

export interface FilterSelectProps {
	value: string;
	options: Array<{ label: string; value: string }>;
	onChange: (value: string) => void;
	label: string;
	placeholder?: string;
	disabled?: boolean;
}

export interface ContextSectionProps {
	visible: boolean;
	locked: boolean;
	boxCode?: string;
	depositOptions: SelectOption[];
	locationOptions: SelectOption[];
	establishmentId: string;
	depositId?: string;
	locationId?: string;
	onDepositChange: (value: string) => void;
	onLocationChange: (value: string) => void;
	onToggleVisible: () => void;
	onLock: () => void;
	onUnlock: () => void;
}

export interface BoxCodeInputProps {
	boxCode?: string;
	onBoxCodeChange: (code: string) => void;
	onScanPress: () => void;
	onSearchPress: () => void;
	loading?: boolean;
	error?: string;
}

export interface BoxItemFormProps {
	item: FractioningItem;
	fields: {
		id: string;
		quantidade: string;
		lote: string;
		validade: string;
		dataFabricacao: string;
		itemCode?: string;
		added?: boolean;
		editingDetailId?: string;
		editingItemId?: string;
	};
	formIndex?: number;
	totalForms?: number;
	isExpanded: boolean;
	canEdit: boolean;
	onFieldChange: (field: string, value: string) => void;
	onAddDetail: () => void;
	onRemoveDetail: (fieldIndex: number) => void;
	onConfirm: () => void;
	onCancel: () => void;
	onToggleExpand: () => void;
}

