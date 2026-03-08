import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Running migration to change performed_by to email...');
        await pool.query(`
            ALTER TABLE min_cultura.citizens_audit_log 
            DROP COLUMN IF EXISTS performed_by CASCADE;

            ALTER TABLE min_cultura.citizens_audit_log 
            ADD COLUMN IF NOT EXISTS performed_by_email VARCHAR(255) NOT NULL DEFAULT 'system@micultura.gob.pa';
        `);
        console.log('Migration successful: performed_by changed to email.');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await pool.end();
    }
}

run();
