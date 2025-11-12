import { useContext } from "react";
import { ThemeContext } from "@core/contexts/ThemeContext";

export function useTheme() {
    return useContext(ThemeContext);
}

