export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Entries: undefined;
    Fractionation: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

