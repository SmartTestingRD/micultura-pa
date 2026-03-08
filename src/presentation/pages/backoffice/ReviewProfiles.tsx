import React, { useEffect, useState } from 'react';
import { HeaderBackoffice } from '../../components/backoffice/HeaderBackoffice';
import { SidebarBackoffice } from '../../components/backoffice/SidebarBackoffice';
import { ReviewModal } from '../../components/backoffice/ReviewModal';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Clock, CheckCircle, AlertCircle, PauseCircle } from 'lucide-react';

interface PendingProfile {
    entity_id: string;
    entity_type: string;
    profile_name: string;
    description: string;
    province: string;
    status: string;
    created_at: string;
    citizen_name: string;
    contact_email: string;
    contact_phone: string;
    metadata?: any;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    let month = date.toLocaleString('es-ES', { month: 'short' });
    month = month.replace('.', '').substring(0, 3).toUpperCase();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getEntityTypeLabel = (type: string) => {
    switch (type) {
        case 'CULTURAL_AGENT': return 'Gestor Cultural';
        case 'SPACE': return 'Espacio Cultural';
        case 'GROUP': return 'Agrupación';
        case 'COMPANY': return 'Empresa Cultural';
        case 'FESTIVAL': return 'Festival';
        default: return type.replace(/_/g, ' ');
    }
};

export const ReviewProfiles: React.FC = () => {
    const { token } = useAuth();
    const [profiles, setProfiles] = useState<PendingProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<PendingProfile | null>(null);
    const [statusFilter, setStatusFilter] = useState('PENDING');

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/backoffice/profiles/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to fetch profiles');

            const data = await res.json();
            setProfiles(data.profiles || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfiles();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <HeaderBackoffice />

            <div className="flex flex-1">
                <SidebarBackoffice />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Todos los Ciudadanos</h1>
                                <p className="text-slate-500 mt-1">Gestión y control de acceso de agentes culturales al portal.</p>
                            </div>
                        </div>

                        {/* STATUS CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { status: 'PENDING', label: 'Pendientes', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
                                { status: 'CONFIRMED', label: 'Confirmados', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
                                { status: 'REJECTED', label: 'Rechazados', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
                                { status: 'PAUSED', label: 'En Pausa', icon: PauseCircle, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' }
                            ].map((card) => {
                                const count = profiles.filter(p => p.status === card.status).length;
                                const isSelected = statusFilter === card.status;
                                const Icon = card.icon;

                                return (
                                    <div
                                        key={card.status}
                                        onClick={() => setStatusFilter(card.status)}
                                        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 ${isSelected
                                            ? `ring-2 ring-primary border-primary shadow-md bg-white`
                                            : `border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm`
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-500 mb-1">{card.label}</p>
                                                <h3 className="text-3xl font-bold text-slate-900">{count}</h3>
                                            </div>
                                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                                <Icon className={card.color} size={24} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 font-medium">
                                Error: {error}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Fecha</th>
                                            <th className="px-6 py-4">Tipo</th>
                                            <th className="px-6 py-4">Nombre Comercial / Artístico</th>
                                            <th className="px-6 py-4">Ciudadano Registrante</th>
                                            <th className="px-6 py-4 text-center">Estado</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center">
                                                    <Loader2 className="animate-spin text-primary inline-block mb-2" size={32} />
                                                    <p className="text-slate-500 font-medium">Cargando perfiles...</p>
                                                </td>
                                            </tr>
                                        ) : profiles.filter(p => p.status === statusFilter).length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                                    No hay ciudadanos en estado {statusFilter} en este momento.
                                                </td>
                                            </tr>
                                        ) : (
                                            profiles.filter(p => p.status === statusFilter).map((profile) => (
                                                <tr key={profile.entity_id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {formatDate(profile.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-900">
                                                        {getEntityTypeLabel(profile.entity_type)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800">{profile.profile_name}</div>
                                                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                                            {profile.province || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-700">{profile.citizen_name}</div>
                                                        <div className="text-xs text-slate-500">{profile.contact_email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {profile.status === 'PENDING' && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Pendiente
                                                            </span>
                                                        )}
                                                        {profile.status === 'CONFIRMED' && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Confirmado
                                                            </span>
                                                        )}
                                                        {profile.status === 'REJECTED' && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Rechazado
                                                            </span>
                                                        )}
                                                        {profile.status === 'PAUSED' && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> En Pausa
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            className="text-primary hover:text-red-800 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                            onClick={() => setSelectedProfile(profile)}
                                                        >
                                                            Evaluar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <ReviewModal
                isOpen={!!selectedProfile}
                onClose={() => setSelectedProfile(null)}
                profile={selectedProfile}
                onReviewed={fetchProfiles}
            />
        </div>
    );
};
