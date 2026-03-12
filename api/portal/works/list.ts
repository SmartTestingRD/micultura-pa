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
                ce.id,
                COALESCE(ce.metadata->>'category', ce.entity_type) as category,
                ce.name as title,
                ce.description,
                ce.metadata,
                (
                    SELECT json_agg(em.media_url)
                    FROM min_cultura.entity_media em
                    WHERE em.entity_id = ce.id AND em.media_type = 'GALLERY_IMAGE'
                ) as image_urls,
                ce.status,
                ce.responsible_area,
                TO_CHAR(ce.created_at, 'DD Mon YYYY') as date
            FROM min_cultura.cultural_entities ce
            WHERE ce.citizen_id = $1
            ORDER BY ce.created_at DESC
        `;

        const result = await db.query(query, [user.id]);

        return res.status(200).json(result.rows);
    } catch (error: any) {
        console.error('Error fetching citizen works:', error);
        return res.status(500).json({ error: 'Error del servidor.', details: error.message });
    }
});
