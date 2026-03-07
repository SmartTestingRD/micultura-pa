import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateAndSendOTP } from '../_lib/services/otpService.js';
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
        const { email } = body || {};

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Validate if user already exists and is verified
        const existingUser = await query('SELECT is_verified FROM min_cultura.citizens WHERE email = $1', [email]);
        if (existingUser.rows.length > 0 && existingUser.rows[0].is_verified) {
            return res.status(409).json({ error: 'Este correo ya se encuentra registrado en el sistema.' });
        }

        const otpId = await generateAndSendOTP(email);

        return res.status(200).json({
            message: 'OTP generated and sent successfully',
            otpId
        });
    } catch (error) {
        console.error('OTP Generation Error:', error);
        return res.status(500).json({ error: 'Internal server error during OTP generation' });
    }
}
