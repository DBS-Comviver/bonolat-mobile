export interface ParsedBarcode {
	item_code?: string;
	lote?: string;
	validade?: string;
}

export function parseGS1Barcode(code: string): ParsedBarcode | null {
	if (!code || typeof code !== 'string') {
		return null;
	}

	let item_code: string | undefined;
	let lote: string | undefined;

	const cleanCode = code.replace(/\s+/g, '').replace(/\*/g, '').replace(/[^\d()]/g, '');

	const code240Match = cleanCode.match(/240(\d+)/);
	if (code240Match) {
		const after240 = code240Match[1];
		const lot10Index = after240.indexOf('10');
		
		if (lot10Index > 0) {
			item_code = after240.substring(0, lot10Index);
		} else {
			const nextIdMatch = after240.search(/(1[0-9]|2[0-9]|9[0-9])/);
			if (nextIdMatch > 0) {
				item_code = after240.substring(0, nextIdMatch);
			} else {
				item_code = after240;
			}
		}
		
		if (item_code && item_code.length > 0) {
			item_code = item_code.replace(/^0+/, '');
		}
	}

	const lot10Match = cleanCode.match(/10(\d+)/);
	let validade: string | undefined;
	
	if (lot10Match) {
		const after10 = lot10Match[1];
		
		const validade15Index = after10.search(/15\d{6}/);
		if (validade15Index >= 0) {
			const validadeYYMMDD = after10.substring(validade15Index + 2, validade15Index + 8);
			const year = parseInt(validadeYYMMDD.substring(0, 2), 10);
			const month = validadeYYMMDD.substring(2, 4);
			const day = validadeYYMMDD.substring(4, 6);
			const fullYear = year <= 50 ? 2000 + year : 1900 + year;
			validade = `${day}/${month}/${fullYear}`;

			if (validade15Index > 0) {
				lote = after10.substring(0, validade15Index);
			} else {
				lote = "";
			}
		} else {

			if (after10.length >= 10) {
				lote = after10.substring(0, 10);
			} else {
				const nextIdentifierPattern = /(1[5-9]|2[0-9]|9[0-9])/;
				const nextIdMatch = after10.search(nextIdentifierPattern);
				
				if (nextIdMatch > 0) {
					lote = after10.substring(0, nextIdMatch);
				} else {
					lote = after10;
				}
			}
		}
		
		if (lote && lote.length > 0) {
			lote = lote.padStart(10, '0');
		}
	}

	if (item_code || lote || validade) {
		return { item_code, lote, validade };
	}

	const itemMatch = cleanCode.match(/01(\d{14})/);
	const lotMatch = cleanCode.match(/10(\d+)/);
	const validadeMatch = cleanCode.match(/15(\d{6})/);
	
	if (itemMatch || lotMatch || validadeMatch) {
		let parsedValidade: string | undefined;
		if (validadeMatch) {
			const validadeYYMMDD = validadeMatch[1];
			const year = parseInt(validadeYYMMDD.substring(0, 2), 10);
			const month = validadeYYMMDD.substring(2, 4);
			const day = validadeYYMMDD.substring(4, 6);
			const fullYear = year <= 50 ? 2000 + year : 1900 + year;
			parsedValidade = `${day}/${month}/${fullYear}`;
		}
		
		return {
			item_code: itemMatch ? itemMatch[1] : undefined,
			lote: lotMatch ? lotMatch[1] : undefined,
			validade: parsedValidade,
		};
	}

	return null;
}

