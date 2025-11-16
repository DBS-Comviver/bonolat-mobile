import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@modules/home/screens/Home";
import { Entries, Fractionation } from "@modules/entries";
import { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Entries" component={Entries} />
            <Stack.Screen name="Fractionation" component={Fractionation} />
        </Stack.Navigator>
    );
}

