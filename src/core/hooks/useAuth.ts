import { useContext } from "react";
import { AuthContext } from "@core/contexts/AuthContext";

export function useAuth() {
    return useContext(AuthContext);
}

