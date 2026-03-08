import type { VercelResponse } from '@vercel/node';
import { query } from '../../_lib/data/db.js';
import { requireAdminRole, type AuthenticatedRequest } from '../../_lib/middleware/auth.js';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { entityId, newStatus } = req.body;

        if (!entityId || !newStatus) {
            return res.status(400).json({ error: 'Missing required fields: entityId, newStatus' });
        }

        if (!['PUBLISHED', 'REJECTED'].includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid newStatus. Must be PUBLISHED or REJECTED.' });
        }

        // Update the status
        const updateQuery = `
            UPDATE min_cultura.cultural_entities
            SET status = $1, updated_at = NOW()
            WHERE id = $2 AND status = 'DRAFT'
            RETURNING id, name, status, entity_type
        `;

        const result = await query(updateQuery, [newStatus, entityId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found or already reviewed.' });
        }

        return res.status(200).json({
            message: `Profile successfully marked as ${newStatus}`,
            entity: result.rows[0]
        });

    } catch (error: any) {
        console.error('Error reviewing profile:', error);
        return res.status(500).json({ error: 'Internal server error while reviewing profile' });
    }
};

export default requireAdminRole(handler);
