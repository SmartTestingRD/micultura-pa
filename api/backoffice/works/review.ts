import type { VercelResponse } from '@vercel/node';
import { query } from '../../_lib/data/db.js';
import { requireAdminRole, type AuthenticatedRequest } from '../../_lib/middleware/auth.js';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { entityId, newStatus, reason } = req.body;

        if (!entityId || !newStatus) {
            return res.status(400).json({ error: 'Missing required fields: entityId, newStatus' });
        }

        if (!['APPROVED', 'REJECTED', 'OBSERVED'].includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid newStatus. Must be APPROVED, REJECTED, or OBSERVED.' });
        }

        if (['REJECTED', 'OBSERVED'].includes(newStatus) && (!reason || reason.trim() === '')) {
            return res.status(400).json({ error: 'A reason is required for REJECTED or OBSERVED status.' });
        }

        // Obtener estado actual
        const getStatusQuery = `SELECT status FROM min_cultura.cultural_entities WHERE id = $1`;
        const currentStatusResult = await query(getStatusQuery, [entityId]);
        const previousStatus = currentStatusResult.rows.length > 0 ? currentStatusResult.rows[0].status : null;

        if (!previousStatus) {
            return res.status(404).json({ error: 'Work not found.' });
        }

        // Actualizar el estado y guardar el motivo de rechazo u observación en metadata
        const updateQuery = `
            UPDATE min_cultura.cultural_entities
            SET 
                status = $1, 
                metadata = CASE 
                    WHEN $3::text IS NOT NULL AND $3::text != '' THEN 
                        COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('reviewer_notes', $3::text)
                    ELSE 
                        metadata
                END,
                updated_at = NOW()
            WHERE id = $2 
            RETURNING id, name, status, entity_type
        `;

        const result = await query(updateQuery, [newStatus, entityId, reason || null]);

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
        const actionType = newStatus === 'APPROVED' ? 'REVIEW_APPROVED' : newStatus === 'REJECTED' ? 'REVIEW_REJECTED' : 'REVIEW_OBSERVED';
        const auditValues = [
            entityId,
            actionType,
            newStatus,
            req.user?.role || 'ADMIN',
            req.user?.email || 'unknown',
            JSON.stringify({ note: reason || 'Reviewed from backoffice' })
        ];
        await query(auditQuery, auditValues);

        return res.status(200).json({
            message: `Work successfully marked as ${newStatus}`,
            entity: result.rows[0]
        });

    } catch (error: any) {
        console.error('Error reviewing work:', error);
        return res.status(500).json({ error: 'Internal server error while reviewing work' });
    }
};

export default requireAdminRole(handler);
