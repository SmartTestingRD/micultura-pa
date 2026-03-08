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
                COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'APPROVED')::int AS approved,
                COUNT(*) FILTER (WHERE status = 'UNDER_REVIEW')::int AS review,
                COUNT(*) FILTER (WHERE status = 'IN_CREATION')::int AS in_creation,
                COUNT(*) FILTER (WHERE status = 'OBSERVED')::int AS observed
            FROM min_cultura.cultural_entities
            WHERE citizen_id = $1
        `;

        const result = await db.query(query, [user.id]);

        const stats = result.rows[0];

        return res.status(200).json({
            total: stats.total || 0,
            approved: stats.approved || 0,
            review: stats.review || 0,
            in_creation: stats.in_creation || 0,
            observed: stats.observed || 0,
            // Métricas de impacto simuladas por el momento
            totalViews: Math.floor(Math.random() * 2000),
            totalLikes: Math.floor(Math.random() * 500),
            totalComments: Math.floor(Math.random() * 200),
            totalShares: Math.floor(Math.random() * 100)
        });
    } catch (error: any) {
        console.error('Error fetching citizen work stats:', error);
        return res.status(500).json({ error: 'Error del servidor.', details: error.message });
    }
});
