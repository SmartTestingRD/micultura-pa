import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 1. Extract and Verify Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    let citizenId: string;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { citizen_id?: string, control_id?: string, id?: string };
        // We handle logic where sometimes it might be 'control_id' or simply 'id' depending on login flows
        citizenId = decoded.citizen_id || decoded.control_id || decoded.id || '';

        if (!citizenId) {
            return res.status(401).json({ message: 'Token payload missing citizen identifier' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token', error: err instanceof Error ? err.message : String(err) });
    }

    // 2. Fetch the citizen status
    try {
        const query = `
            SELECT id, profile_type, status 
            FROM min_cultura.citizens 
            WHERE id = $1 
            LIMIT 1;
        `;
        const { rows } = await pool.query(query, [citizenId]);

        if (rows.length === 0) {
            // Citizen not found
            return res.status(200).json({ status: 'UNREGISTERED' });
        }

        // Return the profile status
        return res.status(200).json({ status: rows[0].status });
    } catch (error) {
        console.error('Error fetching profile status:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
