import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderBackoffice } from '../../components/backoffice/HeaderBackoffice';

export const BackofficeHome: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('sicultura_jwt');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <HeaderBackoffice />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl">dashboard</span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido al Backoffice</h1>
                    <p className="text-slate-500 text-lg max-w-lg mx-auto">
                        Has validado tu correo correctamente o iniciado sesión. Desde aquí podrás gestionar tus fichas e interactuar con el Ministerio de Cultura.
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl text-left">
                        {/* Placeholder Cards */}
                        <div className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">description</span>
                                Mis Fichas
                            </h3>
                            <p className="text-sm text-slate-500">Administra o crea nuevos registros en el sistema cultural.</p>
                        </div>

                        <div className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                                Mi Perfil
                            </h3>
                            <p className="text-sm text-slate-500">Actualiza tu información personal y datos de contacto.</p>
                        </div>

                        <div className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">help</span>
                                Ayuda
                            </h3>
                            <p className="text-sm text-slate-500">Accede a tutoriales y centro de soporte al ciudadano.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Sistema de Información Cultural (Sicultura) - Ministerio de Cultura de Panamá
                </div>
            </footer>
        </div>
    );
};
