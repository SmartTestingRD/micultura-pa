import type { VercelResponse } from '@vercel/node';
import { requireAuth } from '../../_lib/middleware/auth';
import type { AuthenticatedRequest } from '../../_lib/middleware/auth';
import db from '../../_lib/data/db';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

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
        const role = user.role?.toUpperCase();
        if (role !== 'CITIZEN' && role !== 'SUPER_ADMIN' && role !== 'EDITOR') {
            return res.status(403).json({ error: 'Prohibido. ROL no autorizado para crear registros en portal.' });
        }

        const {
            id,
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
            imageUrls,
            metadata: reqMetadata // Parse extended metadata from frontend
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
            ...(reqMetadata || {}), // Inherit all dynamic fields like techniques, dimensions, etc.
            category: category || reqMetadata?.category || null,
            subcategory: subcategory || reqMetadata?.subcategory || reqMetadata?.subType || null,
            seriesCount: seriesCount || reqMetadata?.seriesCount || 1,
            sectors: sectors || reqMetadata?.sectors || [],
            yearStarted: yearStarted || reqMetadata?.yearStarted || null,
            locationType: locationType || reqMetadata?.locationType || 'física',
            website: website || reqMetadata?.website || null,
            socials: socials || reqMetadata?.socials || {},
            videoUrl: videoUrl || reqMetadata?.videoUrl || null,
            artisticRoles: artisticRoles || reqMetadata?.artisticRoles || reqMetadata?.roles || [],
            services: services || reqMetadata?.services || [],
            coverage: coverage || reqMetadata?.coverage || null,
            members: members || reqMetadata?.members || []
        };

        // Determinar citizen_id asegurando Case-Insensitive
        let finalCitizenId = null;
        if (role === 'CITIZEN') {
            finalCitizenId = user.id;
        } else if (req.body.citizenId) {
            // Editor / Admin editando a un usuario tercero, asumiendo que el ID del creador real viene en el body.
            finalCitizenId = req.body.citizenId;
        }

        // Insert into Base or Update
        let newEntityId = id;
        let isUpdate = !!id;

        if (isUpdate) {
            const updateQuery = `
                UPDATE min_cultura.cultural_entities
                SET entity_type = $1, name = $2, description = $3, address = $4, contact_email = $5, contact_phone = $6, status = $7, metadata = $8
                WHERE id = $9 AND citizen_id = $10
                RETURNING id;
            `;
            const updateValues = [
                entityType,
                title,
                description || null,
                address || null,
                email || null,
                phone || null,
                status || 'IN_CREATION',
                JSON.stringify(metadata),
                id,
                finalCitizenId
            ];
            const result = await db.query(updateQuery, updateValues);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Obra no encontrada o no autorizada' });
            }
        } else {
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
                status || 'IN_CREATION', // or 'PENDING'
                finalCitizenId,
                JSON.stringify(metadata)
            ];

            const result = await db.query(query, values);
            newEntityId = result.rows[0].id;
        }

        // Crear múltiples registros de medios si se pasan imágenes
        if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
            await db.query(`DELETE FROM min_cultura.entity_media WHERE entity_id = $1`, [newEntityId]);
            const mediaQuery = `
                     INSERT INTO min_cultura.entity_media (
                         entity_id, media_url, media_type, is_featured
                     ) VALUES (
                         $1, $2, 'GALLERY_IMAGE', $3
                     )
                 `;
            // Insertar todas consecutivamente. La primera será 'featured' (principal)
            const insertPromises = imageUrls.map((url, index) => {
                const isFeatured = index === 0;
                return db.query(mediaQuery, [newEntityId, url, isFeatured]);
            });
            await Promise.all(insertPromises);
        }
        // Log creation in Audit Table
        const auditQuery = `
                INSERT INTO min_cultura.cultural_entities_audit_log (
                    entity_id, action_type, new_status, performer_role, performed_by_email, changes_summary
                ) VALUES (
                    $1, $2, $3, $4, $5, $6
                )
            `;
        const auditValues = [
            newEntityId,
            isUpdate ? 'DATA_UPDATE' : 'PROFILE_CREATED',
            status || 'DRAFT',
            user.role,
            user.email,
            JSON.stringify({ note: isUpdate ? 'Autosave / Update from Citizen Portal' : 'Initial registration from Citizen Portal' })
        ];
        await db.query(auditQuery, auditValues);

        // Notificación por correo al Ciudadano si es UNDER_REVIEW
        if (status === 'UNDER_REVIEW' && user.email) {
            try {
                const sesClient = new SESClient({
                    region: process.env.AWS_REGION || 'us-east-1',
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
                    }
                });

                const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:5174';
                const proto = req.headers['x-forwarded-proto'] || 'http';
                const publicUrl = `${proto}://${host}/portal/verify/${newEntityId}`;

                const command = new SendEmailCommand({
                    Destination: { ToAddresses: [user.email] },
                    Message: {
                        Body: {
                            Html: {
                                Charset: "UTF-8",
                                Data: `
                                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                        <h2 style="color: #0f172a;">¡Hola, ${user.full_name || 'Ciudadano'}!</h2>
                                        <p>Tu obra o ficha <strong>"${title}"</strong> ha sido recibida exitosamente en el Portal del Creador de Cultura.</p>
                                        <p>Actualmente se encuentra en estado <strong>En Revisión</strong>. Nuestro equipo evaluará los datos e imágenes proporcionadas para validar su autenticidad.</p>
                                        
                                        <div style="background-color: #f8fafc; padding: 25px 15px; border-radius: 6px; margin: 25px 0; text-align: center;">
                                            <p style="margin-bottom: 15px; font-weight: bold; color: #475569;">Puedes consultar públicamente el estado de tu obra aquí:</p>
                                            <a href="${publicUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-bottom: 25px;">Ver Mi Obra</a>
                                            
                                            <p style="margin-bottom: 10px; font-size: 13px; color: #64748b;">También puedes escanear o descargar este código QR de rastreo:</p>
                                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicUrl)}" alt="Código QR de la Obra" width="150" height="150" style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px; background-color: white;" />
                                        </div>
                                        <p>Atentamente,<br/><strong>Ministerio de Cultura de Panamá</strong></p>
                                    </div>
                                `
                            }
                        },
                        Subject: {
                            Charset: "UTF-8",
                            Data: `Confirmación de Registro en Revisión - ${title}`
                        }
                    },
                    Source: process.env.AWS_SES_SENDER || 'no-reply@micultura.gob.pa'
                });

                await sesClient.send(command);
                console.log(`Email de confirmación enviado exitosamente a ${user.email}`);
            } catch (emailErr) {
                console.error("Error al enviar email por SES:", emailErr);
                // No rompemos la transacción principal, es un fallo silencioso de notificación
            }
        }

        return res.status(201).json({
            message: 'Registro de obra o ficha exitoso.',
            entity_id: newEntityId
        });
    } catch (error: any) {
        console.error('Error al registrar obra:', error);
        return res.status(500).json({ error: 'Error del servidor.', details: error.message });
    }
});
