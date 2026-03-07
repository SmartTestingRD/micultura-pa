import { query } from '../src/data/db';

async function verify() {
    try {
        const res = await query('SELECT email, id, is_verified, full_name FROM min_cultura.citizens;');
        console.log("Citizens:", res.rows);
    } catch (e) {
        console.error("DB Query Error:", e);
    }
}
verify();
