import { useState, useEffect } from "react";
import { api } from "@core/api";

interface UseFetchOptions {
    skip?: boolean;
}

export function useFetch<T>(
    url: string,
    options?: UseFetchOptions
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (options?.skip) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get<T>(url);
                setData(response.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, options?.skip]);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<T>(url);
            setData(response.data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch };
}

