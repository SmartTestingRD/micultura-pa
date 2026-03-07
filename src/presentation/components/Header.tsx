import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { RegistrationModal } from './RegistrationModal';
import { LoginModal } from './LoginModal';

export const Header: React.FC = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface-light/80 dark:bg-background-dark/80 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                            <img src="/logo_micultura.png" alt="Sicultura Panamá Logo" className="h-12 w-auto" />
                        </Link>
                        <nav className="hidden md:flex space-x-8">
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors" to="/directorio">Directorio</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors" to="/mapa">Mapa</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors" to="/estadisticas">Estadísticas</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors" to="/novedades">Novedades</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors" to="/documentos">Documentos</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button
                                id="btn-login"
                                onClick={() => setIsLoginOpen(true)}
                                className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium cursor-pointer transition-colors"
                            >
                                Login
                            </button>
                            <button
                                id="btn-register"
                                onClick={() => setIsRegisterOpen(true)}
                                className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25 cursor-pointer"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />
            <RegistrationModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
            />
        </>
    );
};
