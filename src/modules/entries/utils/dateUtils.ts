export const parseDate = (dateStr: string): Date | null => {
	if (!dateStr) return null;
	const parts = dateStr.split("/");
	if (parts.length !== 3) return null;
	const day = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10) - 1;
	const year = parseInt(parts[2], 10);
	return new Date(year, month, day);
};

export const formatDate = (dateStr: string): string => {
	if (!dateStr) return "";
	if (dateStr.includes("/")) return dateStr;
	const parts = dateStr.split("-");
	if (parts.length === 3) {
		return `${parts[2]}/${parts[1]}/${parts[0]}`;
	}
	return dateStr;
};

export const getToday = (): Date => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
};

export const getReadDate = (): string => {
	const now = new Date();
	return `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
};