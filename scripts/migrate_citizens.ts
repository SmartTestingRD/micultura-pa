import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Running migration on min_cultura.citizens...');
        await pool.query(`
            ALTER TABLE min_cultura.citizens
            ADD COLUMN IF NOT EXISTS profile_type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PENDING',
            ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
        `);
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await pool.end();
    }
}

run();
