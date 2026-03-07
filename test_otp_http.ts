import dotenv from 'dotenv';
import { query } from './src/data/db.js';

dotenv.config();

async function testHttp() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
        console.log("Generating OTP HTTP...");
        const email = "test_http@example.com";
        const resGen = await fetch('http://localhost:3001/api/otp/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const genData = await resGen.json();
        console.log("Gen Data:", genData);

        const otpId = genData.otpId;

        // Fetch the code from DB to know what it is
        const dbRes = await query("SELECT otp_code, expires_at FROM min_cultura.otp_codes WHERE id = $1", [otpId]);
        const otpCode = dbRes.rows[0].otp_code;

        console.log("Validating OTP HTTP...");
        const resVal = await fetch('http://localhost:3001/api/otp/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                otpId,
                email,
                otpCode,
                full_name: "Test User HTTP",
                phone_number: "123456",
                authorizes_data_treatment: true,
                accepts_terms_conditions: true,
                accepts_privacy_policy: true
            })
        });
        const valData = await resVal.json();
        console.log("Val Data:", valData);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

testHttp();
