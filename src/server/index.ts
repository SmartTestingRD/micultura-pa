import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginHandler from '../../api/login';
import loginGenerateHandler from '../../api/login/generate';
import loginValidateHandler from '../../api/login/validate';
import proxyHandler from '../../api/proxy';
import otpGenerateHandler from '../../api/otp/generate';
import otpValidateHandler from '../../api/otp/validate';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount the serverless functions to emulate Vercel behavior in local setup
app.post('/api/login', (req, res) => {
    const handler = (loginHandler as any).default || loginHandler;
    return handler(req, res);
});
app.post('/api/login/generate', (req, res) => {
    const handler = (loginGenerateHandler as any).default || loginGenerateHandler;
    return handler(req, res);
});
app.post('/api/login/validate', (req, res) => {
    const handler = (loginValidateHandler as any).default || loginValidateHandler;
    return handler(req, res);
});
app.post('/api/proxy', (req, res) => {
    const handler = (proxyHandler as any).default || proxyHandler;
    return handler(req, res);
});
app.post('/api/otp/generate', (req, res) => {
    const handler = (otpGenerateHandler as any).default || otpGenerateHandler;
    return handler(req, res);
});
app.post('/api/otp/validate', (req, res) => {
    const handler = (otpValidateHandler as any).default || otpValidateHandler;
    return handler(req, res);
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', environment: 'development' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
