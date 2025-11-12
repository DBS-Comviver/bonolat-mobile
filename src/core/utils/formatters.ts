export const formatters = {
    currency: (value: number, currency: string = "BRL"): string => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency,
        }).format(value);
    },

    date: (date: Date | string, format: "short" | "long" = "short"): string => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        const options: Intl.DateTimeFormatOptions =
            format === "short"
                ? { day: "2-digit", month: "2-digit", year: "numeric" }
                : { day: "2-digit", month: "long", year: "numeric" };
        return new Intl.DateTimeFormat("pt-BR", options).format(dateObj);
    },

    time: (date: Date | string): string => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(dateObj);
    },

    phone: (phone: string): string => {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    },
};

