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

        if (!['CONFIRMED', 'REJECTED', 'PAUSED'].includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid newStatus. Must be CONFIRMED, REJECTED, or PAUSED.' });
        }

        if (['REJECTED', 'PAUSED'].includes(newStatus) && (!reason || reason.trim() === '')) {
            return res.status(400).json({ error: 'A reason is required for REJECTED or PAUSED status.' });
        }

        // First get current status to log the transition
        const getStatusQuery = `SELECT status FROM min_cultura.citizens WHERE id = $1`;
        const currentStatusResult = await query(getStatusQuery, [entityId]);
        const previousStatus = currentStatusResult.rows.length > 0 ? currentStatusResult.rows[0].status : null;

        if (!previousStatus) {
            return res.status(404).json({ error: 'Citizen not found.' });
        }

        // Update the status and append reason to metadata
        const updateQuery = `
            UPDATE min_cultura.citizens
            SET 
                status = $1, 
                metadata = CASE 
                    WHEN $3::text IS NOT NULL AND $3::text != '' THEN 
                        COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('status_reason', $3::text)
                    ELSE 
                        metadata
                END,
                updated_at = NOW()
            WHERE id = $2 
            RETURNING id, full_name, status, profile_type
        `;

        const result = await query(updateQuery, [newStatus, entityId, reason || null]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Citizen not found or unable to update.' });
        }

        // Insert Audit Log Record
        const auditLogQuery = `
            INSERT INTO min_cultura.citizens_audit_log (
                citizen_id, action_type, previous_status, new_status, 
                performed_by_email, performer_role, reason
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        // We use req.user.email for the performer and req.user.role (or fallback to ADMIN)
        await query(auditLogQuery, [
            entityId,
            'STATUS_CHANGE',
            previousStatus,
            newStatus,
            req.user?.email || 'system@micultura.gob.pa', // Fallback if no user email in req
            req.user?.role || 'ADMIN',
            reason || null
        ]);

        return res.status(200).json({
            message: `Citizen successfully marked as ${newStatus}`,
            entity: result.rows[0]
        });

    } catch (error: any) {
        console.error('Error reviewing profile:', error);
        return res.status(500).json({ error: 'Internal server error while reviewing profile' });
    }
};

export default requireAdminRole(handler);
