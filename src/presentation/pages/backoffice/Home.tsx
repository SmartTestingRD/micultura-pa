import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderBackoffice } from '../../components/backoffice/HeaderBackoffice';

import { SidebarBackoffice } from '../../components/backoffice/SidebarBackoffice';

export const BackofficeHome: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('sicultura_jwt');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <HeaderBackoffice />

            <div className="flex flex-1">
                <SidebarBackoffice />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
                            <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl">dashboard</span>
                            </div>

                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido al Backoffice</h1>
                            <p className="text-slate-500 text-lg max-w-lg mx-auto">
                                Has iniciado sesión correctamente. Desde aquí podrás gestionar fichas y catálogos institucionales.
                            </p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl text-left">
                                {/* Dashboard summary cards could go here */}
                                <div className="p-6 border border-slate-100 rounded-xl bg-slate-50">
                                    <h3 className="font-bold text-slate-800 mb-1">Métricas Próximamente</h3>
                                    <p className="text-sm text-slate-500">Espacio para gráficas.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
