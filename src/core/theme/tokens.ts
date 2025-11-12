import { colors } from "@shared/constants/colors";

export const themeTokens = {
    colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        background: {
            light: colors.white,
            dark: colors.authDark,
        },
        text: {
            light: colors.black,
            dark: colors.white,
        },
        border: colors.gray[300],
        error: colors.red[500],
        success: colors.green[500],
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
    },
};

