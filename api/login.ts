import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// In a real app, you would query the DB here.
// import { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body || {};

    // Mock authentication logic for baseline
    if (email === 'admin@cultura.gob.pa' && password === 'admin') {
        const user = { id: '1', email, name: 'Admin User', role: 'admin' };
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token, user });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
}
