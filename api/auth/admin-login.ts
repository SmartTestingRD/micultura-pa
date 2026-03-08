import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { query } from '../_lib/data/db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { }
        }
        const { email, password } = body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const checkUser = await query('SELECT id, email, full_name, role, password_hash, is_active FROM min_cultura.internal_users WHERE email = $1', [email]);

        if (checkUser.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = checkUser.rows[0];

        if (!user.is_active) {
            return res.status(403).json({ error: 'User is deactivated' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Admin Login successful',
            token,
            user: tokenPayload
        });
    } catch (error: any) {
        console.error('Admin Login Error:', error);
        return res.status(500).json({ error: 'Internal server error during admin login' });
    }
}
