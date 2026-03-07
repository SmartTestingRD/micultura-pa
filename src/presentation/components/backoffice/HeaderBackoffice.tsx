import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeaderBackoffice: React.FC = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("Usuario Autenticado");
    const [userRole, setUserRole] = useState("Ciudadano");

    useEffect(() => {
        const token = localStorage.getItem('sicultura_jwt');
        if (token) {
            try {
                // Parse JWT payload (middle segment)
                const payloadStr = atob(token.split('.')[1]);
                const payload = JSON.parse(payloadStr);

                if (payload.full_name) {
                    setUserName(payload.full_name);
                } else if (payload.email) {
                    setUserName(payload.email);
                }

                if (payload.role) {
                    setUserRole(payload.role === 'citizen' ? 'Ciudadano' : payload.role);
                }
            } catch (e) {
                console.error("Error parsing JWT:", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sicultura_jwt');
        navigate('/');
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-[50]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <img src="/logo_micultura.png" alt="Sicultura Panamá Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-slate-900 border-l border-slate-300 pl-4 h-8 flex items-center">
                            Backoffice
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-900 leading-tight block">{userName}</span>
                            <span className="text-xs text-slate-500 font-medium">{userRole}</span>
                        </div>

                        <div className="h-8 w-px bg-slate-200"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium text-sm group"
                            title="Cerrar sesión"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">logout</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
