import type { VercelResponse } from '@vercel/node';
import { requireAuth } from '../../_lib/middleware/auth';
import type { AuthenticatedRequest } from '../../_lib/middleware/auth';
import db from '../../_lib/data/db';

export default requireAuth(async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const query = `
            SELECT 
                id,
                COALESCE(metadata->>'category', entity_type) as category,
                name as title,
                status,
                responsible_area,
                TO_CHAR(created_at, 'DD Mon YYYY') as date
            FROM min_cultura.cultural_entities
            WHERE citizen_id = $1
            ORDER BY created_at DESC
        `;

        const result = await db.query(query, [user.id]);

        return res.status(200).json(result.rows);
    } catch (error: any) {
        console.error('Error fetching citizen works:', error);
        return res.status(500).json({ error: 'Error del servidor.', details: error.message });
    }
});
