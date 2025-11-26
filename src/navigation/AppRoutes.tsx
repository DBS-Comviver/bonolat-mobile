import { RootStackParamList } from "@/types/navigation";
import { Entries, Fractioning, SearchOP } from "@modules/entries";
import Home from "@modules/home/screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Entries" component={Entries} />
            <Stack.Screen name="Fractioning" component={Fractioning} />
            <Stack.Screen name="SearchOP" component={SearchOP} />
        </Stack.Navigator>
    );
}