import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';

const Login: React.FC = () => {
    const [email, setEmail] = useState('admin@cultura.gob.pa');
    const [password, setPassword] = useState('admin');
    const { adminLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await adminLogin({ email, password });
        } catch {
            setError('Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="relative bg-white dark:bg-surface-dark w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="p-8">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <img src="/logo_micultura.png" alt="Sicultura Panamá Logo" className="h-16 w-auto mb-4 drop-shadow-sm" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
                            Inicia sesión para acceder al sistema administrativo.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                id="admin-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-60"
                                placeholder="tu@correo.com"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                id="admin-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-60"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full bg-secondary hover:bg-red-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg px-4 py-3 mt-4 transition-colors shadow-lg shadow-secondary/30"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Directory from './pages/Directory';
import Documents from './pages/Documents';
import Statistics from './pages/Statistics';
import MapPage from './pages/MapPage';
import News from './pages/News';
import About from './pages/About';
import RegisterWork from './pages/RegisterWork';
import { BackofficeHome } from './pages/backoffice/Home';
import { ReviewProfiles } from './pages/backoffice/ReviewProfiles';

const CitizenRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (isAdmin) return <Navigate to="/admin" replace />;
    return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) return <Login />;
    if (!isAdmin) return <Navigate to="/portal" replace />;
    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/index.html" element={<Navigate to="/" replace />} />
                        <Route path="/directorio.html" element={<Directory />} />
                        <Route path="/documentos.html" element={<Documents />} />
                        <Route path="/estadisticas.html" element={<Statistics />} />
                        <Route path="/mapa.html" element={<MapPage />} />
                        <Route path="/novedades.html" element={<News />} />
                        <Route path="/sobre_sicultura.html" element={<About />} />

                        <Route path="/directorio" element={<Directory />} />
                        <Route path="/documentos" element={<Documents />} />
                        <Route path="/estadisticas" element={<Statistics />} />
                        <Route path="/mapa" element={<MapPage />} />
                        <Route path="/novedades" element={<News />} />
                        <Route path="/sobre" element={<About />} />

                        {/* Citizen Dashboard Routes */}
                        <Route
                            path="/portal"
                            element={
                                <CitizenRoute>
                                    <Dashboard />
                                </CitizenRoute>
                            }
                        />
                        <Route
                            path="/portal/registrar-obra"
                            element={
                                <CitizenRoute>
                                    <RegisterWork />
                                </CitizenRoute>
                            }
                        />

                        {/* Admin/Backoffice Routes */}
                        <Route
                            path="/admin/*"
                            element={
                                <AdminRoute>
                                    <Routes>
                                        <Route path="" element={<BackofficeHome />} />
                                        <Route path="profiles/pending" element={<ReviewProfiles />} />
                                    </Routes>
                                </AdminRoute>
                            }
                        />


                        <Route
                            path="/backoffice"
                            element={<Navigate to="/admin" replace />}
                        />

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}
