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
        const {
            otpId, email, otpCode,
            full_name, phone_number,
            authorizes_data_treatment, accepts_terms_conditions, accepts_privacy_policy
        } = body || {};

        if (!otpId || !email || !otpCode || !full_name) {
            return res.status(400).json({ error: 'otpId, email, otpCode, and full_name are required' });
        }

        const isValid = await validateOTP(otpId, email, otpCode);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Check if user exists or insert
        const checkUser = await query('SELECT id FROM min_cultura.citizens WHERE email = $1', [email]);
        let citizenId = '';

        if (checkUser.rows.length === 0) {
            // Insert new citizen
            const insertQuery = `
                INSERT INTO min_cultura.citizens (
                    email, full_name, phone_number, is_verified, 
                    authorizes_data_treatment, accepts_terms_conditions, accepts_privacy_policy
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING id
            `;
            const result = await query(insertQuery, [
                email,
                full_name,
                phone_number || null,
                true, // is_verified
                Boolean(authorizes_data_treatment),
                Boolean(accepts_terms_conditions),
                Boolean(accepts_privacy_policy)
            ]);
            citizenId = result.rows[0].id;
        } else {
            // Update existing non-verified citizen
            citizenId = checkUser.rows[0].id;
            const updateQuery = `
                UPDATE min_cultura.citizens
                SET is_verified = true, 
                    full_name = $2,
                    phone_number = $3,
                    authorizes_data_treatment = $4,
                    accepts_terms_conditions = $5,
                    accepts_privacy_policy = $6,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
            `;
            await query(updateQuery, [
                citizenId,
                full_name,
                phone_number || null,
                Boolean(authorizes_data_treatment),
                Boolean(accepts_terms_conditions),
                Boolean(accepts_privacy_policy)
            ]);
        }

        const tokenPayload = {
            id: citizenId,
            email,
            role: 'citizen',
            full_name
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'OTP validated successfully',
            token,
            user: tokenPayload
        });
    } catch (error: any) {
        console.error('OTP Validation Error:', error);
        return res.status(500).json({ error: 'Internal server error during OTP validation' });
    }
}
