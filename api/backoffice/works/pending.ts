import type { VercelResponse } from '@vercel/node';
import { query } from '../../_lib/data/db.js';
import { requireAdminRole, type AuthenticatedRequest } from '../../_lib/middleware/auth.js';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Obtenemos solo las obras que están "En revisión técnica"
        const dbQuery = `
            SELECT 
                ce.id,
                ce.entity_type,
                ce.name as title,
                ce.description,
                ce.status,
                ce.metadata,
                ce.created_at,
                c.full_name as citizen_name,
                c.email as citizen_email,
                (
                    SELECT json_agg(em.media_url)
                    FROM min_cultura.entity_media em
                    WHERE em.entity_id = ce.id AND em.media_type = 'GALLERY_IMAGE'
                ) as image_urls
            FROM min_cultura.cultural_entities ce
            LEFT JOIN min_cultura.citizens c ON ce.citizen_id = c.id
            WHERE ce.status = 'UNDER_REVIEW'
            ORDER BY ce.created_at ASC
        `;

        const result = await query(dbQuery);

        return res.status(200).json({
            works: result.rows
        });

    } catch (error: any) {
        console.error('Error fetching pending works:', error);
        return res.status(500).json({ error: 'Internal server error while fetching works' });
    }
};

export default requireAdminRole(handler);
