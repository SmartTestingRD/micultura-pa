import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginHandler from '../../api/login';
import loginGenerateHandler from '../../api/login/generate';
import loginValidateHandler from '../../api/login/validate';
import proxyHandler from '../../api/proxy';
import otpGenerateHandler from '../../api/otp/generate';
import otpValidateHandler from '../../api/otp/validate';

import catalogsHandler from '../../api/catalogs/index';
import adminLoginHandler from '../../api/auth/admin-login';
import pendingProfilesHandler from '../../api/backoffice/profiles/pending';
import reviewProfilesHandler from '../../api/backoffice/profiles/review';

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
app.post('/api/auth/admin-login', (req, res) => {
    const handler = (adminLoginHandler as any).default || adminLoginHandler;
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
app.get('/api/catalogs', (req, res) => {
    const handler = (catalogsHandler as any).default || catalogsHandler;
    return handler(req, res);
});

// Backoffice Routes
app.get('/api/backoffice/profiles/pending', (req, res) => {
    const handler = (pendingProfilesHandler as any).default || pendingProfilesHandler;
    return handler(req, res);
});
app.post('/api/backoffice/profiles/review', (req, res) => {
    const handler = (reviewProfilesHandler as any).default || reviewProfilesHandler;
    return handler(req, res);
});

// Portal Routes
app.get('/api/portal/profile-status', async (req, res) => {
    const handler = (await import('../../api/portal/profile-status')).default;
    return handler(req as any, res as any);
});
app.get('/api/portal/catalogs/register-options', async (req, res) => {
    const handler = (await import('../../api/portal/catalogs/register-options')).default;
    return handler(req as any, res as any);
});
app.post('/api/portal/works/create', async (req, res) => {
    const handler = (await import('../../api/portal/works/create')).default;
    return handler(req as any, res as any);
});
app.post('/api/portal/works/upload', async (req, res) => {
    const handler = (await import('../../api/portal/works/upload')).default;
    return handler(req as any, res as any);
});
app.get('/api/portal/works/stats', async (req, res) => {
    const handler = (await import('../../api/portal/works/stats')).default;
    return handler(req as any, res as any);
});
app.get('/api/portal/works/list', async (req, res) => {
    const handler = (await import('../../api/portal/works/list')).default;
    return handler(req as any, res as any);
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', environment: 'development' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
