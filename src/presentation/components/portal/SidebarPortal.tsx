import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Image as ImageIcon, PlusCircle, Clock, QrCode, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarPortalProps {
    isPublished?: boolean;
}

export const SidebarPortal: React.FC<SidebarPortalProps> = ({ isPublished = false }) => {
    const { user } = useAuth();

    // User role extraction
    let roleDisplay = "NO VERIFICADO";
    if (user?.role === 'CULTURAL_AGENT') roleDisplay = "AGENTE CULTURAL";
    if (user?.role === 'SPACE') roleDisplay = "ESPACIO CULTURAL";

    // Display name
    const displayName = user?.full_name || user?.email || "Usuario";
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <aside className="w-64 bg-[#0a192f] text-slate-300 flex flex-col min-h-screen font-sans border-r border-[#112240] shrink-0">
            {/* Logo Area */}
            <div className="p-6 border-b border-[#112240] flex flex-col items-center justify-center">
                <img src="/logo_micultura.png" alt="Logo Ministerio" className="h-12 w-auto mb-4 brightness-0 invert" />
                <div className="text-center w-full">
                    <h2 className="text-white font-bold text-sm leading-tight">Ministerio de Cultura</h2>
                    <p className="text-[#e23c4a] font-bold text-xs mt-1 uppercase tracking-wider">Portal de Creadores</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-6 px-4 space-y-2">
                <NavLink
                    to="/portal"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                            ? 'bg-[#1d4ed8] text-white'
                            : 'hover:bg-[#112240] hover:text-white'
                        }`
                    }
                >
                    <Home size={20} />
                    Inicio
                </NavLink>

                <NavLink
                    to="/portal/obras"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${!isPublished ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''} ${isActive
                            ? 'bg-[#1d4ed8] text-white'
                            : 'hover:bg-[#112240] hover:text-white'
                        }`
                    }
                >
                    <ImageIcon size={20} />
                    Mis Obras / Piezas
                </NavLink>

                <NavLink
                    to="/portal/registrar-obra"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${!isPublished ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''} ${isActive
                            ? 'bg-[#1d4ed8] text-white'
                            : 'hover:bg-[#112240] hover:text-white'
                        }`
                    }
                >
                    <PlusCircle size={20} />
                    Registrar Obra
                </NavLink>

                <NavLink
                    to="/portal/revision"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${!isPublished ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''} ${isActive
                            ? 'bg-[#1d4ed8] text-white'
                            : 'hover:bg-[#112240] hover:text-white'
                        }`
                    }
                >
                    <Clock size={20} />
                    En Revisión / Obs.
                </NavLink>

                <NavLink
                    to="/portal/codigos"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${!isPublished ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''} ${isActive
                            ? 'bg-[#1d4ed8] text-white'
                            : 'hover:bg-[#112240] hover:text-white'
                        }`
                    }
                >
                    <QrCode size={20} />
                    Códigos & Etiquetas
                </NavLink>

                <NavLink
                    to="/portal/certificados"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${!isPublished ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''} ${isActive
                            ? 'bg-[#1d4ed8] text-white'
                            : 'hover:bg-[#112240] hover:text-white'
                        }`
                    }
                >
                    <Award size={20} />
                    Certificados
                </NavLink>
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-[#112240] flex items-center gap-3 bg-[#081324]">
                <div className="w-10 h-10 rounded-full bg-[#e23c4a] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {userInitial}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white font-bold text-sm truncate">{displayName}</span>
                    <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">{roleDisplay}</span>
                </div>
            </div>
        </aside>
    );
};
