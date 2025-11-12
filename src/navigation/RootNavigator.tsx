import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "@core/hooks/useAuth";
import { AuthRoutes } from "./AuthRoutes";
import { AppRoutes } from "./AppRoutes";

function RootNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            {user ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    );
}

export default RootNavigator;