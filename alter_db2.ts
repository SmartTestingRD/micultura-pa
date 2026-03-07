import dotenv from 'dotenv';
import { query } from './src/data/db.js';

dotenv.config();

async function alterColumns() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
        console.log("Altering password_hash to drop NOT NULL...");
        const alterQuery = `
            ALTER TABLE min_cultura.citizens
            ALTER COLUMN password_hash DROP NOT NULL;
        `;
        await query(alterQuery);
        console.log("Altered successfully.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

alterColumns();
