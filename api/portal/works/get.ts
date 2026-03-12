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

        const citizenId = user.id; // From the auth middleware
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID de obra no proporcionado' });
        }

        const query = `
            SELECT 
                id,
                entity_type,
                name as title,
                status,
                metadata,
                created_at,
                updated_at
            FROM min_cultura.cultural_entities
            WHERE id = $1 AND citizen_id = $2
        `;

        const result = await db.query(query, [id, citizenId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Obra no encontrada o no pertenece al usuario' });
        }

        const work = result.rows[0];
        
        // Parse category from metadata to mimic the API response needed by the frontend
        const category = work.metadata?.category || work.entity_type;

        return res.status(200).json({
            id: work.id,
            entity_type: work.entity_type,
            title: work.title,
            status: work.status,
            category: category,
            metadata: work.metadata || {}
        });

    } catch (error: any) {
        console.error('Error fetching work:', error);
        return res.status(500).json({ error: 'Error del servidor al obtener la obra' });
    }
});
