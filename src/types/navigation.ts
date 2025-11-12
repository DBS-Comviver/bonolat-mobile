export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

