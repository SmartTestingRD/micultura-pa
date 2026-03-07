import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useProxy = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const fetchExternalProxy = async (targetUrl: string, method: string = 'GET', body?: unknown) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    targetUrl,
                    method,
                    body
                })
            });

            if (!response.ok) {
                throw new Error(`Proxy error: ${response.status}`);
            }

            return await response.json();
        } catch (err: unknown) {
            setError((err as Error).message || 'An error occurred fetching via proxy');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { fetchExternalProxy, loading, error };
};
