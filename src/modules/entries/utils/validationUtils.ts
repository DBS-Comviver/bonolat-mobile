import { Alert } from "react-native";
import { FractioningItem, FractioningItemDetail } from "../types/fractioning";
import { getToday, parseDate } from "./dateUtils";

export const validateDateFields = (itemCode: string, detail: FractioningItemDetail): boolean => {
	if (!detail.data_lote || !detail.validade) {
		Alert.alert("Atenção", `Item ${itemCode} - Lote ${detail.cod_lote}: Preencha data de fabricação e validade`);
		return false;
	}

	const dataFabricacao = parseDate(detail.data_lote);
	const dataValidade = parseDate(detail.validade);

	if (!dataFabricacao || !dataValidade) {
		Alert.alert("Atenção", `Item ${itemCode} - Lote ${detail.cod_lote}: Formato de data inválido. Use DD/MM/AAAA`);
		return false;
	}

	const today = getToday();

	if (dataFabricacao > today) {
		Alert.alert(
			"Atenção - Data Inválida",
			`Item ${itemCode} - Lote ${detail.cod_lote}:\n\nData de fabricação (${detail.data_lote}) não pode ser maior que a data de hoje.`,
			[{ text: "OK" }]
		);
		return false;
	}

	if (dataValidade <= dataFabricacao) {
		Alert.alert(
			"Atenção - Data Inválida",
			`Item ${itemCode} - Lote ${detail.cod_lote}:\n\nData de validade (${detail.validade}) deve ser maior que a data de fabricação (${detail.data_lote}).`,
			[{ text: "OK" }]
		);
		return false;
	}

	return true;
};

export const validateQuantityMatch = (expected: number, informed: number, itemCode: string): boolean => {
	if (expected > 0 && Math.abs(informed - expected) > 0.0001) {
		const difference = informed - expected;
		Alert.alert(
			"Atenção - Quantidade Divergente",
			`Item ${itemCode}:\n\nQuantidade esperada: ${expected.toFixed(4)}\nQuantidade informada: ${informed.toFixed(4)}\nDiferença: ${difference > 0 ? "+" : ""}${difference.toFixed(4)}\n\nCorrija a quantidade antes de finalizar.`,
			[{ text: "OK" }]
		);
		return false;
	}
	return true;
};

export const validateItemDetail = (item: FractioningItem, detail: FractioningItemDetail): string[] => {
	const problems: string[] = [];
	
	if (!detail.quantidade || detail.quantidade <= 0) {
		problems.push("Quantidade inválida");
	}
	if (!detail.cod_lote) {
		problems.push("Lote não informado");
	}
	if (!detail.validade) {
		problems.push("Validade não informada");
	}
	if (!detail.data_lote) {
		problems.push("Data de fabricação não informada");
	}

	if (detail.data_lote && detail.validade) {
		const dataFabricacao = parseDate(detail.data_lote);
		const dataValidade = parseDate(detail.validade);
		const today = getToday();

		if (dataFabricacao && dataFabricacao > today) {
			problems.push("Data de fabricação maior que hoje");
		}
		if (dataFabricacao && dataValidade && dataValidade <= dataFabricacao) {
			problems.push("Validade deve ser maior que fabricação");
		}
	}

	return problems;
};

export const validateItemStatus = (item: FractioningItem): "valid" | "invalid" => {
	for (const detail of item.details) {
		const detailProblems = validateItemDetail(item, detail);
		if (detailProblems.length > 0) {
			return "invalid";
		}
	}

	if (item.expectedQuantity > 0) {
		const totalQuantity = item.details.reduce((sum, d) => sum + (d.quantidade || 0), 0);
		if (Math.abs(totalQuantity - item.expectedQuantity) > 0.0001) {
			return "invalid";
		}
	}

	return "valid";
};