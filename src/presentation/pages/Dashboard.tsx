import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HeaderPortal } from '../components/portal/HeaderPortal';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <HeaderPortal />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in-up">
                    <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl">travel_explore</span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido, {user?.full_name || 'Ciudadano'}</h1>
                    <p className="text-slate-500 text-lg max-w-lg mx-auto">
                        Has iniciado sesión correctamente en el Portal Ciudadano. Desde aquí podrás gestionar tus perfiles públicos y acceder a los recursos del Ministerio de Cultura.
                    </p>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl text-left">
                        {/* Placeholder Cards */}
                        <div className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white group">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-primary">person_check</span>
                                Mi Perfil Público
                            </h3>
                            <p className="text-sm text-slate-500">
                                Revisa el estado de aprobación de tu perfil de Artista, Gestor o Espacio Cultural.
                            </p>
                        </div>

                        <div className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white group">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-primary">campaign</span>
                                Convocatorias
                            </h3>
                            <p className="text-sm text-slate-500">
                                Explora y postúlate a las últimas convocatorias, becas y fondos concursables.
                            </p>
                        </div>

                        <div className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white group">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-primary">support_agent</span>
                                Soporte
                            </h3>
                            <p className="text-sm text-slate-500">
                                ¿Necesitas ayuda con tu registro? Escríbenos o consulta las preguntas frecuentes.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Sistema de Información Cultural (Sicultura) - Portal Ciudadano
                </div>
            </footer>
        </div>
    );
}
