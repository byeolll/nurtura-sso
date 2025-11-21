import { useState, useEffect, useCallback } from 'react';
import { UseFetchOptions, UseFetchResult } from '../types/interface';

function useFetch<T = any>(url: string, options: UseFetchOptions = {}): UseFetchResult<T> {
    const { method = 'GET', body = null, headers = {},autoFetch = true } = options;

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const bodyString = JSON.stringify(body);
    const headersString = JSON.stringify(headers);


    const fetchData = useCallback(
        async (overrideOptions?: UseFetchOptions) => {
            const fetchMethod = overrideOptions?.method || method;
            const fetchBody = overrideOptions?.body || body;
            const fetchHeaders = { ...headers, ...overrideOptions?.headers };

            
            setLoading(true);
            setError(null);

            try {
                const config: RequestInit = {
                    method: fetchMethod,
                    headers: {
                        'Content-Type': 'application/json',
                        ...fetchHeaders,
                    },
                };

                if (fetchMethod === 'POST' && fetchBody) {
                    config.body = JSON.stringify(fetchBody);
                }

                const response = await fetch(url, config);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } 
            
            catch (err) {
                setError(err as Error);
                setData(null);
            } 
            
            finally {
                setLoading(false);
            }
        }, [url, method, bodyString, headersString]
    );

    useEffect(() => {
       if (autoFetch) {
        fetchData();
       }
    }, [fetchData, autoFetch]);

    return { data, error, loading, refetch: fetchData };
}

export default useFetch;