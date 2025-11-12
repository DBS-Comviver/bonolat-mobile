import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageService = {
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const item = await AsyncStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : null;
        } catch (error) {
            return null;
        }
    },

    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            throw error;
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            throw error;
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            throw error;
        }
    },
};

