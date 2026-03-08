import multer from 'multer';
import { put } from '@vercel/blob';
import jwt from 'jsonwebtoken';

const upload = multer({ storage: multer.memoryStorage() });

// Middleware wrapper for Vercel/Express compat
function runMiddleware(req: any, res: any, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// Disable vercel default body parser for this route
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        await runMiddleware(req, res, upload.array('files', 10));

        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No autorizado' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        const citizenId = decoded.id;

        const entityId = req.body.entity_id || 'temp';

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se enviaron archivos' });
        }

        const urls: string[] = [];

        for (const file of req.files) {
            const hash = Math.random().toString(36).substring(2, 10);
            const isFeatured = urls.length === 0 && !file.originalname.includes('alt_');
            const prefix = isFeatured ? 'feat' : 'alt';

            // citizens/{citizen_id}/entities/{entity_id}/gallery/{prefix}_{hash}.png
            const extension = file.originalname.split('.').pop();
            const filename = `citizens/${citizenId}/entities/${entityId}/gallery/${prefix}_${hash}.${extension}`;

            const blob = await put(filename, file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });

            urls.push(blob.url);
        }

        return res.status(200).json({ urls });
    } catch (error: any) {
        console.error('Upload Error:', error);
        return res.status(500).json({ error: 'Error procesando la subida', details: error.message });
    }
}
