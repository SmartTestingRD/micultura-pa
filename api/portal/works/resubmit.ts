import type { VercelResponse } from '@vercel/node';
import { requireAuth, type AuthenticatedRequest } from '../../_lib/middleware/auth.js';
import db from '../../_lib/data/db.js';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { entityId } = req.body;

        if (!entityId) {
            return res.status(400).json({ error: 'Missing required field: entityId' });
        }

        // Obtener estado actual
        const getStatusQuery = `SELECT status FROM min_cultura.cultural_entities WHERE id = $1 AND citizen_id = $2`;
        const currentStatusResult = await db.query(getStatusQuery, [entityId, req.user?.id]);
        
        if (currentStatusResult.rows.length === 0) {
            return res.status(404).json({ error: 'Work not found or not owned by user.' });
        }

        const previousStatus = currentStatusResult.rows[0].status;

        if (previousStatus !== 'OBSERVED') {
            return res.status(400).json({ error: 'Only OBSERVED works can be resubmitted.' });
        }

        // Actualizar el estado a UNDER_REVIEW
        const updateQuery = `
            UPDATE min_cultura.cultural_entities
            SET status = 'UNDER_REVIEW', updated_at = NOW()
            WHERE id = $1 AND citizen_id = $2
            RETURNING id, name, status, entity_type
        `;

        const result = await db.query(updateQuery, [entityId, req.user?.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Work not found or unable to update.' });
        }

        // Auditoría
        const auditQuery = `
            INSERT INTO min_cultura.cultural_entities_audit_log (
                entity_id, action_type, new_status, performer_role, performed_by_email, changes_summary
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            )
        `;
        const auditValues = [
            entityId,
            'RESUBMITTED_BY_CITIZEN',
            'UNDER_REVIEW',
            req.user?.role || 'CITIZEN',
            req.user?.email || 'unknown',
            JSON.stringify({ note: 'Marked as corrected by citizen' })
        ];
        await db.query(auditQuery, auditValues);

        return res.status(200).json({
            message: `Work successfully resubmitted for review`,
            entity: result.rows[0]
        });

    } catch (error: any) {
        console.error('Error resubmitting work:', error);
        return res.status(500).json({ error: 'Internal server error while resubmitting work' });
    }
};

export default requireAuth(handler);
