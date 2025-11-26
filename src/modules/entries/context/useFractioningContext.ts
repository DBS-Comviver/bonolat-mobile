import { storageService } from "@core/services/storage/storageService";
import { useEffect, useState } from "react";
import { fractioningApi } from "../api/fractioning.api";
import { FractioningDepositResponse, FractioningLocationResponse } from "../types/fractioning";

const STORAGE_KEY = "fractioning_context";

interface UseFractioningContextReturn {
	cod_estabel: string;
	cod_deposito?: string;
	cod_local?: string;
	deposits: FractioningDepositResponse[];
	locations: FractioningLocationResponse[];
	loadingDeposits: boolean;
	loadingLocations: boolean;
	setCodEstabel: (value: string) => void;
	setCodDeposito: (value: string) => void;
	setCodLocal: (value: string) => void;
	reset: () => void;
}

export function useFractioningContext(boxCode?: string): UseFractioningContextReturn {
	const [cod_estabel] = useState<string>("2202");
	const [cod_deposito, setCodDepositoState] = useState<string | undefined>();
	const [cod_local, setCodLocalState] = useState<string | undefined>();

	const [deposits, setDeposits] = useState<FractioningDepositResponse[]>([]);
	const [loadingDeposits, setLoadingDeposits] = useState(false);

	const [locations, setLocations] = useState<FractioningLocationResponse[]>([]);
	const [loadingLocations, setLoadingLocations] = useState(false);

	useEffect(() => {
		if (cod_estabel || cod_deposito || cod_local) {
			saveContextToStorage();
		}
	}, [cod_estabel, cod_deposito, cod_local]);

	useEffect(() => {
		if (cod_estabel) {
			loadDeposits();
		} else {
			setDeposits([]);
		}
	}, [boxCode, cod_estabel]);

	useEffect(() => {
		if (cod_estabel && cod_deposito) {
			loadLocations();
		} else {
			setLocations([]);
		}
	}, [boxCode, cod_estabel, cod_deposito]);

	const saveContextToStorage = async () => {
		try {
			await storageService.setItem(STORAGE_KEY, {
				cod_estabel,
				cod_deposito,
				cod_local,
			});
		} catch (error) {
			console.error("Error saving context to storage:", error);
		}
	};

	const loadDeposits = async () => {
		if (!cod_estabel) {
			setDeposits([]);
			setCodDepositoState(undefined);
			return;
		}

		setLoadingDeposits(true);
		try {
			const data = await fractioningApi.getDeposits(cod_estabel, boxCode);
			setDeposits(Array.isArray(data) ? data : []);
		} catch (error: any) {
			console.error("Error loading deposits:", error);
			setDeposits([]);
		} finally {
			setLoadingDeposits(false);
		}
	};

	const loadLocations = async () => {
		if (!cod_estabel || !cod_deposito) {
			setLocations([]);
			setCodLocalState(undefined);
			return;
		}

		setLoadingLocations(true);
		try {
			const data = await fractioningApi.getLocations(cod_estabel, cod_deposito);
			setLocations(Array.isArray(data) ? data : []);
		} catch (error: any) {
			console.error("Error loading locations:", error);
			setLocations([]);
		} finally {
			setLoadingLocations(false);
		}
	};

	const setCodEstabel = (value: string) => {
		if (value !== "2202") {
			setCodDepositoState(undefined);
			setCodLocalState(undefined);
			setDeposits([]);
			setLocations([]);
		}
	};

	const setCodDeposito = (value: string) => {
		setCodDepositoState(value);
		setCodLocalState(undefined);
		setLocations([]);
	};

	const setCodLocal = (value: string) => {
		setCodLocalState(value);
	};

	const reset = () => {
		setCodDepositoState(undefined);
		setCodLocalState(undefined);
		setDeposits([]);
		setLocations([]);
	};

	return {
		cod_estabel,
		cod_deposito,
		cod_local,
		deposits,
		locations,
		loadingDeposits,
		loadingLocations,
		setCodEstabel,
		setCodDeposito,
		setCodLocal,
		reset,
	};
}