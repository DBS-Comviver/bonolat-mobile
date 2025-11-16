import { colors } from "@shared/constants/colors";
import { useTheme } from "./useTheme";

export function useThemeColors() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return {
        primary: colors.primary,
        secondary: colors.secondary,
        background: isDark ? colors.authDark : colors.white,
        backgroundLight: isDark ? colors.gray[800] : colors.gray[50],
        headerBackground: isDark ? colors.authDark : colors.blue[900],
        text: isDark ? colors.white : colors.black,
        textSecondary: isDark ? colors.gray[300] : colors.gray[600],
        textMuted: isDark ? colors.gray[400] : colors.gray[500],
        border: isDark ? colors.gray[700] : colors.gray[300],
        borderFocus: colors.primary,
        inputBackground: isDark ? colors.gray[800] : colors.white,
        inputText: isDark ? colors.white : colors.black,
        inputPlaceholder: isDark ? colors.gray[400] : colors.gray[400],
        error: colors.red[500],
        errorLight: colors.red[400],
        errorBackground: isDark ? `${colors.red[500]}20` : `${colors.red[500]}10`,
        errorBorder: colors.red[500],
        success: colors.green[500],
        successLight: colors.green[400],
        white: colors.white,
        black: colors.black,
        gray: colors.gray,
        red: colors.red,
        green: colors.green,
        blue: colors.blue,
    };
}

