import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.146:3333";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

if (__DEV__) {
    console.log("API Base URL:", API_URL);
}
