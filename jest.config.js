module.exports = {
    preset: "@testing-library/react-native",
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|@expo/vector-icons)",
    ],
    setupFiles: ["<rootDir>/jest.setup.js"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.stories.{ts,tsx}",
        "!src/**/__tests__/**",
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@core/(.*)$": "<rootDir>/src/core/$1",
        "^@modules/(.*)$": "<rootDir>/src/modules/$1",
        "^@shared/(.*)$": "<rootDir>/src/shared/$1",
        "^@navigation/(.*)$": "<rootDir>/src/navigation/$1",
        "^@types/(.*)$": "<rootDir>/src/types/$1",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    testMatch: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    testEnvironment: "node",
};

