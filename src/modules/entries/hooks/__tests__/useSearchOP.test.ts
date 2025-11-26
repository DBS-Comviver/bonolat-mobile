import { renderHook, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useSearchOP } from '../useSearchOP';
import { fractioningApi } from '../../api/fractioning.api';

jest.mock('../../api/fractioning.api');
jest.mock('react-native', () => ({
	Alert: {
		alert: jest.fn(),
	},
	Keyboard: {
		dismiss: jest.fn(),
	},
}));

describe('useSearchOP', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should initialize with empty values', () => {
		const { result } = renderHook(() => useSearchOP());

		expect(result.current.ordemProducao).toBe('');
		expect(result.current.batelada).toBe('');
		expect(result.current.boxes).toEqual([]);
		expect(result.current.loadingFilters).toBe(false);
		expect(result.current.loadingBoxes).toBe(false);
	});

	it('should load filter options on mount', async () => {
		const mockOrders = {
			ordens: [
				{ label: 'OP-1547', value: '1547' },
				{ label: 'OP-2202', value: '2202' },
			],
		};

		(fractioningApi.listOrders as jest.Mock) = jest.fn().mockResolvedValue(mockOrders);

		const { result } = renderHook(() => useSearchOP());

		await waitFor(() => {
			expect(result.current.loadingFilters).toBe(false);
		});

		expect(fractioningApi.listOrders).toHaveBeenCalled();
		expect(result.current.orderOptions).toEqual(mockOrders.ordens);
	});

	it('should load bateladas when ordemProducao changes', async () => {
		const mockBateladas = {
			bateladas: [
				{ label: 'BAT-001', value: 'BAT-001' },
				{ label: 'BAT-002', value: 'BAT-002' },
			],
		};

		(fractioningApi.listBateladas as jest.Mock) = jest.fn().mockResolvedValue(mockBateladas);

		const { result } = renderHook(() => useSearchOP());

		result.current.setOrdemProducao('1547');

		await waitFor(() => {
			expect(fractioningApi.listBateladas).toHaveBeenCalledWith('1547');
		});

		expect(result.current.bateladaOptions).toEqual(mockBateladas.bateladas);
	});

	it('should handle search with ordem_producao', async () => {
		const mockBoxes = [
			{
				box_code: '15478788',
				box_description: 'CAIXA TESTE',
				lote: '67248',
				ordem_producao: '1547',
				batelada: 'BAT-001',
			},
		];

		(fractioningApi.searchBoxes as jest.Mock) = jest.fn().mockResolvedValue(mockBoxes);

		const { result } = renderHook(() => useSearchOP());

		result.current.setOrdemProducao('1547');
		result.current.handleSearch();

		await waitFor(() => {
			expect(result.current.loadingBoxes).toBe(false);
		});

		expect(fractioningApi.searchBoxes).toHaveBeenCalledWith({ ordem_producao: '1547' });
		expect(result.current.boxes).toEqual(mockBoxes);
	});

	it('should handle search with batelada', async () => {
		const mockBoxes = [
			{
				box_code: '15478788',
				box_description: 'CAIXA TESTE',
				lote: '67248',
				ordem_producao: '1547',
				batelada: 'BAT-001',
			},
		];

		(fractioningApi.searchBoxes as jest.Mock) = jest.fn().mockResolvedValue(mockBoxes);

		const { result } = renderHook(() => useSearchOP());

		result.current.setBatelada('BAT-001');
		result.current.handleSearch();

		await waitFor(() => {
			expect(result.current.loadingBoxes).toBe(false);
		});

		expect(fractioningApi.searchBoxes).toHaveBeenCalledWith({ batelada: 'BAT-001' });
		expect(result.current.boxes).toEqual(mockBoxes);
	});

	it('should show alert when search without filters', () => {
		const { result } = renderHook(() => useSearchOP());

		result.current.handleSearch();

		expect(Alert.alert).toHaveBeenCalledWith(
			'Atenção',
			'Informe ao menos uma Ordem de Produção ou Batelada'
		);
	});

	it('should clear filters', () => {
		const { result } = renderHook(() => useSearchOP());

		result.current.setOrdemProducao('1547');
		result.current.setBatelada('BAT-001');
		result.current.handleClearFilters();

		expect(result.current.ordemProducao).toBe('');
		expect(result.current.batelada).toBe('');
		expect(result.current.boxes).toEqual([]);
	});

	it('should toggle box expansion', async () => {
		const mockMaterials = {
			box_code: '15478788',
			materials: [
				{
					it_codigo: 'CONC-UVA-001',
					desc_item: 'CONCENTRADO DE UVA TINTO 1L',
					quantidade: 25.0,
					lote: '67248',
					data_fabricacao: '20/10/2025',
				},
			],
		};

		(fractioningApi.getBoxMaterials as jest.Mock) = jest.fn().mockResolvedValue(mockMaterials);

		const { result } = renderHook(() => useSearchOP());

		result.current.toggleBox('15478788');

		await waitFor(() => {
			expect(result.current.expandedBoxCode).toBe('15478788');
		});

		expect(fractioningApi.getBoxMaterials).toHaveBeenCalledWith('15478788');
		expect(result.current.boxMaterials['15478788']).toEqual(mockMaterials.materials);
	});

	it('should handle print label', async () => {
		const mockResponse = {
			success: true,
			message: 'Solicitação recebida para imprimir 2 etiqueta(s).',
		};

		(fractioningApi.printLabels as jest.Mock) = jest.fn().mockResolvedValue(mockResponse);

		const { result } = renderHook(() => useSearchOP());

		const mockBox = {
			box_code: '15478788',
			box_description: 'CAIXA TESTE',
			lote: '67248',
			cod_estabel: '2202',
			cod_deposito: 'SIL',
			cod_local: 'LOC001',
			ordem_producao: '1547',
			batelada: 'BAT-001',
		};

		result.current.openPrintForBox(mockBox);
		result.current.setLabelQuantity('2');
		result.current.handleConfirmPrint();

		await waitFor(() => {
			expect(result.current.loadingPrint).toBe(false);
		});

		expect(fractioningApi.printLabels).toHaveBeenCalledWith({
			cod_estabel: '2202',
			cod_deposito: 'SIL',
			cod_local: 'LOC001',
			box_code: '15478788',
			ordem_producao: '1547',
			batelada: 'BAT-001',
			quantidade: 2,
		});
	});
});


