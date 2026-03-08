import type { VercelResponse } from '@vercel/node';
import { requireAuth } from '../../_lib/middleware/auth';
import type { AuthenticatedRequest } from '../../_lib/middleware/auth';
import db from '../../_lib/data/db';

export default requireAuth(async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        // Only CITIZEN role users can create profiles/works via the portal
        if (user.role !== 'CITIZEN' && user.role !== 'SUPER_ADMIN' && user.role !== 'EDITOR') {
            return res.status(403).json({ error: 'Prohibido. ROL no autorizado para crear registros en portal.' });
        }

        const {
            title,
            description,
            category,
            subcategory,
            seriesCount,
            status,
            sectors,
            yearStarted,
            locationType,
            address,
            phone,
            email,
            website,
            socials,
            videoUrl,
            artisticRoles,
            services,
            coverage,
            members,
            imageUrl
        } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Título o nombre es requerido' });
        }

        // Mapeo entity_type base
        let entityType = 'CULTURAL_AGENT';
        if (category === 'Artesanía' || category === 'Pintura' || category === 'Escultura' || category === 'Textil' || category === 'Mobiliario' || category === 'Otro') {
            entityType = 'MANIFESTATION'; // Obra literal
        } else if (category === 'Espacios / Eventos') {
            entityType = 'SPACE';
        }

        // Construir JSON Metadata con campos dinámicos y extras puros
        const metadata = {
            category: category || null,
            subcategory: subcategory || null,
            seriesCount: seriesCount || 1,
            sectors: sectors || [],
            yearStarted: yearStarted || null,
            locationType: locationType || 'física',
            website: website || null,
            socials: socials || {},
            videoUrl: videoUrl || null,
            artisticRoles: artisticRoles || [],
            services: services || [],
            coverage: coverage || null,
            members: members || []
        };

        // Determinar citizen_id
        let citizenId = null;
        if (user.role === 'CITIZEN') {
            citizenId = user.id;
        }

        // Insert into Base
        const query = `
                INSERT INTO min_cultura.cultural_entities (
                    entity_type, name, description, address, contact_email, contact_phone, status, citizen_id, metadata
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                ) RETURNING id
            `;

        const values = [
            entityType,
            title,
            description || null,
            address || null,
            email || null,
            phone || null,
            status || 'DRAFT', // or 'PENDING'
            citizenId,
            JSON.stringify(metadata)
        ];

        const result = await db.query(query, values);
        const newEntityId = result.rows[0].id;

        // Simple media record creation via loop if imageUrl passed
        // Later we can implement multiple images array
        if (imageUrl) {
            const mediaQuery = `
                     INSERT INTO min_cultura.entity_media (
                         entity_id, media_url, media_type, is_featured
                     ) VALUES (
                         $1, $2, 'GALLERY_IMAGE', true
                     )
                 `;
            await db.query(mediaQuery, [newEntityId, imageUrl]);
        }
        // Log creation in Audit Table
        const auditQuery = `
                INSERT INTO min_cultura.cultural_entities_audit_log (
                    entity_id, action_type, new_status, performer_role, performed_by_email, changes_summary
                ) VALUES (
                    $1, 'PROFILE_CREATED', $2, $3, $4, $5
                )
            `;
        const auditValues = [
            newEntityId,
            status || 'DRAFT',
            user.role,
            user.email,
            JSON.stringify({ note: 'Initial registration from Citizen Portal' })
        ];
        await db.query(auditQuery, auditValues);

        return res.status(201).json({
            message: 'Registro de obra o ficha exitoso.',
            entity_id: newEntityId
        });
    } catch (error: any) {
        console.error('Error al registrar obra:', error);
        return res.status(500).json({ error: 'Error del servidor.', details: error.message });
    }
});
