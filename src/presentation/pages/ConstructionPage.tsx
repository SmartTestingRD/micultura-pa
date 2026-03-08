import React from 'react';
import { SidebarPortal } from '../components/portal/SidebarPortal';
import { HeaderPortal } from '../components/portal/HeaderPortal';
import { Settings, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ConstructionPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            <SidebarPortal isPublished={true} />

            <div className="flex-1 flex flex-col min-w-0">
                <HeaderPortal />

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-lg">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <Settings size={80} className="text-[#1d4ed8] animate-[spin_4s_linear_infinite]" />
                                <Settings size={40} className="text-slate-300 absolute -bottom-2 -right-2 animate-[spin_3s_linear_infinite_reverse]" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">En Construcción</h2>
                        <p className="text-slate-600 mb-8 text-lg">
                            Esta sección del portal está siendo desarrollada por el equipo técnico del Ministerio de Cultura. ¡Pronto estará disponible!
                        </p>
                        <Link
                            to="/portal"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1d4ed8] text-white rounded-xl hover:bg-blue-800 font-medium transition-colors shadow-sm"
                        >
                            <ArrowLeft size={18} />
                            Volver al Inicio
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
