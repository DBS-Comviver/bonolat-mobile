import { FractioningItem, FractioningItemResponse } from "../types/fractioning";
import { getReadDate } from "./dateUtils";

export const createFractioningItem = (
	item: FractioningItemResponse,
	cod_lote: string,
	data_lote: string,
	quantidade: number,
	validade: string,
	expectedQuantity: number = 0
): FractioningItem => {
	const detailId = `detail-${Date.now()}-${Math.random()}`;
	return {
		id: `item-${Date.now()}-${Math.random()}`,
		it_codigo: item.it_codigo,
		desc_item: item.desc_item,
		expectedQuantity,
		readDate: getReadDate(),
		validationStatus: "pending",
		details: [
			{
				id: detailId,
				quantidade,
				cod_lote,
				validade,
				data_lote: data_lote || "",
				readDate: getReadDate(),
				validationStatus: "pending",
			},
		],
	};
};

export const createBoxItem = (
	it_codigo: string,
	desc_item: string,
	expectedQuantity: number
): FractioningItem => {
	return {
		id: `box-item-${Date.now()}-${Math.random()}`,
		it_codigo,
		desc_item,
		expectedQuantity,
		readDate: getReadDate(),
		validationStatus: "pending",
		details: [],
	};
};

export const calculateTotalQuantity = (item: FractioningItem): number => {
	return item.details.reduce((sum, detail) => sum + (detail.quantidade || 0), 0);
};

export const calculateAllItemsTotal = (items: FractioningItem[]): number => {
	return items.reduce((sum, item) => {
		const itemTotal = calculateTotalQuantity(item);
		return sum + itemTotal;
	}, 0);
};