import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Running migration on min_cultura.citizens_audit_log...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS min_cultura.citizens_audit_log (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                citizen_id UUID NOT NULL REFERENCES min_cultura.citizens(id) ON DELETE CASCADE,
                action_type VARCHAR(50) NOT NULL, -- e.g., 'STATUS_CHANGE', 'PROFILE_UPDATE'
                previous_status VARCHAR(50),
                new_status VARCHAR(50),
                performed_by UUID NOT NULL, -- The user/citizen who performed the action
                performer_role VARCHAR(50) NOT NULL, -- e.g., 'SUPER_ADMIN', 'CITIZEN'
                reason TEXT,
                changes_summary JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_citizens_audit_log_citizen_id ON min_cultura.citizens_audit_log(citizen_id);
            CREATE INDEX IF NOT EXISTS idx_citizens_audit_log_performed_by ON min_cultura.citizens_audit_log(performed_by);
        `);
        console.log('Migration successful: citizens_audit_log table created.');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await pool.end();
    }
}

run();
