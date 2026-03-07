import { Client } from 'pg';
import fs from 'fs';

const sourceDbUrl = 'postgresql://neondb_owner:npg_HSK5kPoQYj9w@ep-billowing-shadow-ai7yereu-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

const tables = [
    'internal_users',
    'citizens',
    'cultural_sectors',
    'cultural_entities',
    'entity_media',
    'news_articles',
    'documents',
    'otp_codes'
];

async function exportData() {
    const client = new Client({ connectionString: sourceDbUrl });
    try {
        await client.connect();
        let sqlOutput = '-- Auto-generated data insert script\n\n';

        for (const table of tables) {
            console.log(`Exporting table: min_cultura.${table}`);
            const res = await client.query(`SELECT * FROM min_cultura.${table}`);

            if (res.rows.length === 0) {
                sqlOutput += `-- No data for min_cultura.${table}\n\n`;
                continue;
            }

            sqlOutput += `-- Data for min_cultura.${table}\n`;
            for (const row of res.rows) {
                const columns = Object.keys(row).map(c => `"${c}"`).join(', ');
                const values = Object.values(row).map(val => {
                    if (val === null) return 'NULL';
                    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                    if (val instanceof Date) return `'${val.toISOString()}'`;
                    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
                    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                    return val;
                }).join(', ');

                sqlOutput += `INSERT INTO min_cultura.${table} (${columns}) VALUES (${values});\n`;
            }
            sqlOutput += '\n';
        }

        fs.writeFileSync('database/insert_data.sql', sqlOutput);
        console.log('Data exported successfully to database/insert_data.sql');
    } catch (err) {
        console.error('Error exporting data:', err);
    } finally {
        await client.end();
    }
}

exportData();
