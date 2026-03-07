import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Ensure environment variables are loaded if not already handled centrally
import dotenv from 'dotenv';
dotenv.config();

const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

interface EmailParams {
    to: string;
    subject: string;
    htmlBody: string;
}

/**
 * Transversal functionality to send emails using AWS SES
 */
export const sendEmail = async ({ to, subject, htmlBody }: EmailParams) => {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.error("Missing AWS SES credentials in environment factors.");
        throw new Error("Missing email credentials");
    }

    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        // IMPORTANT: In a real environment, this source email must be verified in AWS SES.
        // For sandbox mode, both sender and recipient must be verified.
        Source: process.env.AWS_SES_SENDER || "registro@sicultura.gob.pa", // Placeholder: requires verified identity in AWS SES
    };

    try {
        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        console.log(`Email sent successfully to ${to}. MessageId: ${response.MessageId}`);
        return response;
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw error;
    }
};
