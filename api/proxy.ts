import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { targetUrl, method = 'GET', headers = {}, body } = req.body || {};

        if (!targetUrl) {
            return res.status(400).json({ error: 'targetUrl is required' });
        }

        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.json().catch(() => null);

        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Error processing proxy request' });
    }
}
