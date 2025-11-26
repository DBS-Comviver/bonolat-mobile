import { fractioningMock } from '../fractioning.mock';

describe('fractioningMock', () => {
	describe('getFilterOptions', () => {
		it('should return filter options with ordens and bateladas', async () => {
			const result = await fractioningMock.getFilterOptions();

			expect(result).toBeDefined();
			expect(result.ordens).toBeDefined();
			expect(result.bateladas).toBeDefined();
			expect(result.ordens.length).toBeGreaterThan(0);
			expect(result.bateladas.length).toBeGreaterThan(0);
			expect(result.ordens[0]).toHaveProperty('label');
			expect(result.ordens[0]).toHaveProperty('value');
		});
	});

	describe('searchBoxes', () => {
		it('should filter boxes by ordem_producao', async () => {
			const result = await fractioningMock.searchBoxes({ ordem_producao: '1547' });

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				expect(result[0].ordem_producao).toBe('1547');
			}
		});

		it('should filter boxes by batelada', async () => {
			const result = await fractioningMock.searchBoxes({ batelada: 'BAT-001' });

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				expect(result[0].batelada).toBe('BAT-001');
			}
		});

		it('should handle OP- prefix in ordem_producao', async () => {
			const result = await fractioningMock.searchBoxes({ ordem_producao: 'OP-1547' });

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});

		it('should return empty array when no matches', async () => {
			const result = await fractioningMock.searchBoxes({ ordem_producao: '9999' });

			expect(result).toEqual([]);
		});
	});

	describe('getBoxMaterials', () => {
		it('should return materials for existing box', async () => {
			const result = await fractioningMock.getBoxMaterials('15478788');

			expect(result).toBeDefined();
			expect(result.box_code).toBe('15478788');
			expect(result.materials).toBeDefined();
			expect(Array.isArray(result.materials)).toBe(true);
			if (result.materials.length > 0) {
				expect(result.materials[0]).toHaveProperty('it_codigo');
				expect(result.materials[0]).toHaveProperty('desc_item');
				expect(result.materials[0]).toHaveProperty('quantidade');
				expect(result.materials[0]).toHaveProperty('lote');
			}
		});

		it('should return empty materials for non-existent box', async () => {
			const result = await fractioningMock.getBoxMaterials('99999999');

			expect(result).toBeDefined();
			expect(result.box_code).toBe('99999999');
			expect(result.materials).toEqual([]);
		});
	});

	describe('finalizeFractioning', () => {
		it('should return success for valid data', async () => {
			const data = {
				cod_estabel: '2202',
				it_codigo: '3066865',
				cod_deposito: 'SIL',
				cod_local: 'LOC001',
				cod_lote: '67248',
				quantidade: 100.5,
				dados_baixa: 'CONC-UVA-001,25.0,67248,20/10/2025,17/12/2025',
				ordem_producao: '1547',
				batelada: 'BAT-001',
			};

			const result = await fractioningMock.finalizeFractioning(data);

			expect(result).toBeDefined();
			expect(result.desc_erro).toContain('OK');
		});

		it('should return error for missing required fields', async () => {
			const data = {
				cod_estabel: '',
				it_codigo: '3066865',
				cod_deposito: 'SIL',
				cod_local: 'LOC001',
				cod_lote: '67248',
				quantidade: 100.5,
				dados_baixa: 'CONC-UVA-001,25.0,67248,20/10/2025,17/12/2025',
			};

			const result = await fractioningMock.finalizeFractioning(data);

			expect(result.desc_erro).toContain('ERRO');
		});

		it('should validate date format', async () => {
			const data = {
				cod_estabel: '2202',
				it_codigo: '3066865',
				cod_deposito: 'SIL',
				cod_local: 'LOC001',
				cod_lote: '67248',
				quantidade: 100.5,
				dados_baixa: 'CONC-UVA-001,25.0,67248,invalid-date,invalid-date',
			};

			const result = await fractioningMock.finalizeFractioning(data);

			expect(result.desc_erro).toContain('ERRO');
			expect(result.desc_erro).toContain('data');
		});
	});

	describe('printLabels', () => {
		it('should return success for valid payload', async () => {
			const payload = {
				cod_estabel: '2202',
				cod_deposito: 'SIL',
				cod_local: 'LOC001',
				box_code: '15478788',
				ordem_producao: '1547',
				batelada: 'BAT-001',
				quantidade: 2,
			};

			const result = await fractioningMock.printLabels(payload);

			expect(result.success).toBe(true);
			expect(result.message).toContain('2 etiqueta');
		});

		it('should throw error for invalid quantity', async () => {
			const payload = {
				cod_estabel: '2202',
				cod_deposito: 'SIL',
				cod_local: 'LOC001',
				box_code: '15478788',
				quantidade: 0,
			};

			await expect(fractioningMock.printLabels(payload)).rejects.toThrow('Quantidade inválida');
		});
	});
});


