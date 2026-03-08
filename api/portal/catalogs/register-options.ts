import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from '../../_lib/data/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Fetch Sectors
        const sectorsResult = await db.query(`SELECT id, name FROM min_cultura.cultural_sectors ORDER BY name ASC`);

        // Fetch Roles
        const rolesResult = await db.query(`SELECT id, name FROM min_cultura.cultural_roles ORDER BY name ASC`);

        // Fetch Services
        const servicesResult = await db.query(`SELECT id, name FROM min_cultura.cultural_services ORDER BY name ASC`);

        // Fetch new Extra Catalogs
        const typesResult = await db.query(`SELECT value, name FROM min_cultura.register_types ORDER BY id ASC`);
        const subClassResult = await db.query(`SELECT value, name FROM min_cultura.sub_classifications ORDER BY id ASC`);
        const categoriesResult = await db.query(`SELECT value, name FROM min_cultura.work_categories ORDER BY id ASC`);

        return res.status(200).json({
            sectors: sectorsResult.rows,
            roles: rolesResult.rows,
            services: servicesResult.rows,
            registerTypes: typesResult.rows,
            subClassifications: subClassResult.rows,
            workCategories: categoriesResult.rows
        });
    } catch (error: any) {
        console.error('Error fetching register catalogs:', error);
        return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
}
