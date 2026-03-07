import dotenv from 'dotenv';
import { generateAndSendOTP, validateOTP } from './src/server/services/otpService.js';
import { query } from './src/data/db.js';

dotenv.config();

async function test() {
    try {
        console.log("Generating OTP...");
        const email = "test@example.com";
        const otpId = await generateAndSendOTP(email);
        console.log("Generated UUID:", otpId);

        // Fetch the code from DB to know what it is
        const res = await query("SELECT otp_code, expires_at FROM min_cultura.otp_codes WHERE id = $1", [otpId]);
        const otpCode = res.rows[0].otp_code;
        const expiresAt = res.rows[0].expires_at;
        console.log("Code:", otpCode, "Expires:", expiresAt, "Now:", new Date());

        console.log("Validating OTP...");
        const isValid = await validateOTP(otpId, email, otpCode);
        console.log("Is Valid?", isValid);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

test();
