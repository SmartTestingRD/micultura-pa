import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateOTP } from '../_lib/services/otpService.js';
import jwt from 'jsonwebtoken';
import { query } from '../_lib/data/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { }
        }
        const { otpId, email, otpCode } = body || {};

        if (!otpId || !email || !otpCode) {
            return res.status(400).json({ error: 'otpId, email, and otpCode are required' });
        }

        const isValid = await validateOTP(otpId, email, otpCode);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Fetch citizen record
        const checkUser = await query('SELECT id, full_name, is_verified FROM min_cultura.citizens WHERE email = $1', [email]);

        if (checkUser.rows.length === 0 || !checkUser.rows[0].is_verified) {
            return res.status(404).json({ error: 'Usuario no registrado o no verificado.' });
        }

        const citizen = checkUser.rows[0];

        const tokenPayload = {
            id: citizen.id,
            email,
            role: 'citizen',
            full_name: citizen.full_name
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: tokenPayload
        });
    } catch (error: any) {
        console.error('Login Validation Error:', error);
        return res.status(500).json({ error: 'Internal server error during login' });
    }
}
