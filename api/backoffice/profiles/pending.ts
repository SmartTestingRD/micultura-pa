import type { VercelResponse } from '@vercel/node';
import { query } from '../../_lib/data/db.js';
import { requireAdminRole, type AuthenticatedRequest } from '../../_lib/middleware/auth.js';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const queryText = `
            SELECT 
                c.id as entity_id,
                c.profile_type as entity_type,
                c.full_name as profile_name,
                '' as description,
                '' as province,
                c.status,
                c.created_at,
                c.id as citizen_id,
                c.full_name as citizen_name,
                c.email as contact_email,
                c.phone_number as contact_phone,
                c.metadata
            FROM min_cultura.citizens c
            ORDER BY c.created_at DESC
        `;

        const result = await query(queryText);

        return res.status(200).json({ profiles: result.rows });
    } catch (error: any) {
        console.error('Error fetching pending profiles:', error);
        return res.status(500).json({ error: 'Internal server error fetching profiles' });
    }
};

export default requireAdminRole(handler);
