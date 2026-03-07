import dotenv from 'dotenv';
import { query } from './src/data/db.js';

dotenv.config();

async function addColumns() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
        console.log("Adding columns to citizens table...");
        const alterQuery = `
            ALTER TABLE min_cultura.citizens
            ADD COLUMN IF NOT EXISTS authorizes_data_treatment BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS accepts_terms_conditions BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS accepts_privacy_policy BOOLEAN NOT NULL DEFAULT false;
        `;
        await query(alterQuery);
        console.log("Columns added successfully.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

addColumns();
