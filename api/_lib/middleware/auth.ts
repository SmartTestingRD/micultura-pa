import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends VercelRequest {
    user?: {
        id: string;
        email: string;
        role: string;
        full_name: string;
    };
}

export const requireAuth = (handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<void | VercelResponse>) => {
    return async (req: AuthenticatedRequest, res: VercelResponse) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
            req.user = decoded;
            return handler(req, res);
        } catch (error) {
            console.error('JWT Verification Error:', error);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
    };
};

export const requireAdminRole = (handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<void | VercelResponse>) => {
    return requireAuth(async (req: AuthenticatedRequest, res: VercelResponse) => {
        // req.user is guaranteed to exist here because of requireAuth
        const user = req.user!;

        // Allowed admin roles: 'ADMIN', 'EVALUADOR', 'EDITOR', 'ANALISTA' 
        // Or simply checking it's NOT 'citizen'
        if (user.role === 'citizen') {
            return res.status(403).json({ error: 'Insufficient permissions for this action' });
        }

        return handler(req, res);
    });
};
