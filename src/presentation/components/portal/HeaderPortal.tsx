import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const HeaderPortal: React.FC = () => {
    const { user, logout } = useAuth();

    // User role display
    let roleDisplay = "Ciudadano";
    if (user?.role === 'CULTURAL_AGENT') roleDisplay = "Agente Cultural";
    if (user?.role === 'SPACE') roleDisplay = "Espacio Cultural";

    // Display name
    const displayName = user?.full_name || user?.email || "Usuario Autenticado";

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-[50]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <img src="/logo_micultura.png" alt="Sicultura Panamá Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-slate-900 border-l border-slate-300 pl-4 h-8 flex items-center">
                            Portal Ciudadano
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-900 leading-tight block">{displayName}</span>
                            <span className="text-xs text-slate-500 font-medium">{roleDisplay}</span>
                        </div>

                        <div className="h-8 w-px bg-slate-200"></div>

                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium text-sm group cursor-pointer"
                            title="Cerrar sesión"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">logout</span>
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
