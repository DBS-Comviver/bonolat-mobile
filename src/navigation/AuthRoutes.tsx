import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "@modules/auth/screens/Login";
import { Register } from "@modules/auth/screens/Register";
import { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AuthRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
}

