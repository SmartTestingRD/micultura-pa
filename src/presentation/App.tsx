import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';


const Login: React.FC = () => {
    const [email, setEmail] = useState('admin@cultura.gob.pa');
    const [password, setPassword] = useState('admin');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login({ email, password });
        } catch {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-800">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-center mb-8">System Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl mt-4 hover:bg-indigo-700 transition"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Login />;
};

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Directory from './pages/Directory';
import Documents from './pages/Documents';
import Statistics from './pages/Statistics';
import MapPage from './pages/MapPage';
import News from './pages/News';
import About from './pages/About';
import { BackofficeHome } from './pages/backoffice/Home';

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

                        {/* Backward compatibility for friendly URLs */}
                        <Route path="/directorio" element={<Directory />} />
                        <Route path="/documentos" element={<Documents />} />
                        <Route path="/estadisticas" element={<Statistics />} />
                        <Route path="/mapa" element={<MapPage />} />
                        <Route path="/novedades" element={<News />} />
                        <Route path="/sobre" element={<About />} />

                        {/* Admin/Protected Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Backoffice Route */}
                        <Route
                            path="/backoffice"
                            element={<BackofficeHome />}
                        />

                        {/* Catch all route - can be modified later to 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

