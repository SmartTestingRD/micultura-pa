import type { VercelResponse } from '@vercel/node';
import { query } from '../../_lib/data/db.js';
import { requireAdminRole, type AuthenticatedRequest } from '../../_lib/middleware/auth.js';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const pendingQuery = `
            SELECT 
                ce.id as entity_id,
                ce.entity_type,
                ce.name as profile_name,
                ce.description,
                ce.province,
                ce.status,
                ce.created_at,
                c.id as citizen_id,
                c.full_name as citizen_name,
                c.email as contact_email,
                c.phone_number as contact_phone,
                ce.metadata
            FROM min_cultura.cultural_entities ce
            JOIN min_cultura.citizens c ON ce.citizen_id = c.id
            WHERE ce.status = 'DRAFT'
            ORDER BY ce.created_at ASC
        `;

        const result = await query(pendingQuery);

        return res.status(200).json({ profiles: result.rows });
    } catch (error: any) {
        console.error('Error fetching pending profiles:', error);
        return res.status(500).json({ error: 'Internal server error fetching profiles' });
    }
};

export default requireAdminRole(handler);
