export const masks = {
    cpf: (value: string): string => {
        const cleaned = value.replace(/\D/g, "");
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },

    cnpj: (value: string): string => {
        const cleaned = value.replace(/\D/g, "");
        return cleaned.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            "$1.$2.$3/$4-$5"
        );
    },

    phone: (value: string): string => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    },

    cep: (value: string): string => {
        const cleaned = value.replace(/\D/g, "");
        return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
    },

    currency: (value: string): string => {
        const cleaned = value.replace(/\D/g, "");
        const number = parseFloat(cleaned) / 100;
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(number);
    },
};

