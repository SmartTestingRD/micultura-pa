import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../_lib/data/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Validate JWT
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        }

        const token = authHeader.split(' ')[1];
        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        const citizenId = decodedToken.id;

        // 2. Parse request body
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { }
        }

        const { entity_type, name, province, sector_id } = body || {};

        if (!entity_type || !name) {
            return res.status(400).json({ error: 'entity_type and name are required' });
        }

        // 3. Insert into database enforcing DRAFT status
        const insertQuery = `
            INSERT INTO min_cultura.cultural_entities (
                entity_type, name, province, sector_id, status, created_by
            ) 
            VALUES ($1, $2, $3, $4, 'DRAFT', $5) 
            RETURNING id, entity_type, name, status, created_at
        `;

        const result = await query(insertQuery, [
            entity_type,
            name,
            province || null,
            sector_id || null,
            citizenId
        ]);

        return res.status(201).json({
            message: 'Cultural profile created successfully and is pending review.',
            entity: result.rows[0]
        });

    } catch (error: any) {
        console.error('Cultural Entity Creation Error:', error);
        return res.status(500).json({ error: 'Internal server error during profile creation' });
    }
}
