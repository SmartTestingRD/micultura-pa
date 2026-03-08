import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../_lib/data/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const catalogsQuery = `
            SELECT 
                c.name as catalog_name,
                ci.value,
                ci.label
            FROM min_cultura.catalog_items ci
            JOIN min_cultura.catalogs c ON ci.catalog_id = c.id
            WHERE ci.is_active = true
            ORDER BY c.name, ci.sort_order ASC;
        `;

        const result = await query(catalogsQuery);

        // Group items by catalog name
        const groupedCatalogs: Record<string, { value: string, label: string }[]> = {};

        result.rows.forEach(row => {
            if (!groupedCatalogs[row.catalog_name]) {
                groupedCatalogs[row.catalog_name] = [];
            }
            groupedCatalogs[row.catalog_name].push({
                value: row.value,
                label: row.label
            });
        });

        return res.status(200).json(groupedCatalogs);
    } catch (error: any) {
        console.error('Error fetching catalogs:', error);
        return res.status(500).json({ error: 'Internal server error while fetching catalogs' });
    }
}
