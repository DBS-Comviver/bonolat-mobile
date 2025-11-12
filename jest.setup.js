if (typeof global !== "undefined") {
    global.__DEV__ = true;
}

jest.mock("react-native-reanimated", () => {
    try {
        const Reanimated = require("react-native-reanimated/mock");
        if (Reanimated && Reanimated.default) {
            Reanimated.default.call = () => {};
        }
        return Reanimated;
    } catch {
        return {};
    }
});

jest.mock("@react-native-async-storage/async-storage", () => {
    try {
        return require("@react-native-async-storage/async-storage/jest/async-storage-mock");
    } catch {
        return {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        };
    }
});

jest.mock("expo-constants", () => ({
    default: {
        expoConfig: {
            extra: {},
        },
    },
}));

jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useSegments: () => [],
    usePathname: () => "/",
}));

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
    MaterialIcons: "MaterialIcons",
    FontAwesome: "FontAwesome",
    AntDesign: "AntDesign",
}));

jest.mock("expo-modules-core", () => ({
    EventEmitter: class EventEmitter {
        addListener() {}
        removeListener() {}
        emit() {}
    },
}));

