import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const SidebarBackoffice: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
        { name: 'Perfiles Creados', icon: 'pending_actions', path: '/admin/profiles/pending' },
        { name: 'Directorio Aprobado', icon: 'storefront', path: '/admin/directory' },
        { name: 'Usuarios Internos', icon: 'manage_accounts', path: '/admin/users' },
        { name: 'Catálogos', icon: 'category', path: '/admin/catalogs' },
    ];

    return (
        <aside className="w-64 bg-slate-900 min-h-[calc(100vh-4rem)] flex flex-col shadow-inner sticky top-16">
            <nav className="flex-1 px-3 py-6 space-y-2">
                {menuItems.map((item) => {
                    // Exact match for /admin, prefix match for others to keep active state
                    const isActive = item.path === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.path);

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                    <div className="text-xs">
                        <span className="block text-slate-300 font-bold mb-0.5">Sistema Online</span>
                        <span className="text-slate-500">v1.2.0</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
