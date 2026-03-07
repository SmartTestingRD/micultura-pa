import { Pool } from 'pg';
import dotenv from 'dotenv';
import { sendEmail } from './emailService.js';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Generates an HTML template for the OTP email matching the MIN CULTURA landing design.
 */
const generateOTPEmailTemplate = (otpCode: string, expiresInMinutes: number, type: 'registration' | 'login' = 'registration') => {
    const actionText = type === 'login'
        ? '<strong>iniciar sesión</strong> como usuario'
        : '<strong>registrarte</strong> como usuario';
    const actionContinuation = type === 'login'
        ? 'acceso'
        : 'registro';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación - Sicultura</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #f1f5f9;
        }
        .header {
            background-color: #0f2854; /* Dark blue from landing */
            padding: 32px 24px;
            text-align: center;
        }
        .content {
            padding: 40px 32px;
            text-align: center;
        }
        h1 {
            color: #ffffff;
            font-size: 24px;
            margin: 0;
            font-weight: 800;
        }
        .subtitle {
            color: #94a3b8;
            font-size: 14px;
            margin-top: 8px;
        }
        p {
            font-size: 16px;
            margin-bottom: 24px;
            color: #475569;
        }
        .otp-container {
            background-color: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 900;
            color: #0d6efd; /* Primary blue */
            letter-spacing: 12px;
            margin: 0;
            font-family: monospace;
        }
        .warning {
            font-size: 14px;
            color: #e73b50; /* Red from landing */
            font-weight: 600;
            background-color: #fef2f2;
            padding: 12px;
            border-radius: 8px;
            display: inline-block;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Sicultura Panamá</h1>
            <div class="subtitle">Ministerio de Cultura</div>
        </div>
        <div class="content">
            <h2 style="color: #0f2854; margin-top: 0;">Código de Verificación</h2>
            <p>Hola,</p>
            <p>Has solicitado ${actionText} en el Sistema de Información Cultural de Panamá. Utiliza el siguiente código para continuar con tu ${actionContinuation}:</p>
            
            <div class="otp-container">
                <div class="otp-code">${otpCode}</div>
            </div>
            
            <div class="warning">
                Este código expira en ${expiresInMinutes} minutos.
            </div>
            
            <p style="margin-top: 32px; font-size: 14px;">Si no solicitaste este código, puedes ignorar este correo de forma segura.</p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Ministerio de Cultura de Panamá. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Generates a 6-digit numeric OTP.
 */
const generateNumericOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generates an OTP, stores it in the database, and sends it via email.
 * Returns the UUID of the generated OTP record.
 */
export const generateAndSendOTP = async (email: string, type: 'registration' | 'login' = 'registration'): Promise<string> => {
    const otpCode = generateNumericOTP();
    const expirationMinutes = parseInt(process.env.OTP_EXPIRATION_MINUTES || '5', 10);

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    // Insert into database
    const query = `
        INSERT INTO min_cultura.otp_codes (email, otp_code, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [email, otpCode, expiresAt.toISOString()];

    try {
        const result = await pool.query(query, values);
        const otpId = result.rows[0].id;

        // Send Email
        const htmlBody = generateOTPEmailTemplate(otpCode, expirationMinutes, type);
        await sendEmail({
            to: email,
            subject: 'Tu Código de Verificación - Sicultura',
            htmlBody
        });

        return otpId; // Return UUID to the frontend
    } catch (error) {
        console.error("Error generating/sending OTP:", error);
        throw new Error("Failed to generate and send OTP");
    }
};

/**
 * Validates an OTP based on the UUID, the code itself, and expiration.
 */
export const validateOTP = async (otpId: string, email: string, otpCode: string): Promise<boolean> => {
    const query = `
        SELECT * FROM min_cultura.otp_codes 
        WHERE id = $1 AND email = $2 AND otp_code = $3 AND is_used = false
    `;
    const values = [otpId, email, otpCode];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return false; // Not found, already used, or mismatched
        }

        const otpRecord = result.rows[0];
        const now = new Date();
        const expiresAt = new Date(otpRecord.expires_at);

        if (now > expiresAt) {
            return false; // Expired
        }

        // Mark as used
        await pool.query('UPDATE min_cultura.otp_codes SET is_used = true WHERE id = $1', [otpId]);

        return true; // Validated successfully
    } catch (error) {
        console.error("Error validating OTP:", error);
        throw new Error("Failed to validate OTP");
    }
};
