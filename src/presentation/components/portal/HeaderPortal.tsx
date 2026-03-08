import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const HeaderPortal: React.FC = () => {
    const { user, logout } = useAuth();

    // Display name
    const displayName = user?.full_name || user?.email || "Usuario Autenticado";

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-[40]">
            <div className="px-6">
                <div className="flex justify-end items-center h-16">
                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-900">{displayName}</span>
                            <div className="w-8 h-8 rounded-full bg-[#cc2233] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="h-6 w-px bg-slate-200"></div>

                        <button
                            onClick={logout}
                            className="flex items-center text-slate-400 hover:text-red-600 transition-colors"
                            title="Cerrar sesión"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
